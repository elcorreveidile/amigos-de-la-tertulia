# 🚀 Guía de Despliegue - Amigos de La Tertulia

## 📦 Arquitectura de Producción

```
                   ┌─────────────────┐
                   │   Vercel CDN    │
                   │  (Frontend)     │
                   │   React + Vite  │
                   └────────┬────────┘
                            │
                            │ API Calls
                            ▼
                   ┌─────────────────┐
                   │  Railway/Render │
                   │   (Backend)     │
                   │   FastAPI       │
                   └────────┬────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
      ┌─────────┐    ┌──────────┐    ┌──────────┐
      │ MongoDB │    │  Stripe  │    │  Resend  │
      │  Atlas  │    │  API     │    │  Email   │
      └─────────┘    └──────────┘    └──────────┘
```

---

## 🌐 Frontend: Vercel

### Paso 1: Instalar Vercel CLI

```bash
npm i -g vercel@latest
```

### Paso 2: Login y Deploy

```bash
cd frontend

# Login (solo primera vez)
vercel login

# Deploy inicial (preview)
vercel

# Deploy a producción
vercel --prod
```

### Paso 3: Configurar Variables de Entorno

En Vercel Dashboard → Settings → Environment Variables:

```bash
VITE_API_URL=https://tu-backend.railway.app
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Paso 4: Custom Domain (Opcional)

1. Vercel Dashboard → Settings → Domains
2. Añadir dominio: `amigoslatertulia.com`
3. Configurar DNS según instrucciones de Vercel

---

## 🔧 Backend: Railway

### Paso 1: Crear Proyecto en Railway

1. Ir a [railway.app](https://railway.app/)
2. Click "New Project" → "Deploy from GitHub repo"
3. Seleccionar repo `amigos-la-tertulia`
4. Railway detecta automáticamente que es Python/FastAPI

### Paso 2: Configurar Build

Railway crea un `railway.json` automáticamente. Si no, crear:

```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn server:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health"
  }
}
```

### Paso 3: Variables de Entorno

En Railway Dashboard → Variables:

```bash
# Required
MONGO_URL=mongodb+srv://...
DB_NAME=amigoslatertulia
JWT_SECRET=tu_secreto_super_aleatorio
MAGIC_LINK_SECRET=otro_secreto_super_aleatorio

# Stripe (Live mode)
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
RESEND_API_KEY=re_...
RESEND_FROM=hola@amigoslatertulia.com
RESEND_FROM_NAME=Amigos de La Tertulia

# Config
FRONTEND_ORIGIN=https://amigoslatertulia.com
ADMIN_EMAIL=javier@amigoslatertulia.com
PORT=8000
```

### Paso 4: MongoDB Atlas Integration

1. En Railway, ir a "New Variable"
2. Click "Add Reference"
3. Seleccionar plugin de MongoDB (si lo añadiste)
4. O pegar directamente el connection string de Atlas

### Paso 5: Verificar Deploy

Railway mostrará logs en tiempo real. Verificar:

- `[INFO] Application startup complete`
- `[INFO] Uvicorn running on port 8000`
- No errors en startup

---

## 🔔 Configurar Webhook de Stripe en Producción

### Paso 1: Obtener URL del Backend

```bash
# Railway genera URL como:
https://tu-backend.railway.app

# URL del webhook:
https://tu-backend.railway.app/webhook/stripe
```

### Paso 2: Configurar en Stripe Dashboard

1. Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://tu-backend.railway.app/webhook/stripe`
4. Eventos a escuchar:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click "Add endpoint"

### Paso 3: Copiar Webhook Secret

Stripe genera un secreto: `whsec_...`

1. Click en el endpoint creado
2. Copiar "Signing secret"
3. Añadir a `STRIPE_WEBHOOK_SECRET` en Railway

### Paso 4: Testear Webhook

```bash
# En el dashboard del webhook, click "Send test webhook"
# Seleccionar "checkout.session.completed"
# Verificar en logs de Railway que se recibe (200 OK)
```

---

## 🗄️ MongoDB Atlas Setup

### Paso 1: Crear Cluster

1. Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create "Free Cluster" (M0)
3. Seleccionar región: AWS eu-central-1 (Frankfurt)

### Paso 2: Configurar Security

1. Database Access → Create user:
   - Username: `amigoslatertulia`
   - Password: (generar seguro)
2. Network Access → Add IP:
   - IP: `0.0.0.0/0` (acceso desde cualquier lugar)

### Paso 3: Obtener Connection String

1. Click "Connect" → "Connect your application"
2. Copiar connection string:
```
mongodb+srv://amigoslatertulia:PASSWORD@cluster.mongodb.net/amigoslatertulia
```
3. Reemplazar `PASSWORD` con el password real
4. Añadir a `MONGO_URL` en Railway

### Paso 4: Crear Índices (Opcional pero recomendado)

```javascript
// En MongoDB Atlas → Collections, abrir shell:
db.users.createIndex({ email: 1 }, { unique: true })
db.subscriptions.createIndex({ stripe_subscription_id: 1 }, { unique: true })
db.users.createIndex({ role: 1 })
db.users.createIndex({ status: 1 })
```

---

## ✅ Verificación Post-Deploy

### Frontend (Vercel)

1. Abrir URL generada: `https://tu-app.vercel.app`
2. Verificar:
   - [ ] Landing page carga
   - [ ] Fuentes Playfair Display visibles
   - [ ] No errores en console (F12)
   - [ ] Toggle mensual/anual funciona

### Backend (Railway)

1. Abrir URL generada: `https://tu-backend.railway.app`
2. Verificar:
   - [ ] `/health` devuelve `{"status": "healthy"}`
   - [ ] `/docs` muestra Swagger UI
   - [ ] Logs sin errores

### Integration Test

1. En frontend, click "Hazte Socio"
2. Debe abrir Stripe Checkout (modo LIVE)
3. Pagar con tarjeta real
4. Verificar:
   - [ ] Redirección a Dashboard
   - [ ] Usuario creado en MongoDB
   - [ ] Suscripción en Stripe Dashboard
   - [ ] Email de bienvenida enviado

---

## 🔒 Security Hardening

### MongoDB

- [ ] IP whitelist en lugar de 0.0.0.0/0
- [ ] TLS/SSL activado (por defecto en Atlas)
- [ ] MFA activado en cuenta Atlas

### Backend

- [ ] CORS configurado solo para dominios permitidos
- [ ] Rate limiting implementado
- [ ] JWT secrets son fuertes (32+ caracteres)
- [ ] Logs no incluyen datos sensibles

### Frontend

- [ ] HTTPS forzado (Vercel lo hace por defecto)
- [ ] No sensitive data en localStorage (solo tokens)
- [ ] CSP headers configurados (opcional en Vercel)

### Stripe

- [ ] Webhook endpoint verificado con secret
- [ ] Modo LIVE activado (no TEST)
- [ ] Radar fraud detection activado

---

## 📊 Monitoring

### Frontend (Vercel Analytics)

```bash
# Instalar analytics en frontend
npm install @vercel/analytics

# En App.jsx o main.jsx:
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

### Backend (Railway Logs)

Railway tiene logs integrados. Para métricas avanzadas:

1. Railway → Metrics
2. Configurar alertas:
   - CPU > 80%
   - Memory > 80%
   - Response time > 1s

### MongoDB Atlas

1. Atlas → Metrics
2. Monitorizar:
   - Connections count
   - Query performance
   - Storage usage

### Stripe

1. Dashboard → Balance
2. Monitoring → Events
3. Radar → Fraud prevention

---

## 🔄 Continuous Deployment

### Automático con Git

**Frontend (Vercel):**
- Cada push a `main` → auto deploy a producción
- Cada PR → auto deploy a preview URL

**Backend (Railway):**
- Cada push a `main` → auto deploy
- Railway detecta cambios y rebuild

### Branch Strategy recomendado:

```
main (producción)
  ↑
  ├── develop (staging)
  └── feature/* (ramas de features)
```

---

## 🆘 Troubleshooting Producción

### Error: "CORS policy blocked"

**Frontend:**
```javascript
// Verificar VITE_API_URL es correcta
console.log(import.meta.env.VITE_API_URL)
```

**Backend:**
```python
# Verificar CORS incluye dominio production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://amigoslatertulia.com", "https://tu-app.vercel.app"],
    ...
)
```

### Error: "Webhook signature verification failed"

**Solución:**
1. Verificar `STRIPE_WEBHOOK_SECRET` en Railway
2. Copiar secret del webhook CORRECTO (live vs test)
3. Testear con stripe-cli en producción

### Error: "MongoDB connection timeout"

**Solución:**
1. Verificar IP whitelist en Atlas
2. Verificar connection string tiene password correcto
3. Verificar cluster no está suspendido

### Error: "Vercel deployment failed"

**Solución:**
1. Verificar build logs en Vercel
2. Probar build local: `npm run build`
3. Verificar variables de entorno

---

## 💰 Costos Estimados (Mensual)

| Servicio | Plan | Coste |
|----------|------|-------|
| Vercel (Frontend) | Hobby | $0 |
| Railway (Backend) | Starter | $5 |
| MongoDB Atlas | M0 Free | $0 |
| Stripe | Por transacción | 2.9% + €0.30 |
| Resend (Email) | Free | 3,000 emails/día |
| **Total** | | **~$5/mes** |

---

## 📞 Soporte en Producción

Si algo falla:

1. **Revisar logs:**
   - Vercel: Dashboard → Deployments → Logs
   - Railway: Dashboard → Logs
   - MongoDB: Atlas → Logs

2. **Verificar status:**
   - Vercel Status: https://www.vercel-status.com
   - Railway Status: https://status.railway.app
   - Stripe Status: https://status.stripe.com

3. **Rollback si es necesario:**
   - Vercel: Deployments → Revert
   - Railway: Redeploy previous commit

---

**Última actualización:** 2026-05-06
**Versión:** 1.0.0 Production Ready
