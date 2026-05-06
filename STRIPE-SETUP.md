# 🔳 Configuración de Stripe - Amigos de La Tertulia

Esta guía explica cómo configurar Stripe para aceptar pagos recurrentes (suscripciones) en la plataforma.

---

## 📋 Índice

1. [Crear cuenta de Stripe](#1-crear-cuenta-de-stripe)
2. [Crear Products y Prices](#2-crear-products-y-prices)
3. [Configurar Webhook](#3-configurar-webhook)
4. [Actualizar variables de entorno](#4-actualizar-variables-de-entorno)
5. [Actualizar price IDs en el código](#5-actualizar-price-ids-en-el-código)
6. [Probar el flujo de pago](#6-probar-el-flujo-de-pago)

---

## 1. Crear cuenta de Stripe

### Paso 1: Registrarse

1. Ve a https://dashboard.stripe.com/register
2. Regístrate con tu email
3. Completa la información básica del negocio

**Importante**: Durante el desarrollo, usa el modo **TEST** (no cargues dinero real).

### Paso 2: Obtener las claves API

1. En el dashboard, ve a **Developers** → **API keys**
2. Copia estas dos claves:
   - **Publishable key** (empieza con `pk_test_...`) → Para el frontend
   - **Secret key** (empieza con `sk_test_...`) → Para el backend

```
Ejemplo (modo test):
Publishable: pk_test_51ABC...
Secret: sk_test_51ABC...
```

---

## 2. Crear Products y Prices

Necesitas crear **3 products** (tipos de socio) con **2 prices** cada uno (mensual y anual).

### Paso 2.1: Crear Product "Socio Joven"

1. Ve a **Products** → **Add product**
2. Configura:
   - **Name**: `Socio Joven`
   - **Description**: `Membresía joven para estudiantes menores de 30 años`
   - **Pricing model**: `Subscription`
3. Añade **2 prices**:

#### Price 1: Mensual
- **Price**: €5.00 EUR
- **Interval**: `Monthly`
- **Currency**: `EUR`
- Copia el **Price ID** (ej: `price_1ABC...`)

#### Price 2: Anual
- **Price**: €50.00 EUR
- **Interval**: `Yearly`
- **Currency**: `EUR`
- Copia el **Price ID** (ej: `price_1XYZ...`)

### Paso 2.2: Crear Product "Socio Colaborador"

1. Crea nuevo product: **Socio Colaborador**
2. Añade **2 prices**:
   - **Mensual**: €10.00 EUR/month → Copia Price ID
   - **Anual**: €100.00 EUR/year → Copia Price ID

### Paso 2.3: Crear Product "Socio Protector"

1. Crea nuevo product: **Socio Protector**
2. Añade **2 prices**:
   - **Mensual**: €25.00 EUR/month → Copia Price ID
   - **Anual**: €250.00 EUR/year → Copia Price ID

### Resumen de Price IDs

Deberías tener **6 Price IDs**:

```javascript
{
  joven: {
    monthly: "price_1JovenMonthlyID",    // Reemplazar
    yearly: "price_1JovenYearlyID"       // Reemplazar
  },
  colaborador: {
    monthly: "price_1ColaboradorMonthlyID",  // Reemplazar
    yearly: "price_1ColaboradorYearlyID"     // Reemplazar
  },
  protector: {
    monthly: "price_1ProtectorMonthlyID",  // Reemplazar
    yearly: "price_1ProtectorYearlyID"     // Reemplazar
  }
}
```

---

## 3. Configurar Webhook

Los webhooks notifican al backend cuando ocurren eventos importantes (pago completado, suscripción cancelada, etc.).

### Paso 3.1: Crear endpoint de webhook

1. Ve a **Developers** → **Webhooks** → **Add endpoint**
2. Configura:
   - **Endpoint URL**: `https://tu-dominio-backend.com/stripe/webhook`
   - **Events to listen to**: Selecciona estos eventos:
     - `checkout.session.completed` → Cuando se completa un pago
     - `customer.subscription.deleted` → Cuando se cancela una suscripción
     - `invoice.payment_failed` → Cuando falla un pago recurrente

3. Click en **Add endpoint**
4. **Copia el Webhook Secret** (empieza con `whsec_...`)

```
Ejemplo:
whsec_abc123def456...
```

### Nota para desarrollo local

Para probar webhooks en local, usa **Stripe CLI**:

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks a tu localhost
stripe forward --to http://localhost:8000/stripe/webhook
```

El CLI te dará un webhook secret de testing que puedes usar en `.env.dev`.

---

## 4. Actualizar variables de entorno

### Backend (`.env.dev`)

```bash
# Reemplaza con tus claves reales
STRIPE_API_KEY=sk_test_tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_aqui
```

### Frontend (`.env.local`)

Crea el archivo `.env.local` en `/frontend/`:

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica_aqui
VITE_API_URL=http://localhost:8000
```

### Importante

- **Nunca** commitees las claves reales en Git
- Los archivos `.env.*` ya están en `.gitignore`
- Usa claves distintas para test y producción

---

## 5. Actualizar price IDs en el código

### Backend (`server_simple.py`)

Edita el diccionario `STRIPE_PRICES` con tus Price IDs reales:

```python
STRIPE_PRICES = {
    "joven": {
        "monthly": "price_1JovenMonthlyID",    # ← Reemplazar
        "yearly": "price_1JovenYearlyID"       # ← Reemplazar
    },
    "colaborador": {
        "monthly": "price_1ColaboradorMonthlyID",  # ← Reemplazar
        "yearly": "price_1ColaboradorYearlyID"     # ← Reemplazar
    },
    "protector": {
        "monthly": "price_1ProtectorMonthlyID",  # ← Reemplazar
        "yearly": "price_1ProtectorYearlyID"     # ← Reemplazar
    }
}
```

### Frontend (`Landing.jsx`)

Los IDs en el frontend deben coincidir con las claves del backend:

```javascript
const membershipId = {
  'Socio Joven': 'joven',        // ← Correcto
  'Socio Colaborador': 'colaborador',
  'Socio Protector': 'protector'
}[membership.name]
```

---

## 6. Probar el flujo de pago

### Paso 6.1: Reiniciar servidores

```bash
# Backend
cd backend
python3 server_simple.py

# Verifica que veas:
# ✅ Stripe inicializado (modo: test)
```

```bash
# Frontend (en otra terminal)
cd frontend
npm run dev
```

### Paso 6.2: Hacer un pago de prueba

1. Ve a http://localhost:5173/
2. Haz clic en "Hazte Socio"
3. Selecciona un plan (ej: "Socio Colaborador")
4. Selecciona "Mensual" o "Anual"
5. Click en "Hazte Socio"
6. Serás redirigido a **Stripe Checkout** (modo test)

### Paso 6.3: Completar el pago de prueba

En Stripe Checkout (modo test), usa estos datos de prueba:

**Número de tarjeta**: `4242 4242 4242 4242`
**Fecha de caducidad**: Cualquier fecha futura (ej: `12/34`)
**CVC**: Cualquier código de 3 dígitos (ej: `123`)
**Código postal**: Cualquier código (ej: `28001`)

Click en **Pay** → El pago se procesará → Redirección al dashboard

### Paso 6.4: Verificar la suscripción

1. En el dashboard de Stripe, ve a **Payments**
2. Verás el pago de prueba (€10.00 para Colaborador mensual)
3. Ve a **Subscriptions** → Verás la suscripción activa
4. En la consola del backend, verás:
   ```
   ✅ Suscripción creada para usuario@email.com (colaborador)
   ```

---

## 🎯 Checklist Pre-Lanzamiento

- [ ] Cuenta de Stripe creada y verificada
- [ ] 3 products creados (Joven, Colaborador, Protector)
- [ ] 6 prices creados (2 por product)
- [ ] Price IDs copiados y pegados en `server_simple.py`
- [ ] Webhook configurado en Stripe Dashboard
- [ ] Webhook secret añadido a `.env.dev`
- [ ] Backend reiniciado (ve "✅ Stripe inicializado")
- [ ] Frontend reiniciado
- [ ] Pago de prueba completado con tarjeta `4242...`
- [ ] Suscripción visible en Stripe Dashboard
- [ ] Usuario actualizado en backend (status: "active")

---

## 🚨 Problemas Comunes

### "Stripe no está configurado"

**Causa**: No has añadido `STRIPE_API_KEY` en `.env.dev`

**Solución**:
```bash
# backend/.env.dev
STRIPE_API_KEY=sk_test_tu_clave_real_aqui
```

### "Error al crear sesión de checkout: Invalid price ID"

**Causa**: Los Price IDs en `server_simple.py` son placeholders

**Solución**: Copia los Price IDs reales desde Stripe Dashboard y pégalos en el código

### "Webhook signature verification failed"

**Causa**: Webhook secret incorrecto o falta

**Solución**:
```bash
# backend/.env.dev
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_secret_real
```

### "No se redirige a Stripe Checkout"

**Causa**: El usuario no tiene email en localStorage

**Solución**: El usuario debe hacer login primero (magic-link)

---

## 📚 Recursos Útiles

- **Stripe Docs**: https://stripe.com/docs/billing/subscriptions/overview
- **Stripe Test Cards**: https://stripe.com/docs/testing#cards
- **Stripe CLI**: https://stripe.com/docs/stripe-cli

---

**¿Listo para lanzar?** Cuando pases a producción:

1. Cambia las claves de `sk_test_` a `sk_live_`
2. Cambia `pk_test_` a `pk_live_` en el frontend
3. Verifica que el webhook sea de producción (no test)
4. Haz un pago real de prueba (€1) y reembólsalo

---

**¡Buena suerte! 🍷**
