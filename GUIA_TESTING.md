# 🧪 Guía de Testing - Amigos de La Tertulia

## 📋 Checklist Pre-Testing

### Backend (FastAPI)
- [ ] Python 3.11+ instalado
- [ ] MongoDB Atlas configurado
- [ ] Variables de entorno en `.env`
- [ ] Dependencias instaladas (`pip install -r requirements.txt`)
- [ ] Servidor arranca sin errores (`uvicorn server:app --reload`)

### Frontend (React + Vite)
- [ ] Node.js 20+ instalado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Vite dev server funciona (`npm run dev`)
- [ ] Landing page carga en http://localhost:5173

### Stripe
- [ ] Cuenta de Stripe en modo test
- [ ] Products creados (3 tipos de socio)
- [ ] Prices creados (6 prices: 3 monthly + 3 yearly)
- [ ] Webhook endpoint configurado
- [ ] Claves API copiadas a `.env`

---

## 🧪 Tests Manuales

### TEST 1: Landing Page

**Pasos:**
1. Arrancar frontend: `cd frontend && npm run dev`
2. Navegar a http://localhost:5173
3. Verificar elementos visuales:
   - [ ] Navbar con "🍷 Amigos de La Tertulia"
   - [ ] Hero section con badge "⚠️ URGENTE"
   - [ ] Contador de socios: 47/100
   - [ ] Manifiesto con historia del bar
   - [ ] 6 cards de beneficios
   - [ ] 3 tarjetas de membresía con toggle mensual/anual
   - [ ] 3 testimonios
   - [ ] Footer con enlaces

**Resultados esperados:**
- Tipografía Playfair Display en títulos
- Colores vino (#722F37) y oro (#C5A059)
- Animación pulse en botón de emergencia
- Toggle mensual/anual funciona

**Errores comunes:**
- Fuentes no cargan → Verificar Google Fonts en index.html
- CSS no aplica → Verificar imports de variables.css y vintage.css

---

### TEST 2: Toggle Mensual/Anual

**Pasos:**
1. En Landing, encontrar toggle sobre las tarjetas de socio
2. Click en "Mensual"
3. Click en "Anual (Ahorras 2 meses)"

**Resultados esperados:**
- Precios se actualizan:
  - Socio Joven: €5 → €50
  - Socio Colaborador: €10 → €100
  - Socio Protector: €25 → €250
- Toggle cambia color (vino para seleccionado)
- Texto informativo cambia

**Errores comunes:**
- Precios no cambian → Verificar estado `billingPeriod` en App.jsx

---

### TEST 3: Flujo de Checkout (Backend)

**Pasos:**
1. Arrancar backend: `cd backend && uvicorn server:app --reload --port 8000`
2. Verificar que cargan las membresías seed en MongoDB
3. Test con curl:

```bash
curl -X POST http://localhost:8000/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "membership_id": "membership_joven",
    "billing_period": "monthly",
    "email": "test@example.com"
  }'
```

**Resultados esperados:**
- Respuesta 200 con `checkout_url` y `session_id`
- URL es de Stripe Checkout (checkout.stripe.com)

**Errores comunes:**
- 404 "Membresía no encontrada" → Verificar seed data en MongoDB
- 500 "Price ID no configurado" → Configurar stripe_price_monthly_id en DB
- CORS error → Verificar FRONTEND_ORIGIN en backend/.env

---

### TEST 4: Checkout en Stripe (Test Mode)

**Setup previo:**
```bash
# En backend/.env, verificar:
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# En frontend/.env, verificar:
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:8000
```

**Pasos:**
1. En Landing, click en "Hazte Socio" → "Socio Colaborador"
2. Se abre Stripe Checkout en nueva pestaña
3. Completar pago con tarjeta de prueba:
   - **Número:** 4242 4242 4242 4242
   - **Fecha:** 12/34 (cualquier futuro)
   - **CVC:** 123
   - **ZIP:** 12345
4. Click "Pay"

**Resultados esperados:**
- Stripe muestra "Payment successful"
- Redirección a `/dashboard?session_id=...`

**Errores comunes:**
- "Your card was declined" → Usar tarjeta 4242... correcta
- "Invalid API key" → Verificar STRIPE_API_KEY en backend/.env
- No redirige → Verificar success_url en código backend

---

### TEST 5: Webhook de Stripe

**Pasos:**
1. Ir a Stripe Dashboard → Developers → Webhooks
2. Encontrar webhook configurado para tu backend
3. Click "Send test webhook" → "checkout.session.completed"
4. Copiar el payload JSON

**Opción manual con stripe-cli:**
```bash
# Instalar stripe-cli
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks a localhost
stripe listen --forward-to localhost:8000/webhook/stripe

# En otro terminal, trigger test event
stripe trigger checkout.session.completed
```

**Resultados esperados:**
- Backend recibe evento (200 OK)
- Usuario creado/actualizado en MongoDB
- Suscripción creada en DB
- Log en backend: "Checkout completed: ..."

**Errores comunes:**
- 401 "Invalid signature" → Verificar STRIPE_WEBHOOK_SECRET
- 500 "User not found" → El webhook debe crear usuario si no existe
- No se recibe webhook → Usar stripe-cli para localhost testing

---

### TEST 6: Dashboard Post-Pago

**Pasos:**
1. Después de pago exitoso, debería redirigir a `/dashboard?session_id=...`
2. Verificar que muestra:
   - [ ] Welcome message con nombre/email
   - [ ] Card "Tu Perfil" con datos del usuario
   - [ ] Card "Tu Membresía" con estado "✅ Activa"
   - [ ] Carnet Digital visible
   - [ ] Código QR funcional (simulado)

**Resultados esperados:**
- Email del usuario correcto
- Rol: "Socio"
- Estado: "Activo"
- Fecha de próxima renovación

**Errores comunes:**
- "No estás autenticado" → Magic-link no implementado aún, usar mock token
- Dashboard vacío → Verificar API calls en loadUserData()

---

### TEST 7: Carnet Digital

**Pasos:**
1. En Dashboard, encontrar sección "📱 Tu Carnet Digital"
2. Verificar elementos:
   - [ ] Logo 🍷
   - [ ] Nº de socio (LT-XXXXXXXX)
   - [ ] Tipo de membresía
   - [ ] Estado "✅ Activo"
   - [ ] Fecha de alta
3. Click "Mostrar Código QR"

**Resultados esperados:**
- QR se muestra (patrón de cuadros)
- Lista de beneficios visible
- Fecha de validez correcta

**Errores comunes:**
- Carnet no aparece → Usuario no es socio o suscripción no activa
- QR no genera → Verificar estado showQR

---

## 🔧 Debugging Tips

### Logs del Backend

```bash
# En backend/, arrancar con logs detallados
uvicorn server:app --reload --log-level debug

# Ver logs en tiempo real
tail -f backend.log
```

### Logs del Frontend

```javascript
// En browser console:
localStorage.getItem('token')
localStorage.getItem('user')
```

### Verificar MongoDB

```bash
# Conectar con MongoDB Atlas
# En Collections, verificar:
# - users: Debe tener 1+ usuarios
# - memberships: Debe tener 3 membresías
# - subscriptions: Debe tener 1+ suscripciones (después del pago)
```

### Verificar Stripe

```bash
# Stripe Dashboard → Payments
# Verificar que el pago aparece como "Succeeded"

# Stripe Dashboard → Subscriptions
# Verificar que la suscripción está "Active"
```

---

## ✅ Criterios de Aceptación

### Mínimo Viable (MVP)
- [x] Landing page carga correctamente
- [x] Toggle mensual/anual funciona
- [x] Click "Hazte Socio" abre Stripe Checkout
- [x] Pago con tarjeta de prueba funciona
- [x] Webhook de Stripe actualiza DB
- [x] Dashboard muestra datos del usuario
- [x] Carnet Digital se ve correctamente

### Completo
- [ ] Autenticación magic-link funcional
- [ ] Dashboard funciona sin mock data
- [ ] Cancelar suscripción funciona
- [ ] Historial de pagos visible
- [ ] Eventos funcionales
- [ ] PWA instalable

---

## 🚀 Checklist Pre-Lanzamiento

### Contenido
- [ ] Foto real del bar en hero (1920x1080px, B/N)
- [ ] Testimonios verificados de clientes reales
- [ ] Precios finales confirmados
- [ ] Política de privacidad creada
- [ ] Términos y condiciones creados

### Técnico
- [ ] Stripe en modo LIVE (no test)
- [ ] MongoDB Atlas en cluster production
- [ ] Frontend deployado en Vercel
- [ ] Backend deployado en Railway/Render
- [ ] ENV variables configuradas en producción
- [ ] Custom domain configurado
- [ ] SSL certificate activo

### Testing Final
- [ ] Test pago completo (tarjeta real, modo live)
- [ ] Test webhooks en producción
- [ ] Test en móvil (iOS + Android)
- [ ] Test en tablets
- [ ] Performance audit (Lighthouse > 90)
- [ ] SEO meta tags correctos

---

## 📞 Soporte

Si encuentras bugs:

1. **Revisar logs:** Backend logs + Browser console
2. **Verificar ENV:** Todas las variables necesarias
3. **Testear API:** Llamadas directas con curl/Postman
4. **MongoDB:** Verificar datos en Atlas
5. **Stripe:** Dashboard para pagos/suscripciones

---

**Última actualización:** 2026-05-06
**Versión:** 1.0.0 MVP
