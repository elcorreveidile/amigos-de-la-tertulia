# 🍷 Amigos de La Tertulia

Plataforma de membresías para salvar el bar histórico "La Tertulia" (47 años de cultura en Granada).

**[Live Demo](https://frontend-delta-ten-77.vercel.app)** | **[GitHub](https://github.com/elcorreveidile/amigos-de-la-tertulia)**

---

## ✨ Características

- 🔐 **Autenticación Magic-Link** - Sin contraseñas, solo email
- 🎨 **Diseño Vintage/Editorial** - Estilo café literario con identidad corporativa roja (#C41E3A)
- 💳 **Pagos Recurrentes** - Integración completa con Stripe subscriptions
- 👥 **Dashboards** - Panel para socios (carnet digital, pagos) y admin (gestión)
- 📱 **Responsive** - Optimizado para móvil, tablet y desktop
- ⚡ **React 19 + Vite** - Ultra-rápido con HMR
- 🐘 **FastAPI** - Backend async Python

---

## 🚀 Quick Start

### Desarrollo Local

**1. Clona el repo:**
```bash
git clone https://github.com/elcorreveidile/amigos-de-la-tertulia.git
cd amigos-de-la-tertulia
```

**2. Inicia el Backend:**
```bash
cd backend
python3 server_simple.py
```
✅ Verás: `"Uvicorn running on http://0.0.0.0:8000"`

**3. Inicia el Frontend (en otra terminal):**
```bash
cd frontend
npm install
npm run dev
```

✅ Verás: `"Local: http://localhost:5173/"`

**4. ¡Abre tu navegador!**
```
http://localhost:5173/
```

---

## 👥 Cómo Usar

### Login como Socio

1. Ve a http://localhost:5173/login
2. Escribe cualquier email (ej: `maria@example.com`)
3. **MIRA LA TERMINAL DEL BACKEND** - aparecerá un magic-link
4. Copia ese enlace y ábrelo en el navegador

### Login como Admin

1. Ve a http://localhost:5173/login
2. Escribe: `javier@amigoslatertulia.com`
3. Copia el magic-link de la terminal
4. ¡Listo! Tienes acceso admin

---

## 📁 Estructura del Proyecto

```
amigos-la-tertulia/
├── frontend/                 # React 19 + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx          # Landing page principal
│   │   │   ├── Login.jsx            # Magic-link authentication
│   │   │   ├── socio/               # Área de socio
│   │   │   │   ├── DashboardSocio.jsx
│   │   │   │   ├── CarnetDigital.jsx
│   │   │   │   └── MisPagos.jsx
│   │   │   └── admin/               # Área de admin
│   │   │       ├── DashboardAdmin.jsx
│   │   │       └── Socios.jsx
│   │   ├── lib/
│   │   │   └── stripe.js            # Stripe integration
│   │   └── styles/
│   │       ├── variables.css        # Design tokens
│   │       └── vintage.css          # Vintage styles
│   └── public/                      # Imágenes del bar
│
├── backend/                  # FastAPI (Python)
│   ├── server_simple.py      # API principal con Stripe
│   ├── data/                 # JSON storage (dev mode)
│   └── requirements.txt
│
└── docs/                     # Documentación completa
    ├── STRIPE-SETUP.md       # Configurar pagos
    ├── DEPLOY-GUIDE.md       # Guía de despliegue
    ├── COMO-PROBAR.md        # Testing guide
    └── GUIA-COMPLETA.md       # Documentación técnica
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
- **Playfair Display** (serif) - Títulos elegantes
- **Lato** (sans-serif) - Cuerpo de texto
- **Inter** (sans-serif) - Elementos UI

---

## 💳 Configurar Stripe (Opcional)

Para activar los pagos, sigue la guía completa: **[STRIPE-SETUP.md](./STRIPE-SETUP.md)**

Resumen:
1. Crear cuenta en Stripe Dashboard
2. Crear 3 productos (Joven, Colaborador, Protector)
3. Crear 6 precios (2 por producto: mensual/anual)
4. Configurar webhook endpoint
5. Añadir claves en `backend/.env.dev`

---

## 🌐 Deploy en Producción

### Frontend (Vercel)

**✅ Ya desplegado:** https://frontend-delta-ten-77.vercel.app

Deploy automático desde GitHub. Cada push a `main` hace deploy automático.

```bash
cd frontend
vercel --prod
```

### Backend (Railway)

Sigue la guía: **[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)**

1. Conecta el repo de GitHub en Railway
2. Root directory: `backend`
3. Configura variables de entorno
4. Deploy!

---

## ⚙️ Variables de Entorno

### Backend (`.env.dev`)
```bash
# Frontend URL (para CORS)
FRONTEND_ORIGIN=http://localhost:5173

# JWT Secrets
JWT_SECRET=tu_clave_secreta_aqui
MAGIC_LINK_SECRET=tu_otra_clave_aqui

# Stripe (opcional)
STRIPE_API_KEY=sk_test_tu_clave_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_aqui
```

### Frontend (`.env.local`)
```bash
VITE_API_URL=http://localhost:8000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_aqui
```

---

## 📊 Estado del Proyecto

### ✅ Completado

- [x] Landing page con diseño vintage
- [x] Sistema de autenticación magic-link
- [x] Dashboard de socio (carnet digital, pagos)
- [x] Dashboard de admin (gestión de socios)
- [x] Integración de Stripe (checkout + webhooks)
- [x] Diseño responsive
- [x] Deploy en Vercel (frontend)

### 🚧 Pendiente

- [ ] Deploy backend en Railway
- [ ] Configurar claves de Stripe reales
- [ ] Sistema de eventos y reservas
- [ ] PWA con service worker
- [ ] Emails reales con Resend

---

## 🧪 Testing

Para pruebas completas, sigue: **[COMO-PROBAR.md](./COMO-PROBAR.md)**

Principales tests:
- Landing page carga correctamente
- Magic-link authentication funciona
- Dashboards de socio y admin accesibles
- Flujo de pago (opcional)

---

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Última versión
- **Vite** - Build tool ultra-rápido
- **React Router v7** - Navegación
- **Stripe JS** - Pagos

### Backend
- **FastAPI** - API async Python
- **Stripe Python SDK** - Pagos recurrentes
- **Pydantic** - Validación de datos
- **Uvicorn** - Server ASGI

### Infraestructura
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting (próximamente)
- **GitHub** - Version control

---

## 📚 Documentación

- **[STRIPE-SETUP.md](./STRIPE-SETUP.md)** - Configurar pagos Stripe
- **[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)** - Guía de despliegue
- **[COMO-PROBAR.md](./COMO-PROBAR.md)** - Testing end-to-end
- **[GUIA-COMPLETA.md](./GUIA-COMPLETA.md)** - Documentación técnica
- **[INICIO-RAPIDO.md](./INICIO-RAPIDO.md)** - Quick start
- **[TEST-RESULTS.md](./TEST-RESULTS.md)** - Resultados de pruebas

---

## 📄 Licencia

Este proyecto está bajo la **MIT License** - ver archivo [LICENSE](./LICENSE) para detalles.

---

## 🤝 Contribuciones

Contribuciones bienvenidas! Por favor:

1. Fork el repo
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 🍷 Sobre el Proyecto

**Amigos de La Tertulia** es una plataforma de membresías creada para salvar el bar histórico de Granada (España), abierto en 1977 y en peligro de cierre debido a la gentrificación.

**Misión:** Preservar 47 años de cultura, poesía y tradición mediante la participación comunitaria.

---

## 📞 Contacto

- **GitHub:** [elcorreveidile](https://github.com/elcorreveidile)
- **Live:** https://frontend-delta-ten-77.vercel.app

---

**¡Únete y salva La Tertulia! 🍷✨**
