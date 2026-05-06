"""Amigos de La Tertulia - Backend Simplificado (Sin MongoDB para Dev)."""
from __future__ import annotations

import json
import os
import secrets
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import stripe

# ─────────────────────────── Config ────────────────────────────
ROOT = Path(__file__).parent
load_dotenv(ROOT / ".env.dev")

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
JWT_SECRET = os.environ.get("JWT_SECRET", "dev_secret")
MAGIC_LINK_SECRET = os.environ.get("MAGIC_LINK_SECRET", "dev_magic_secret")
STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

# ─────────────────────────── FastAPI App ───────────────────────
app = FastAPI(title="Amigos de La Tertulia API")

# Configurar Stripe
if STRIPE_API_KEY:
    stripe.api_key = STRIPE_API_KEY
    print(f"✅ Stripe inicializado (modo: {'test' if 'sk_test' in STRIPE_API_KEY else 'live'})")
else:
    print("⚠️  STRIPE_API_KEY no configurada - pagos desactivados")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────── Data Storage (JSON) ───────────────
DATA_DIR = ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

USERS_FILE = DATA_DIR / "users.json"
TOKENS_FILE = DATA_DIR / "tokens.json"

def load_json(filepath: Path) -> dict:
    if filepath.exists():
        with open(filepath) as f:
            return json.load(f)
    return {}

def save_json(filepath: Path, data: dict):
    with open(filepath, "w") as f:
        json.dump(data, f, indent=2, default=str)

# ─────────────────────────── Models ────────────────────────────
class MagicLinkRequest(BaseModel):
    email: EmailStr

class VerifyTokenRequest(BaseModel):
    token: str

class UserOut(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    role: str
    member_since: Optional[str] = None
    membership_type: Optional[str] = None

class CheckoutRequest(BaseModel):
    membership_id: str  # 'joven', 'colaborador', 'protector'
    billing_period: str  # 'monthly' or 'yearly'
    email: EmailStr

# ─────────────────────────── Auth Endpoints ───────────────────
@app.post("/auth/request-link")
async def request_magic_link(request: MagicLinkRequest):
    """Envía un magic link al email del usuario (DEV: imprime en consola)."""
    users = load_json(USERS_FILE)
    tokens = load_json(TOKENS_FILE)

    # Crear usuario si no existe
    if request.email not in users:
        users[request.email] = {
            "id": str(uuid.uuid4()),
            "email": request.email,
            "name": None,
            "role": "socio" if request.email != "javier@amigoslatertulia.com" else "admin",
            "member_since": datetime.now().strftime("%Y-%m-%d"),
            "membership_type": "colaborador",
            "status": "active",
            "created_at": datetime.now().isoformat()
        }
        save_json(USERS_FILE, users)

    # Crear token magic link
    token = secrets.token_urlsafe(32)
    tokens[token] = {
        "email": request.email,
        "expires": (datetime.now() + timedelta(hours=24)).isoformat()
    }
    save_json(TOKENS_FILE, tokens)

    # EN DESARROLLO: Imprimir el enlace en consola
    magic_link = f"{FRONTEND_ORIGIN}/login/verify?token={token}"
    print(f"\n{'='*60}")
    print(f"🔗 MAGIC LINK PARA: {request.email}")
    print(f"{'='*60}")
    print(f"{magic_link}")
    print(f"{'='*60}\n")

    return {
        "message": "Magic link enviado (mira la consola del servidor)",
        "dev_link": magic_link  # Solo en desarrollo
    }

@app.post("/auth/verify")
async def verify_magic_link(request: VerifyTokenRequest):
    """Verifica el token magic link y devuelve el usuario."""
    tokens = load_json(TOKENS_FILE)
    users = load_json(USERS_FILE)

    if request.token not in tokens:
        raise HTTPException(status_code=400, detail="Token inválido")

    token_data = tokens[request.token]

    # Verificar expiración
    expires = datetime.fromisoformat(token_data["expires"])
    if datetime.now() > expires:
        del tokens[request.token]
        save_json(TOKENS_FILE, tokens)
        raise HTTPException(status_code=400, detail="Token expirado")

    # Obtener usuario
    email = token_data["email"]
    if email not in users:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user = users[email]

    # Crear JWT
    import jwt
    jwt_token = jwt.encode({
        "sub": user["id"],
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.now() + timedelta(days=30)
    }, JWT_SECRET, algorithm="HS256")

    # Eliminar token usado
    del tokens[request.token]
    save_json(TOKENS_FILE, tokens)

    return {
        "token": jwt_token,
        "user": {
            "id": user["id"],
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "member_since": user["member_since"],
            "membership_type": user["membership_type"]
        }
    }

# ─────────────────────────── Memberships ────────────────────────
@app.get("/memberships")
async def get_memberships():
    """Devuelve los tipos de membresía disponibles."""
    return [
        {
            "id": "joven",
            "name": "Socio Joven",
            "price_monthly": 5,
            "price_yearly": 50,
            "benefits": [
                "Acceso a eventos exclusivos",
                "10% descuento en consumiciones",
                "Carnet digital",
                "Voto en asamblea"
            ]
        },
        {
            "id": "colaborador",
            "name": "Socio Colaborador",
            "price_monthly": 10,
            "price_yearly": 100,
            "benefits": [
                "Todo lo de Socio Joven",
                "15% descuento en consumiciones",
                "Reserva prioritaria de mesa",
                "Invitado gratuito en cumpleaños"
            ]
        },
        {
            "id": "protector",
            "name": "Socio Protector",
            "price_monthly": 25,
            "price_yearly": 250,
            "benefits": [
                "Todo lo de Socio Colaborador",
                "20% descuento en consumiciones",
                "Mesa reservada permanente",
                "Evento privado anual incluido",
                "Tu nombre en el muro de honor"
            ]
        }
    ]

# ─────────────────────────── Stripe Checkout ───────────────────
# Mapeo de precios de Stripe (reemplazar con tus price IDs reales)
STRIPE_PRICES = {
    "joven": {
        "monthly": "price_joven_monthly",  # Reemplazar con ID real
        "yearly": "price_joven_yearly"
    },
    "colaborador": {
        "monthly": "price_colaborador_monthly",
        "yearly": "price_colaborador_yearly"
    },
    "protector": {
        "monthly": "price_protector_monthly",
        "yearly": "price_protector_yearly"
    }
}

@app.post("/stripe/create-checkout")
async def create_checkout(request: CheckoutRequest):
    """Crea una sesión de checkout de Stripe para suscripción."""
    if not STRIPE_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Stripe no está configurado. Contacta al administrador."
        )

    # Validar membership_id
    if request.membership_id not in STRIPE_PRICES:
        raise HTTPException(
            status_code=400,
            detail=f"Tipo de membresía inválido: {request.membership_id}"
        )

    # Validar billing_period
    if request.billing_period not in ["monthly", "yearly"]:
        raise HTTPException(
            status_code=400,
            detail=f"Periodo de facturación inválido: {request.billing_period}"
        )

    # Obtener price ID
    price_id = STRIPE_PRICES[request.membership_id][request.billing_period]

    try:
        checkout_session = stripe.checkout.Session.create(
            mode="subscription",
            payment_method_types=["card"],
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                }
            ],
            success_url=f"{FRONTEND_ORIGIN}/socio/dashboard?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_ORIGIN}/?cancelled=true",
            customer_email=request.email,
            metadata={
                "membership_type": request.membership_id,
                "billing_period": request.billing_period,
                "email": request.email
            }
        )

        return {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id
        }

    except Exception as e:
        print(f"❌ Error creating checkout session: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error al crear sesión de checkout: {str(e)}"
        )

@app.post("/stripe/webhook")
async def stripe_webhook(request: Request):
    """Procesa webhooks de Stripe."""
    if not STRIPE_WEBHOOK_SECRET:
        print("⚠️  STRIPE_WEBHOOK_SECRET no configurada")
        raise HTTPException(status_code=503, detail="Webhook secret no configurada")

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Payload inválido")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Firma inválida")

    # Manejar eventos
    users = load_json(USERS_FILE)
    subscriptions_file = DATA_DIR / "subscriptions.json"
    subscriptions = load_json(subscriptions_file)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session.get("customer_details", {}).get("email") or session.get("metadata", {}).get("email")

        if customer_email and customer_email in users:
            user = users[customer_email]
            membership_type = session.get("metadata", {}).get("membership_type", "colaborador")

            # Actualizar usuario
            user["membership_type"] = membership_type
            user["status"] = "active"
            user["stripe_customer_id"] = session.get("customer")
            user["subscription_id"] = session.get("subscription")
            save_json(USERS_FILE, users)

            # Guardar suscripción
            subscriptions[session["subscription"]] = {
                "user_id": user["id"],
                "email": customer_email,
                "membership_type": membership_type,
                "status": "active",
                "created_at": datetime.now().isoformat()
            }
            save_json(subscriptions_file, subscriptions)

            print(f"✅ Suscripción creada para {customer_email} ({membership_type})")

    elif event["type"] == "customer.subscription.deleted":
        subscription = event["data"]["object"]
        subscription_id = subscription.id

        if subscription_id in subscriptions:
            sub_data = subscriptions[subscription_id]
            email = sub_data["email"]

            if email in users:
                users[email]["status"] = "inactive"
                save_json(USERS_FILE, users)

            del subscriptions[subscription_id]
            save_json(subscriptions_file, subscriptions)

            print(f"⚠️  Suscripción cancelada para {email}")

    elif event["type"] == "invoice.payment_failed":
        invoice = event["data"]["object"]
        subscription_id = invoice.get("subscription")

        if subscription_id in subscriptions:
            email = subscriptions[subscription_id]["email"]

            if email in users:
                users[email]["status"] = "pending_payment"
                save_json(USERS_FILE, users)

            print(f"❌ Pago fallido para {email}")

    return {"status": "success"}

# ─────────────────────────── Health Check ──────────────────────
@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "mode": "dev_simple",
        "mongodb": "disabled (using JSON storage)",
        "timestamp": datetime.now().isoformat()
    }

# ─────────────────────────── Main ─────────────────────────────
if __name__ == "__main__":
    import uvicorn

    print("\n" + "="*60)
    print("🍷 AMIGOS DE LA TERTULIA - BACKEND SIMPLIFICADO")
    print("="*60)
    print(f"Modo: Desarrollo (Sin MongoDB)")
    print(f"Datos: {DATA_DIR}")
    print(f"Frontend: {FRONTEND_ORIGIN}")
    print("="*60 + "\n")

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
