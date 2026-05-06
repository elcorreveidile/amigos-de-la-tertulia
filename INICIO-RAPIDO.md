# 🚀 INICIO RÁPIDO - Amigos de La Tertulia

## ⚡ Empieza AHORA MISMO (3 pasos)

### 1️⃣ Inicia el Backend

Abre una terminal y ejecuta:

```bash
cd /Users/blablaele/Desktop/AI/amigos-la-tertulia/backend
python3 server_simple.py
```

✅ Verás: "Uvicorn running on http://0.0.0.0:8000"

### 2️⃣ Inicia el Frontend

Abre **OTRA** terminal y ejecuta:

```bash
cd /Users/blablaele/Desktop/AI/amigos-la-tertulia/frontend
npm run dev
```

✅ Verás: "Local: http://localhost:5173/"

### 3️⃣ ¡Disfruta!

Abre tu navegador en: **http://localhost:5173/**

---

## 🔐 Cómo Hacer Login

### Opción A: Como ADMIN (tú)

1. Ve a: http://localhost:5173/login
2. Email: `javier@amigoslatertulia.com`
3. **Mira la terminal del backend** - aparecerá un enlace
4. Copia ese enlace y ábrelo en el navegador
5. ¡Listo! Estás en el dashboard de admin

### Opción B: Como SOCIO (prueba)

1. Ve a: http://localhost:5173/login
2. Email: `cualquier@email.com` (inventa uno)
3. **Mira la terminal del backend** - aparecerá un enlace
4. Copia ese enlace y ábrelo en el navegador
5. ¡Listo! Estás en el dashboard de socio

---

## 📍 Páginas Disponibles

### Públicas
- 🏠 **/** - Landing page
- 🔑 **/login** - Inicio de sesión
- 📝 **/register** - Registro de nuevos socios

### Área de Socio
- 📊 **/socio/dashboard** - Panel principal
- 🪪 **/socio/carnet** - Carnet digital con QR
- 💳 **/socio/pagos** - Historial de cuotas

### Área de Admin
- 🎛️ **/admin/dashboard** - Panel administrativo
- 👥 **/admin/socios** - Gestión de socios

---

## ⚠️ Importante

### Magic-Link en Consola
**En desarrollo**, los magic-links se imprimen en la terminal del backend, NO se envían por email.

Ejemplo de lo que verás en la terminal del backend:
```
============================================================
🔗 MAGIC LINK PARA: javier@amigoslatertulia.com
============================================================
http://localhost:5173/login/verify?token=XXXXXX
============================================================
```

**Copia ese enlace completo** y ábrelo en tu navegador.

---

## 🛑 Cómo Detener

### Detener Backend
En la terminal del backend: `Ctrl + C`

### Detener Frontend
En la terminal del frontend: `Ctrl + C`

---

## 🎨 Lo Nuevo

✅ **Color corporativo rojo** (#C41E3A) en toda la web
✅ **Sin márgenes** - la web ocupa todo el ancho
✅ **Copyright 2026**
✅ **Sistema completo** con auth y dashboards
✅ **Magic-link funcional** (mira la consola del backend)

---

## 📚 Documentación Completa

Para más detalles, lee: `SISTEMA-COMPLETO.md`

---

**¡Disfruta tu nueva plataforma! 🍷**
