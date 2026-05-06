"""Amigos de La Tertulia - Backend FastAPI."""
from __future__ import annotations

import asyncio
import hashlib
import logging
import os
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Literal, Optional

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, FastAPI, Header, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
import stripe as stripe_sdk

# ─────────────────────────── Config ────────────────────────────
ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
MAGIC_LINK_SECRET = os.environ["MAGIC_LINK_SECRET"]
STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "sk_test_emergent")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
RESEND_FROM = os.environ.get("RESEND_FROM", "hola@amigoslatertulia.com")
RESEND_FROM_NAME = os.environ.get("RESEND_FROM_NAME", "Amigos de La Tertulia")
RESEND_REPLY_TO = os.environ.get("RESEND_REPLY_TO", "")
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "javier@amigoslatertulia.com")
FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "").rstrip("/")

# Configure official Stripe SDK
stripe_sdk.api_key = STRIPE_API_KEY

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("amigoslatertulia")

# ─────────────────────────── DB ────────────────────────────────
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]

# ─────────────────────────── Helpers ───────────────────────────
def new_id() -> str:
    return str(uuid.uuid4())

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

def iso(dt: Optional[datetime]) -> Optional[str]:
    return dt.isoformat() if dt else None

def clean_doc(doc: Optional[dict]) -> Optional[dict]:
    """Remove Mongo _id and convert datetimes to iso strings."""
    if not doc:
        return doc
    out = {k: v for k, v in doc.items() if k != "_id"}
    for k, v in list(out.items()):
        if isinstance(v, datetime):
            out[k] = v.isoformat()
    return out

# ─────────────────────────── Email (Resend) ───────────────────
async def send_email(to_email: str, subject: str, html: str) -> None:
    if not RESEND_API_KEY:
        log.warning("RESEND_API_KEY missing, skipping email to %s", to_email)
        return
    payload: dict[str, Any] = {
        "from": f"{RESEND_FROM_NAME} <{RESEND_FROM}>",
        "to": [to_email],
        "subject": subject,
        "html": html,
    }
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                json=payload,
                headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
                timeout=10.0,
            )
            response.raise_for_status()
    except Exception as e:
        log.error("Failed to send email to %s: %s", to_email, e)

# ─────────────────────────── Models ────────────────────────────
class UserOut(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    role: Literal["admin", "socio", "simpatizante"] = "simpatizante"
    member_since: Optional[str] = None
    status: Literal["active", "pending_payment", "inactive"] = "inactive"
    avatar_url: Optional[str] = None
    created_at: str

class MembershipOut(BaseModel):
    id: str
    name: Literal["Socio Protector", "Socio Colaborador", "Socio Joven"]
    price_monthly_eur: int
    price_yearly_eur: int
    benefits: list[str]
    active: bool = True

class MembershipDB(BaseModel):
    _id: str
    name: str
    price_monthly_eur: int
    price_yearly_eur: int
    benefits: list[str]
    stripe_price_monthly_id: Optional[str] = None
    stripe_price_yearly_id: Optional[str] = None
    active: bool = True
    created_at: str

class SubscriptionOut(BaseModel):
    id: str
    user_id: str
    membership_id: str
    stripe_subscription_id: str
    status: Literal["active", "past_due", "canceled", "incomplete"]
    current_period_end: str

class EventOut(BaseModel):
    id: str
    title: str
    date: str
    description: str
    image_url: Optional[str] = None
    capacity: int
    attendees_count: int = 0
    is_members_only: bool

class EventDB(BaseModel):
    _id: str
    title: str
    date: str
    description: str
    image_url: Optional[str] = None
    capacity: int
    attendee_ids: list[str] = []
    is_members_only: bool = False
    created_at: str

# Auth Models
class LoginRequest(BaseModel):
    email: EmailStr

class VerifyTokenRequest(BaseModel):
    token: str

class CheckoutRequest(BaseModel):
    membership_id: str
    billing_period: Literal["monthly", "yearly"] = "monthly"
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    success_url: Optional[str] = None
    cancel_url: Optional[str] = None

# ─────────────────────────── App ───────────────────────────────
app = FastAPI(
    title="Amigos de La Tertulia API",
    description="Plataforma de membresías para salvar La Tertulia",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

# ─────────────────────────── Auth Routes ─────────────────────
@api_router.post("/auth/request-link")
async def request_link(req: LoginRequest):
    """Envía un magic-link por email."""
    token = secrets.token_urlsafe(32)
    expires = now_utc() + timedelta(minutes=30)

    # Guardar token en DB
    await db.magic_links.insert_one({
        "_id": new_id(),
        "email": req.email,
        "token": token,
        "expires": expires,
        "created_at": now_utc(),
    })

    # Enviar email
    link = f"{FRONTEND_ORIGIN}/verify?token={token}"
    html = f"""
    <h2>Bienvenido a Amigos de La Tertulia</h2>
    <p>Haz clic en el enlace de abajo para entrar:</p>
    <p><a href="{link}" style="background:#722F37;color:white;padding:12px 24px;text-decoration:none;border-radius:4px;">Entrar</a></p>
    <p>Este enlace expira en 30 minutos.</p>
    """
    await send_email(req.email, "Tu enlace de acceso a Amigos de La Tertulia", html)

    return {"message": "Email enviado"}

@api_router.post("/auth/verify")
async def verify_token(req: VerifyTokenRequest):
    """Verifica magic-link y genera JWT."""
    # Buscar token
    magic_link = await db.magic_links.find_one({"token": req.token})
    if not magic_link:
        raise HTTPException(status_code=400, detail="Token inválido")

    if magic_link["expires"] < now_utc():
        raise HTTPException(status_code=400, detail="Token expirado")

    # Buscar o crear usuario
    user = await db.users.find_one({"email": magic_link["email"]})
    if not user:
        # Crear usuario
        user_id = new_id()
        role = "admin" if magic_link["email"] == ADMIN_EMAIL else "simpatizante"
        user_doc = {
            "_id": user_id,
            "email": magic_link["email"],
            "role": role,
            "status": "inactive",
            "created_at": now_utc(),
        }
        await db.users.insert_one(user_doc)
        user = user_doc
    else:
        user_id = user["_id"]

    # Borrar token usado
    await db.magic_links.delete_one({"token": req.token})

    # Generar JWT
    access_token_expires = timedelta(days=30)
    access_token = jwt.encode(
        {"sub": str(user_id), "exp": now_utc() + access_token_expires},
        JWT_SECRET,
        algorithm="HS256",
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": clean_doc(user),
    }

# ─────────────────────────── Stripe & Checkout ───────────────
@api_router.get("/memberships")
async def get_memberships():
    """Obtiene tipos de membresía disponibles."""
    memberships = await db.memberships.find({"active": True}).to_list(100)
    return [clean_doc(m) for m in memberships]

@api_router.post("/checkout/create")
async def create_checkout(req: CheckoutRequest):
    """Crea sesión de checkout de Stripe (modo suscripción)."""
    # Buscar membresía
    membership = await db.memberships.find_one({"_id": req.membership_id})
    if not membership:
        raise HTTPException(status_code=404, detail="Membresía no encontrada")

    # Elegir price ID según ciclo
    price_key = "stripe_price_monthly_id" if req.billing_cycle == "monthly" else "stripe_price_yearly_id"
    price_id = membership.get(price_key)
    if not price_id:
        raise HTTPException(status_code=400, detail="Price ID no configurado")

    # Buscar o crear usuario en Stripe
    stripe_sdk.api_key = STRIPE_API_KEY
    customers = stripe_sdk.Customer.list(email=req.email, limit=1)
    if customers.data:
        customer = customers.data[0]
    else:
        customer = stripe_sdk.Customer.create(
            email=req.email,
            name=req.name or req.email,
            metadata={"user_email": req.email}
        )

    # Crear sesión de checkout (modo suscripción)
    try:
        session = stripe_sdk.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            customer=customer.id,
            subscription_data={
                "metadata": {
                    "user_email": req.email,
                    "membership_id": req.membership_id,
                    "billing_cycle": req.billing_cycle,
                }
            },
            success_url=f"{FRONTEND_ORIGIN}/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_ORIGIN}/?cancelled=true",
        )
        return {"url": session.url}
    except Exception as e:
        log.error("Stripe error: %s", e)
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str):
    """Verifica estado de una sesión de checkout."""
    try:
        session = stripe_sdk.checkout.Session.retrieve(session_id)
        return {
            "status": session.status,
            "payment_status": session.payment_status,
            "subscription_id": session.subscription
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─────────────────────────── Webhooks ─────────────────────────
@app.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    """Webhook de Stripe para eventos de suscripción."""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')
    webhook_secret = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

    if not webhook_secret:
        raise HTTPException(status_code=500, detail="Webhook secret not configured")

    try:
        event = stripe_sdk.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe_sdk.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Manejar eventos
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        await handle_checkout_completed(session)

    elif event['type'] == 'customer.subscription.created':
        subscription = event['data']['object']
        await handle_subscription_created(subscription)

    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        await handle_subscription_deleted(subscription)

    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        await handle_payment_failed(invoice)

    return {"status": "success"}

async def handle_checkout_completed(session: stripe_sdk.checkout.Session):
    """Maneja checkout completado."""
    log.info("Checkout completed: %s", session.id)

async def handle_subscription_created(subscription: stripe_sdk.Subscription):
    """Activa socio cuando se crea la suscripción."""
    customer_id = subscription.customer
    customer = stripe_sdk.Customer.retrieve(customer_id)
    email = customer.email
    metadata = subscription.metadata

    # Actualizar usuario a socio activo
    user = await db.users.find_one({"email": email})
    if user:
        await db.users.update_one(
            {"_id": user["_id"]},
            {
                "$set": {
                    "role": "socio",
                    "status": "active",
                    "member_since": iso(now_utc()),
                }
            }
        )
        # Crear registro de suscripción
        await db.subscriptions.insert_one({
            "_id": new_id(),
            "user_id": user["_id"],
            "membership_id": metadata.get("membership_id"),
            "stripe_subscription_id": subscription.id,
            "status": "active",
            "current_period_end": iso(now_utc() + timedelta(seconds=subscription.current_period_end)),
            "created_at": now_utc(),
        })

async def handle_subscription_deleted(subscription: stripe_sdk.Subscription):
    """Desactiva socio cuando se cancela la suscripción."""
    await db.subscriptions.update_one(
        {"stripe_subscription_id": subscription.id},
        {"$set": {"status": "canceled"}}
    )
    # Actualizar usuario
    await db.users.update_many(
        {"status": "active"},  # Simplificado - debería buscar por subscription
        {"$set": {"status": "inactive"}}
    )

async def handle_payment_failed(invoice: stripe_sdk.Invoice):
    """Marca socio como pending_payment."""
    subscription_id = invoice.subscription
    await db.subscriptions.update_one(
        {"stripe_subscription_id": subscription_id},
        {"$set": {"status": "past_due"}}
    )

# ─────────────────────────── Include Router ─────────────────────
app.include_router(api_router)

# ─────────────────────────── Seed Data ─────────────────────────
@app.on_event("startup")
async def startup_event():
    """Crea datos iniciales si no existen."""
    # Crear membresías si no existen
    count = await db.memberships.count_documents({})
    if count == 0:
        log.info("Creating default memberships...")
        await db.memberships.insert_many([
            {
                "_id": new_id(),
                "name": "Socio Joven",
                "price_monthly_eur": 500,  # €5
                "price_yearly_eur": 5000,   # €50
                "benefits": ["Acceso a eventos", "Descuentos en consumiciones", "Voto en asamblea"],
                "stripe_price_monthly_id": None,  # Configurar en Stripe
                "stripe_price_yearly_id": None,
                "active": True,
                "created_at": now_utc(),
            },
            {
                "_id": new_id(),
                "name": "Socio Colaborador",
                "price_monthly_eur": 1000,  # €10
                "price_yearly_eur": 100000, # €100
                "benefits": ["Acceso a eventos", "Descuentos en consumiciones", "Voto en asamblea", "Invitado prioritario"],
                "stripe_price_monthly_id": None,
                "stripe_price_yearly_id": None,
                "active": True,
                "created_at": now_utc(),
            },
            {
                "_id": new_id(),
                "name": "Socio Protector",
                "price_monthly_eur": 2500,  # €25
                "price_yearly_eur": 250000, # €250
                "benefits": ["Todo lo anterior + ", "Nombre en pared del bar", "Evento exclusivo anual"],
                "stripe_price_monthly_id": None,
                "stripe_price_yearly_id": None,
                "active": True,
                "created_at": now_utc(),
            },
        ])

# ─────────────────────────── Health Check ─────────────────────
@app.get("/health")
async def health():
    return {"status": "healthy", "service": "amigos-la-tertulia"}

# ─────────────────────────── Stripe Routes (Compatibilidad Frontend) ───────
@app.post("/stripe/create-checkout")
async def create_checkout_stripe(req: CheckoutRequest):
    """Crea sesión de checkout de Stripe (modo suscripción)."""
    # Mapear membership_id por nombre
    membership_map = {
        "membership_joven": "Socio Joven",
        "membership_colaborador": "Socio Colaborador",
        "membership_protector": "Socio Protector"
    }

    # Buscar membresía por nombre
    membership_name = membership_map.get(req.membership_id)
    if not membership_name:
        raise HTTPException(status_code=404, detail="Tipo de membresía no válido")

    membership = await db.memberships.find_one({"name": membership_name})
    if not membership:
        raise HTTPException(status_code=404, detail="Membresía no encontrada")

    # Elegir price ID según ciclo
    billing_period = req.billing_period
    price_key = "stripe_price_monthly_id" if billing_period == "monthly" else "stripe_price_yearly_id"
    price_id = membership.get(price_key)

    # Si no hay price ID configurado, usar un ID de prueba
    if not price_id:
        log.warning("Price ID no configurado para %s (%s), usando placeholder", membership_name, price_key)
        # En modo test, esto fallará. En producción, configurar los price IDs.
        raise HTTPException(
            status_code=500,
            detail=f"Price ID no configurado para {membership_name} ({billing_period}). Configura stripe_price_monthly_id o stripe_price_yearly_id en la base de datos."
        )

    # Buscar o crear usuario en Stripe
    stripe_sdk.api_key = STRIPE_API_KEY
    try:
        customers = stripe_sdk.Customer.list(email=req.email, limit=1)
        if customers.data:
            customer = customers.data[0]
        else:
            customer = stripe_sdk.Customer.create(
                email=req.email,
                name=req.name if hasattr(req, 'name') and req.name else req.email.split('@')[0],
                metadata={"user_email": req.email}
            )

        # Crear sesión de checkout (modo suscripción)
        session = stripe_sdk.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[{
                "price": price_id,
                "quantity": 1,
            }],
            customer=customer.id,
            subscription_data={
                "metadata": {
                    "user_email": req.email,
                    "membership_id": str(membership["_id"]),
                    "membership_name": membership_name,
                    "billing_period": billing_period,
                }
            },
            success_url=req.success_url if hasattr(req, 'success_url') else f"{FRONTEND_ORIGIN}/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=req.cancel_url if hasattr(req, 'cancel_url') else f"{FRONTEND_ORIGIN}/?cancelled=true",
        )

        return {
            "checkout_url": session.url,
            "session_id": session.id
        }
    except stripe_sdk.error.StripeError as e:
        log.error("Stripe error: %s", e)
        raise HTTPException(status_code=500, detail=f"Error de Stripe: {str(e)}")

@app.get("/stripe/session/{session_id}")
async def get_stripe_session(session_id: str):
    """Obtiene detalles de una sesión de checkout."""
    try:
        session = stripe_sdk.checkout.Session.retrieve(session_id)
        return {
            "id": session.id,
            "status": session.status,
            "payment_status": session.payment_status,
            "subscription_id": session.subscription,
            "customer_email": session.customer_details.get('email') if session.customer_details else None,
            "amount_total": session.amount_total,
            "currency": session.currency
        }
    except stripe_sdk.error.StripeError as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
