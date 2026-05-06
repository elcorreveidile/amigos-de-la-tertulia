# Amigos de La Tertulia - Proyecto Web

## 🎯 Objetivo

Plataforma de membresías para salvar el bar cultural "La Tertulia" (47 años de historia en Granada).

**Misión:** Convertir visitantes en socios recurrentes mediante suscripciones mensuales/anuales a través de Stripe.

---

## 📁 Estructura del Proyecto

```
amigos-la-tertulia/
├── frontend/                      # React 19 + Vite
│   ├── src/
│   │   ├── styles/
│   │   │   ├── variables.css     # Design tokens (colores, fuentes, espaciados)
│   │   │   └── vintage.css       # Estilos editorial/café literario
│   │   └── App.jsx               # Landing Page completa
│   ├── index.html                # Con Google Fonts integradas
│   └── package.json
│
├── backend/                       # FastAPI
│   ├── server.py                 # API principal (475 líneas)
│   ├── models/                   # Pydantic models
│   ├── routes/                   # API routes
│   ├── requirements.txt
│   └── .env.example              # Template de variables de entorno
│
└── README.md                     # Este archivo
```

---

## 🎨 Sistema de Diseño Vintage/Editorial

### Fotografías del Bar
✅ **Fotos reales de La Tertulia integradas:**
- `escenario.jpg` - Vista interior del bar (hero section)
- `libros.jpg` - Biblioteca del establecimiento (manifiesto)

**Optimización web:**
- Versión 1920px: 576KB (desktop)
- Versión 1200px: 250KB (tablet)
- Versión 768px: 111KB (móvil)
- Carga responsive automática según dispositivo

### Paleta de Colores
```css
--vino: #722F37              /* Primario - Burdeos */
--oro: #C5A059               /* Secundario - Bronce */
--papel: #FDFBF7             /* Fondo crema */
--tinta: #2C2C2C             /* Texto grafito */
--emergencia: #D32F2F        /* CTA urgente */
```

### Tipografías
- **Playfair Display** (serif) - Títulos elegantes
- **Lato** (sans-serif) - Cuerpo de texto
- **Inter** (sans-serif) - Elementos UI

### Estilos Clave
- Sombras sólidas: `4px 4px 0 rgba(197, 160, 89, 0.3)`
- Bordes Vintage: `1px solid var(--oro)`
- Decoración con comillas: `::before { content: "❝"; }`
- Hover effects con transform y sombra

---

## ✅ Landing Page Completada

### Secciones Incluidas

1. **Navbar** - Navegación simple con enlaces ancla
2. **Hero Section** - Mensaje urgente con badge "⚠️ URGENTE"
3. **Contador de Socios** - 47/100 con barra de progreso animada
4. **Manifiesto** - Historia del bar y por qué debe salvarse
5. **Beneficios** - 6 cards vintage:
   - Eventos Exclusivos
   - Voto en Asamblea
   - Descuentos Especiales
   - Carnet Digital
   - Eventos Anuales
   - Preservar Historia
6. **Tipos de Socio** - 3 tiers:
   - **Socio Joven**: €5/mes o €50/año
   - **Socio Colaborador**: €10/mes o €100/año (⭐ Popular)
   - **Socio Protector**: €25/mes o €250/año
7. **Testimonios** - 3 citas vintage con autores
8. **Footer** - Enlaces legales y branding

### Contenido Emocional

El copywriting apela a:
- **Historia**: "47 años de cultura"
- **Urgencia**: "en peligro de cierre", "alquileres +40%"
- **Comunidad**: testimonios reales de socios históricos
- **Transparencia**: "tu cuota paga alquiler y sueldos"

---

## 🔧 Stack Tecnológico

### Frontend
- **React 19** - Última versión con hooks mejorados
- **Vite** - Build tool ultra-rápido
- **CSS Puro** - Sin frameworks, diseño editorial a medida
- **React Router** - Navegación (pendiente de configurar)

### Backend
- **FastAPI** - API async Python
- **Motor (MongoDB)** - Driver async para MongoDB
- **Stripe** - Pagos recurrentes (modo suscripción)
- **Resend** - Emails magic-link
- **Pydantic** - Validación de datos con tipos Literales

### Modelo de Datos Adaptado

```python
# CAMBIOS RESPECTO A LA-CLASE-DIGITAL:
# Course → Membership
# Enrollment → Subscription
# "student" → "socio"

class UserOut(BaseModel):
    role: Literal["admin", "socio", "simpatizante"]
    status: Literal["active", "pending_payment", "inactive"]
    member_since: Optional[str]

class MembershipOut(BaseModel):
    name: Literal["Socio Protector", "Socio Colaborador", "Socio Joven"]
    price_monthly_eur: int
    price_yearly_eur: int
    benefits: list[str]

class SubscriptionOut(BaseModel):
    stripe_subscription_id: str
    status: Literal["active", "past_due", "canceled"]
    current_period_end: str
```

---

## 🚀 Próximos Pasos (FASE 1)

### 1. Configurar Stripe (Máxima Prioridad)

**Acciones en Stripe Dashboard:**

1. Crear Products (3 tipos de socio):
   ```
   - Socio Joven
   - Socio Colaborador
   - Socio Protector
   ```

2. Crear Prices (modo subscription):
   ```
   Socio Joven:
   - price_id_joven_monthly (€5/mes)
   - price_id_joven_yearly (€50/año)

   Socio Colaborador:
   - price_id_colaborador_monthly (€10/mes)
   - price_id_colaborador_yearly (€100/año)

   Socio Protector:
   - price_id_protector_monthly (€25/mes)
   - price_id_protector_yearly (€250/año)
   ```

3. Configurar Webhook:
   ```
   URL: https://tu-backend.com/webhook/stripe
   Eventos:
   - customer.subscription.created
   - customer.subscription.deleted
   - invoice.payment_failed
   - checkout.session.completed
   ```

4. Copiar claves API:
   ```
   STRIPE_API_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### 2. Implementar Flujo de Pago en Frontend

**Archivo: `frontend/src/lib/stripe.js`**
```javascript
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export const createCheckoutSession = async (membershipId, billingPeriod) => {
  const response = await fetch('http://localhost:8000/stripe/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ membership_id: membershipId, billing_period: billingPeriod })
  })

  const { checkout_url } = await response.json()
  window.location.href = checkout_url
}
```

**Archivo: `frontend/src/App.jsx`**
```javascript
import { createCheckoutSession } from './lib/stripe'

const handleJoin = async (membership, billingPeriod = 'monthly') => {
  const membershipId = {
    'Socio Joven': 'membership_joven',
    'Socio Colaborador': 'membership_colaborador',
    'Socio Protector': 'membership_protector'
  }[membership.name]

  await createCheckoutSession(membershipId, billingPeriod)
}
```

### 3. Configurar Backend

**Instalar dependencias:**
```bash
cd backend
pip install -r requirements.txt
```

**Configurar `.env`:**
```bash
cp .env.example .env
# Editar .env con claves reales:
# - MONGO_URL
# - JWT_SECRET
# - STRIPE_API_KEY
# - STRIPE_WEBHOOK_SECRET
# - RESEND_API_KEY
```

**Arrancar servidor:**
```bash
uvicorn server:app --reload --port 8000
```

### 4. Imagen del Hero

**Agregar foto del bar:**
```
Colocar archivo en: frontend/public/bar-hero-bw.jpg
Dimensiones recomendadas: 1920x1080px (16:9)
Estilo: Blanco y negro, high-key, ambiente vintage
```

### 5. Probar el Flujo Completo

1. Iniciar backend: `uvicorn server:app --reload --port 8000`
2. Iniciar frontend: `cd frontend && npm run dev`
3. Navegar a `http://localhost:5173`
4. Click en "Hazte Socio" → Socio Colaborador
5. Completar checkout en modo test (tarjeta: 4242 4242 4242 4242)
6. Verificar redirección a Dashboard
7. Comprobar webhook → usuario activado como "socio"

---

## 📊 Métricas de Éxito

### Conversión
- Visitantes → Socios registrados: **> 5%**
- Visitantes → Pagos completados: **> 2%**

### Engagement
- Socios activos (reservan eventos): **> 30%**
- Retención (siguen mes 2): **> 70%**

### Técnicos
- Web Performance: **< 3s** First Contentful Paint
- Mobile Friendly: **100/100** Google Lighthouse
- Uptime: **> 99.5%**

---

## 🛠️ Comandos Útiles

### Frontend
```bash
cd frontend
npm install              # Instalar dependencias
npm run dev             # Servidor desarrollo (http://localhost:5173)
npm run build           # Build para producción
npm run preview         # Previsualizar build
```

### Backend
```bash
cd backend
pip install -r requirements.txt    # Instalar dependencias
uvicorn server:app --reload        # Servidor desarrollo (http://localhost:8000)
```

### Testing (Stripe)
```bash
# Usar tarjeta de prueba
Número: 4242 4242 4242 4242
CVC: Cualquier 3 dígitos
Fecha: Cualquier fecha futura
ZIP: Cualquier 5 dígitos
```

---

## 📱 Roadmap Completo

### ✅ FASE 1 (Completada)
- [x] Estructura del proyecto
- [x] Landing Page vintage
- [x] Backend adaptado con modelos de membresías
- [x] Diseño editorial completo

### 🔄 FASE 1 (En Progreso)
- [ ] Configurar Stripe products y prices
- [ ] Implementar flujo de pago frontend
- [ ] Probar checkout en modo test

### ⏳ FASE 2 (Pendiente)
- [ ] Dashboard socio
- [ ] Carnet digital con QR
- [ ] Autenticación magic-link
- [ ] Historial de cuotas

### ⏳ FASE 3 (Pendiente)
- [ ] Gestión de eventos
- [ ] Reserva de plazas
- [ ] Blog/comunicados

### ⏳ FASE 4 (Pendiente)
- [ ] PWA (Progressive Web App)
- [ ] Carnet móvil offline
- [ ] Notificaciones push

---

## 📝 Notas Importantes

1. **El hero necesita imagen**: Por ahora usa gradiente, pero debe tener foto del bar en B/N
2. **Stripe debe estar en modo test** durante desarrollo
3. **MongoDB Atlas** necesita configurarse antes de arrancar el backend
4. **Resend** necesita configurarse para enviar magic-links
5. **Frontend y backend** deben estar en puertos distintos (5173 y 8000)

---

## 🎯 Foco Actual: Completar Pago

**Prioridad #1**: Hacer que el botón "Hazte Socio" funcione end-to-end.

1. Configurar Stripe Dashboard (5 min)
2. Mapear price_ids en backend (5 min)
3. Conectar frontend con API (10 min)
4. Probar flujo completo (5 min)

**Tiempo estimado**: 25 minutos para tener el flujo de pago funcionando.

---

**Última actualización:** 2026-05-06
**Estado:** Landing Page completa | Pendiente: Flujo de pago
