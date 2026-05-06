# 🍷 Amigos de La Tertulia - Guía Completa del Sistema

Plataforma de membresías para salvar el bar histórico de Granada (1977).

---

## 📋 Tabla de Contenidos

1. [Inicio Rápido](#inicio-rápido)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Guías de Usuario](#guías-de-usuario)
4. [Configuraciones](#configuraciones)
5. [Despliegue](#despliegue)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🚀 Inicio Rápido

### 1. Iniciar el Backend

```bash
cd /Users/blablaele/Desktop/AI/amigos-la-tertulia/backend
python3 server_simple.py
```

✅ Verás: `"Uvicorn running on http://0.0.0.0:8000"`

### 2. Iniciar el Frontend

```bash
cd /Users/blablaele/Desktop/AI/amigos-la-tertulia/frontend
npm run dev
```

✅ Verás: `"Local: http://localhost:5173/"`

### 3. Abrir la Web

Navega a: **http://localhost:5173/**

---

## 🏗️ Arquitectura del Sistema

```
amigos-la-tertulia/
├── frontend/                 # React 19 + Vite
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   │   ├── ProtectedRoute.jsx    # Rutas protegidas
│   │   │   └── layout/              # Navbar, Footer
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Página principal
│   │   │   ├── Login.jsx            # Magic-link login
│   │   │   ├── Register.jsx         # Registro
│   │   │   ├── socio/               # Área de socio
│   │   │   │   ├── DashboardSocio.jsx
│   │   │   │   ├── CarnetDigital.jsx
│   │   │   │   └── MisPagos.jsx
│   │   │   └── admin/               # Área de admin
│   │   │       ├── DashboardAdmin.jsx
│   │   │       └── Socios.jsx
│   │   ├── lib/
│   │   │   └── stripe.js            # Integración Stripe
│   │   └── styles/
│   │       ├── variables.css        # Design tokens
│   │       └── vintage.css          # Estilos vintage
│   └── package.json
│
├── backend/                  # FastAPI (Python)
│   ├── server_simple.py      # Servidor principal
│   ├── .env.dev              # Variables de entorno
│   ├── data/                 # JSON storage (dev)
│   │   ├── users.json
│   │   ├── tokens.json
│   │   └── subscriptions.json
│   └── requirements.txt
│
└── README.md
```

---

## 🎨 Diseño Visual

### Paleta Corporativa

```css
--corporativo: #C41E3A    /* Rojo corporativo */
--oro: #D4AF37            /* Dorado */
--papel: #FFFFFF          /* Blanco puro */
--tinta: #000000          /* Negro puro */
```

### Tipografías

- **Títulos**: Playfair Display (serif, elegante)
- **Cuerpo**: Lato (sans-serif, limpio)
- **UI**: Inter (sans-serif, moderno)

### Estilo Editorial

- Espaciado generoso (1.5rem - 3rem)
- Alto contraste (WCAG AA compliant)
- Sombras vintage (sólidas, no borrosas)
- Bordes minimales (4px - 8px radius)

---

## 👥 Guías de Usuario

### 🔐 Cómo Hacer Login

#### Opción A: Como ADMIN

1. Ve a: http://localhost:5173/login
2. Email: `javier@amigoslatertulia.com`
3. **Mira la terminal del backend** - aparecerá un enlace mágico
4. Copia ese enlace y ábrelo en el navegador
5. ¡Listo! Estás en el dashboard de admin

#### Opción B: Como SOCIO

1. Ve a: http://localhost:5173/login
2. Email: `cualquier@email.com` (inventa uno)
3. **Mira la terminal del backend** - aparecerá un enlace mágico
4. Copia ese enlace y ábrelo en el navegador
5. ¡Listo! Estás en el dashboard de socio

### Magic-Link en Consola

**En desarrollo**, los magic-links se imprimen en la terminal del backend:

```
============================================================
🔗 MAGIC LINK PARA: javier@amigoslatertulia.com
============================================================
http://localhost:5173/login/verify?token=XXXXXX
============================================================
```

**Copia ese enlace completo** y ábrelo en tu navegador.

---

## 📱 Páginas Disponibles

### Públicas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Landing | Página principal con manifiesto y beneficios |
| `/login` | Login | Inicio de sesión con magic-link |
| `/register` | Registro | Registro de nuevos socios |

### Área de Socio

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/socio/dashboard` | Dashboard Socio | Panel principal con estado de membresía |
| `/socio/carnet` | Carnet Digital | Carnet con QR para mostrar en el bar |
| `/socio/pagos` | Mis Pagos | Historial de cuotas pagadas |

### Área de Admin

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/admin/dashboard` | Dashboard Admin | Panel administrativo |
| `/admin/socios` | Gestión de Socios | Lista de todos los socios con filtros |

---

## ⚙️ Configuraciones

### Configurar Stripe

Para activar los pagos, sigue la guía completa: **[STRIPE-SETUP.md](./STRIPE-SETUP.md)**

Resumen rápido:

1. **Cuenta de Stripe**: Regístrate en https://dashboard.stripe.com/register
2. **Products y Prices**: Crea 3 productos con 2 precios cada uno (mensual/anual)
3. **Webhook**: Configura endpoint para eventos de pago
4. **Variables de entorno**:
   ```bash
   # backend/.env.dev
   STRIPE_API_KEY=sk_test_tu_clave_aqui
   STRIPE_WEBHOOK_SECRET=whsec_tu_secret_aqui

   # frontend/.env.local
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
   ```
5. **Actualizar price IDs** en `server_simple.py` con tus IDs reales

### Configurar Emails (Opcional)

Por defecto, los magic-links se imprimen en consola. Para enviar emails reales:

1. Regístrate en Resend: https://resend.com/
2. Consigue tu API key
3. Actualiza `.env.dev`:
   ```bash
   RESEND_API_KEY=re_xxxxx
   RESEND_FROM=hola@amigoslatertulia.com
   ```

### Configurar MongoDB (Producción)

Para producción, reemplaza el almacenamiento JSON con MongoDB:

1. Instala MongoDB local o usa MongoDB Atlas
2. Actualiza `.env.dev`:
   ```bash
   MONGO_URL=mongodb+srv://...
   DB_NAME=amigoslatertulia
   ```
3. Usa `server.py` (completo) en lugar de `server_simple.py`

---

## 🔧 Solución de Problemas

### "No carga el nuevo diseño"

**Causa**: Caché del navegador

**Solución**:
1. Hard refresh: `Cmd + Shift + R` (Mac) o `Ctrl + Shift + R` (Windows)
2. O abre en ventana incógnito

### "El texto no se lee"

**Causa**: Variables CSS no aplicadas

**Solución**:
1. Verifica que `variables.css` esté importado en `App.jsx`
2. Verifica que los colores sean `--papel: #FFFFFF` y `--tinta: #000000`
3. Limpia la caché de Vite: `rm -rf node_modules/.vite`

### "Stripe no está configurado"

**Causa**: No has añadido las claves de Stripe

**Solución**:
1. Sigue la guía [STRIPE-SETUP.md](./STRIPE-SETUP.md)
2. Añade `STRIPE_API_KEY` en `backend/.env.dev`
3. Reinicia el backend

### "Error: Token inválido"

**Causa**: El magic-link expiró (24 horas)

**Solución**:
1. Solicita un nuevo magic-link
2. Usa el enlace nuevo de la consola del backend

### "No puedo acceder al admin"

**Causa**: Email incorrecto o usuario no es admin

**Solución**:
1. Usa exactamente: `javier@amigoslatertulia.com`
2. Verifica que el backend haya asignado `role: "admin"`

---

## 🚀 Despliegue

### Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Render)

```bash
# Railway
railway up

# O Render
render deploy
```

### Variables de Entorno en Producción

**FRONTEND** (Vercel):
```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_API_URL=https://tu-backend.com
```

**BACKEND** (Railway/Render):
```bash
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=usa_una_clave_segura_aleatoria
MONGO_URL=mongodb+srv://... (opcional)
FRONTEND_ORIGIN=https://tu-dominio.com
```

---

## 📊 Estructura de Datos

### Usuario

```json
{
  "id": "uuid",
  "email": "usuario@email.com",
  "name": "Nombre Opcional",
  "role": "socio" | "admin",
  "member_since": "2026-01-15",
  "membership_type": "joven" | "colaborador" | "protector",
  "status": "active" | "pending_payment" | "inactive",
  "stripe_customer_id": "cus_xxx",
  "subscription_id": "sub_xxx",
  "created_at": "2026-01-15T10:30:00"
}
```

### Suscripción

```json
{
  "subscription_id": "sub_xxx",
  "user_id": "uuid",
  "email": "usuario@email.com",
  "membership_type": "colaborador",
  "status": "active",
  "created_at": "2026-01-15T10:30:00"
}
```

---

## 🎯 Roadmap

### ✅ Completado

- [x] Landing page con diseño vintage
- [x] Sistema de autenticación magic-link
- [x] Dashboard de socio con carnet digital
- [x] Dashboard de admin con gestión de socios
- [x] Integración de Stripe (checkout + webhooks)
- [x] Almacenamiento JSON para desarrollo

### 🚧 Próximos Pasos

- [ ] Sistema de eventos y reservas
- [ ] Blog/comunicados para socios
- [ ] PWA con service worker
- [ ] Carnet con QR code funcional
- [ ] Emails reales con Resend
- [ ] MongoDB para producción

---

## 📚 Documentación Adicional

- [STRIPE-SETUP.md](./STRIPE-SETUP.md) - Guía completa de Stripe
- [INICIO-RAPIDO.md](./INICIO-RAPIDO.md) - Quick start guide
- [SISTEMA-COMPLETO.md](./SISTEMA-COMPLETO.md) - Documentación técnica

---

## 🍷 Amigos de La Tertulia

**© 2026 Asociación Cultural Amigos de La Tertulia**
**Granada, España**

Salvando 47 años de cultura. 🍷✨
