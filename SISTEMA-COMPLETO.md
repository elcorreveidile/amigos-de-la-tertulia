# 🍷 Amigos de La Tertulia - Sistema Completo

**Fecha**: 2026-05-06
**Estado**: ✅ FUNCIONAL

---

## 🎉 ¿Qué está implementado?

### ✅ Frontend (React + Vite)
- [x] Landing Page con diseño corporativo rojo
- [x] Sistema de rutas completo (React Router)
- [x] Página de Login con Magic-Link
- [x] Página de Registro
- [x] Dashboard de Socio
- [x] Carnet Digital
- [x] Historial de Pagos
- [x] Dashboard de Admin
- [x] Gestión de Socios (Admin)
- [x] Rutas protegidas por roles

### ✅ Backend (FastAPI)
- [x] Servidor FastAPI simplificado (sin MongoDB para desarrollo)
- [x] Auth Magic-Link funcional
- [x] Endpoints de membresías
- [x] Sistema de tokens JWT
- [x] Almacenamiento JSON local (para desarrollo rápido)

---

## 🚀 Cómo Iniciar el Sistema

### Paso 1: Iniciar el Backend

```bash
cd /Users/blablaele/Desktop/AI/amigos-la-tertulia/backend
python3 server_simple.py
```

**El backend correrá en**: http://localhost:8000

Verás este mensaje:
```
============================================================
🍷 AMIGOS DE LA TERTULIA - BACKEND SIMPLIFICADO
============================================================
Modo: Desarrollo (Sin MongoDB)
Datos: /Users/blablaele/Desktop/AI/amigos-la-tertulia/backend/data
Frontend: http://localhost:5173
============================================================
```

### Paso 2: Iniciar el Frontend

En otra terminal:

```bash
cd /Users/blablaele/Desktop/AI/amigos-la-tertulia/frontend
npm run dev
```

**El frontend correrá en**: http://localhost:5173

---

## 🔐 Sistema de Autenticación

### Flujo de Magic-Link

1. **Usuario va a `/login`**
2. **Introduce su email**
3. **Backend genera magic-link** y lo imprime en la consola
4. **Usuario hace clic en el enlace** (o lo copia en el navegador)
5. **Backend verifica el token** y devuelve JWT + datos del usuario
6. **Frontend guarda el usuario** en localStorage
7. **Usuario accede al dashboard** según su rol

### Ejemplo de Uso

#### 1. Login como ADMIN

```
Email: javier@amigoslatertulia.com
```

**En la consola del backend verás:**
```
============================================================
🔗 MAGIC LINK PARA: javier@amigoslatertulia.com
============================================================
http://localhost:5173/login/verify?token=XXXXXXXXXXXX
============================================================
```

**Copia ese enlace** y ábrelo en el navegador. Serás redirigido al dashboard de admin.

#### 2. Login como SOCIO

```
Email: cualquier@email.com
```

El sistema creará automáticamente un nuevo socio con rol "socio".

---

## 📁 Estructura del Proyecto

```
amigos-la-tertulia/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx    # Protección de rutas
│   │   ├── pages/
│   │   │   ├── Landing.jsx            # Landing page pública
│   │   │   ├── Login.jsx              # Login magic-link
│   │   │   ├── Register.jsx           # Registro de nuevos socios
│   │   │   ├── socio/
│   │   │   │   ├── DashboardSocio.jsx # Dashboard socio
│   │   │   │   ├── CarnetDigital.jsx  # Carnet con QR
│   │   │   │   └── MisPagos.jsx       # Historial de pagos
│   │   │   └── admin/
│   │   │       ├── DashboardAdmin.jsx # Panel administrativo
│   │   │       └── Socios.jsx         # Gestión de socios
│   │   ├── styles/
│   │   │   ├── variables.css          # Design tokens
│   │   │   └── vintage.css            # Estilos corporativos
│   │   └── App.jsx                    # Configuración de rutas
│   └── public/
│       └── img/                       # Imágenes del bar
│
├── backend/                     # FastAPI
│   ├── server_simple.py         # Servidor simplificado (DEV)
│   ├── server.py                # Servidor completo (requiere MongoDB)
│   ├── data/                    # Almacenamiento JSON local
│   │   ├── users.json           # Usuarios registrados
│   │   └── tokens.json          # Tokens magic-link activos
│   ├── .env.dev                 # Variables de entorno DEV
│   └── requirements.txt         # Dependencias Python
│
└── docs/                        # Documentación
    ├── ESTADO-ACTUAL.md         # Estado del proyecto
    └── SISTEMA-COMPLETO.md      # Este archivo
```

---

## 🎨 Diseño Corporativo

### Colores
```css
--corporativo: #C41E3A;  /* Rojo corporativo - PRIMARIO */
--oro: #D4AF37;          /* Dorado - SECUNDARIO */
--papel: #FAFAFA;        /* Fondo claro */
--tinta: #1A1A1A;        /* Texto oscuro */
```

### Tipografías
- **Display**: 'Playfair Display', serif
- **Body**: 'Lato', sans-serif
- **UI**: 'Inter', sans-serif

---

## 📡 API Endpoints

### Autenticación

#### `POST /auth/request-link`
Solicita un magic-link para un email.

**Request:**
```json
{
  "email": "usuario@example.com"
}
```

**Response:**
```json
{
  "message": "Magic link enviado (mira la consola del servidor)",
  "dev_link": "http://localhost:5173/login/verify?token=XXX"
}
```

#### `POST /auth/verify`
Verifica un token magic-link y devuelve JWT + usuario.

**Request:**
```json
{
  "token": "XXXXXXXXXXXX"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "name": null,
    "role": "socio",
    "member_since": "2026-05-06",
    "membership_type": "colaborador"
  }
}
```

### Membresías

#### `GET /memberships`
Devuelve los tipos de membresía disponibles.

**Response:**
```json
[
  {
    "id": "joven",
    "name": "Socio Joven",
    "price_monthly": 5,
    "price_yearly": 50,
    "benefits": [...]
  },
  ...
]
```

### Health Check

#### `GET /health`
Estado del servidor.

**Response:**
```json
{
  "status": "healthy",
  "mode": "dev_simple",
  "mongodb": "disabled (using JSON storage)",
  "timestamp": "2026-05-06T22:30:00"
}
```

---

## 🧪 Testing del Sistema

### Test 1: Registro de Nuevo Socio

1. Ve a: http://localhost:5173/register
2. Rellena el formulario:
   - Nombre: "Juan Pérez"
   - Email: "juan@example.com"
   - Tipo: "Socio Colaborador"
3. Haz clic en "Continuar al Pago"
4. **TODO**: Implementar checkout Stripe

### Test 2: Login con Magic-Link

1. Ve a: http://localhost:5173/login
2. Introduce email: "test@example.com"
3. **Mira la consola del backend** - aparecerá el magic-link
4. Copia el enlace y ábrelo en el navegador
5. Serás redirigido al dashboard de socio

### Test 3: Acceso como Admin

1. Ve a: http://localhost:5173/login
2. Introduce email: "javier@amigoslatertulia.com"
3. **Mira la consola del backend**
4. Copia el magic-link y ábrelo
5. Serás redirigido al dashboard de **admin**

### Test 4: Rutas Protegidas

Intenta acceder directamente a:
- http://localhost:5173/socio/dashboard → Redirige a login si no estás autenticado
- http://localhost:5173/admin/dashboard → Redirige a login si no eres admin

---

## ⚠️ Limitaciones del Modo Desarrollo

### Sin MongoDB
- **Datos en JSON**: Todo se guarda en archivos JSON en `backend/data/`
- **No persistencia real**: Si borras los archivos JSON, pierdes los datos
- **Para producción**: Usa `server.py` completo con MongoDB

### Sin Stripe
- **Checkout no implementado**: El flujo de pago está pendiente
- **Pagos de prueba**: Usa datos mock en MisPagos

### Sin Resend (Emails)
- **Magic-link en consola**: En desarrollo, los enlaces se imprimen en la terminal
- **Para producción**: Configura RESEND_API_KEY en `.env`

---

## 🚀 Para Producción

### 1. Instalar MongoDB

```bash
# macOS con Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# O usar MongoDB Atlas (cloud)
# Crear cuenta en: https://www.mongodb.com/cloud/atlas
```

### 2. Configurar Stripe

1. Ve a: https://dashboard.stripe.com/
2. Crea los productos (Socio Joven, Colaborador, Protector)
3. Crea los precios (monthly y yearly para cada tipo)
4. Copia las claves API:
   - `STRIPE_API_KEY`: sk_test_...
   - `STRIPE_WEBHOOK_SECRET`: whsec_...

### 3. Configurar Resend (Emails)

1. Ve a: https://resend.com/
2. Crea una API key
3. Configura el dominio de envío
4. Añade al `.env`:
   ```
   RESEND_API_KEY=re_XXXXXXXX
   RESEND_FROM=hola@amigoslatertulia.com
   ```

### 4. Usar Server Completo

En lugar de `server_simple.py`, usa `server.py` que incluye:
- Integración Stripe completa
- Webhooks de Stripe
- Emails reales con Resend
- MongoDB para persistencia
- Checkout sessions
- Gestión de suscripciones

---

## 🛠️ Comandos Útiles

### Backend
```bash
# Iniciar servidor simplificado (DEV)
cd backend && python3 server_simple.py

# Iniciar servidor completo (PROD - requiere MongoDB)
cd backend && python3 server.py

# Instalar dependencias
cd backend && pip install -r requirements.txt
```

### Frontend
```bash
# Iniciar servidor desarrollo
cd frontend && npm run dev

# Build para producción
cd frontend && npm run build

# Preview de producción
cd frontend && npm run preview
```

### MongoDB
```bash
# Iniciar MongoDB
brew services start mongodb-community

# Detener MongoDB
brew services stop mongodb-community

# Verificar estado
brew services list | grep mongodb
```

---

## 📊 Estado del Desarrollo

### ✅ Completado
- [x] Landing page con diseño corporativo
- [x] Sistema de rutas React Router
- [x] Auth Magic-Link funcional
- [x] Dashboard Socio
- [x] Carnet Digital
- [x] Mis Pagos (con datos de prueba)
- [x] Dashboard Admin
- [x] Gestión de Socios
- [x] Backend simplificado sin MongoDB
- [x] Copyright 2026
- [x] Web a todo el ancho (sin márgenes)

### 🔄 Pendiente
- [ ] Integración Stripe completa
- [ ] Webhook de Stripe
- [ ] Emails reales con Resend
- [ ] QR Code real en carnet
- [ ] Gestión de eventos
- [ ] Comunicados por email
- [ ] Estadísticas avanzadas

---

## 📝 Próximos Pasos

1. **PROBAR EL SISTEMA**: Abre http://localhost:5173 y prueba el flujo completo
2. **VERIFICAR AUTH**: Prueba el magic-link con diferentes emails
3. **PERSONALIZAR**: Cambia el email admin si es necesario
4. **IMPLEMENTAR STRIPE**: Cuando estés listo para pagos reales
5. **MONGO DB**: Instala MongoDB para producción

---

## 🆘 Troubleshooting

### "MongoDB not running"
- **Solución**: Usa `server_simple.py` que no necesita MongoDB
- **Opción**: Instala MongoDB con `brew install mongodb-community`

### "Port 8000 already in use"
- **Solución**: Mata el proceso con `lsof -ti:8000 | xargs kill -9`

### "Port 5173 already in use"
- **Solución**: Mata el proceso con `lsof -ti:5173 | xargs kill -9`

### "Magic link no llega"
- **DEV**: El magic-link se imprime en la consola del backend
- **PROD**: Verifica que RESEND_API_KEY esté configurado

### "Cannot find module 'react-router-dom'"
- **Solución**: `cd frontend && npm install react-router-dom`

---

## 👥 Usuarios de Prueba

### Admin
- **Email**: javier@amigoslatertulia.com
- **Password**: No usa password (magic-link)
- **Rol**: admin
- **Acceso**: Dashboard admin completo

### Socio (se crea automáticamente al hacer login)
- **Email**: cualquier@email.com
- **Rol**: socio
- **Acceso**: Dashboard socio, carnet, pagos

---

**Última actualización**: 2026-05-06 22:30
**Versión**: 2.0.0 - Sistema completo con auth y dashboards
