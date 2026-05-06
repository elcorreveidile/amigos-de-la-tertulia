# 🚀 Guía de Despliegue - Amigos de La Tertulia

Esta guía explica cómo desplegar el proyecto en producción.

---

## 📋 Tabla de Contenidos

1. [Frontend (Vercel)](#frontend-vercel)
2. [Backend (Railway)](#backend-railway)
3. [Configurar Variables de Entorno](#configurar-variables-de-entorno)
4. [Verificar el Despliegue](#verificar-el-despliegue)

---

## 🎨 Frontend (Vercel)

### Opción 1: Deploy Automático (Recomendado)

El frontend ya está configurado para deploy automático desde GitHub.

**URL de Producción**: https://frontend-delta-ten-77.vercel.app

#### Pasos:

1. **El proyecto ya está conectado a Vercel** ✅
2. **Cada push a GitHub** hará un deploy automático
3. **Los PRs** crean deployments de preview

#### Deploy Manual:

```bash
cd frontend
vercel --prod
```

---

## 🐘 Backend (Railway)

### Paso 1: Crear Cuenta en Railway

1. Ve a: https://railway.app/
2. Regístrate con tu cuenta de GitHub
3. Verifica tu email

### Paso 2: Nuevo Proyecto desde GitHub

1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca: `elcorreveidile/amigos-de-la-tertulia`
4. Selecciona el repo
5. Click en **"Deploy Now"**

### Paso 3: Configurar el Backend

1. **Root Directory**: `backend`
2. **Build Command**: (Detectado automáticamente)
3. **Start Command**: `uvicorn server_simple:app --host 0.0.0.0 --port $PORT`

### Paso 4: Configurar Variables de Entorno

En el dashboard de Railway, ve a **Variables** y añade:

```bash
# Frontend URL (para CORS)
FRONTEND_ORIGIN=https://frontend-delta-ten-77.vercel.app

# JWT Secrets (cambia en producción)
JWT_SECRET=tu_clave_secreta_super_segura_aqui
MAGIC_LINK_SECRET=tu_otra_clave_super_segura_aqui

# Stripe (opcional, si tienes pagos)
STRIPE_API_KEY=sk_live_tu_clave_aqui
STRIPE_WEBHOOK_SECRET=whsec_tu_webhook_aqui
```

### Paso 5: Deploy

1. Click en **"Deploy"**
2. Railway instalará dependencias y desplegará
3. En 2-3 minutos tendrás una URL pública
4. Copia la URL de tu backend (ej: `https://tu-backend.railway.app`)

---

## ⚙️ Configurar Variables de Entorno

### Backend (Railway)

Añade estas variables en el dashboard de Railway:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `FRONTEND_ORIGIN` | `https://frontend-delta-ten-77.vercel.app` | URL del frontend para CORS |
| `JWT_SECRET` | (genera una clave segura) | Secret para JWT tokens |
| `MAGIC_LINK_SECRET` | (genera otra clave) | Secret para magic-links |
| `STRIPE_API_KEY` | `sk_live_...` | Clave de Stripe (opcional) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook secret (opcional) |

**Generar claves seguras**:
```bash
openssl rand -base64 32
```

### Frontend (Vercel)

1. Ve al proyecto en Vercel: https://vercel.com/javiers-projects-cc8068ed/frontend
2. Click en **Settings** → **Environment Variables**
3. Añade:

| Variable | Valor |
|----------|-------|
| `VITE_API_URL` | `https://tu-backend.railway.app` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (opcional) |

4. **Redespliega** después de añadir variables

---

## ✅ Verificar el Despliegue

### 1. Backend Health Check

Abre en tu navegador:
```
https://tu-backend.railway.app/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "mode": "dev_simple",
  "mongodb": "disabled (using JSON storage)"
}
```

### 2. Frontend

Abre:
```
https://frontend-delta-ten-77.vercel.app
```

Deberías ver:
- ✅ Landing page cargada
- ✅ Estilos aplicados
- ✅ Imágenes visibles
- ✅ Botones funcionales

### 3. Probar Login

1. Ve a: `https://frontend-delta-ten-77.vercel.app/login`
2. Escribe tu email
3. Click en "Enviar Magic Link"

**Importante**: En producción, necesitarás configurar Resend para enviar emails reales.

---

## 🔄 Deploy Automático

### Frontend (Vercel)

Ya está configurado:

- ✅ Push a `main` → Deploy automático a producción
- ✅ Push a otras ramas → Deploy de preview
- ✅ PRs → Comment con URL de preview

### Backend (Railway)

Para configurar deploy automático:

1. En Railway, ve a tu proyecto
2. Click en **Settings** → **CI/CD**
3. Habilita **"Auto deploy on pushes"**
4. Selecciona la rama `main`

---

## 🔧 Solución de Problemas

### "CORS Error"

**Causa**: `FRONTEND_ORIGIN` no incluye la URL correcta

**Solución**:
```bash
# En Railway, añade tu URL de Vercel
FRONTEND_ORIGIN=https://frontend-delta-ten-77.vercel.app
```

### "Cannot GET /"

**Causa**: Deploy falló o ruta incorrecta

**Solución**:
- Verifica los logs en Railway/Railway
- Asegúrate de que el archivo `Procfile` existe

### "Magic links no funcionan"

**Causa**: Emails no configurados en producción

**Solución**: Configura Resend (ver `STRIPE-SETUP.md`)

### "Variables de entorno no encontradas"

**Causa**: No añadiste las variables en el dashboard

**Solución**:
1. Ve al dashboard (Vercel o Railway)
2. Añade todas las variables requeridas
3. Redespliega

---

## 🌐 URLs de Producción

Una vez desplegado, tendrás:

| Servicio | URL |
|----------|-----|
| **Frontend** | `https://frontend-delta-ten-77.vercel.app` |
| **Backend** | `https://tu-backend.railway.app` |
| **GitHub** | `https://github.com/elcorreveidile/amigos-de-la-tertulia` |

---

## 📊 Monitoreo

### Vercel Dashboard

- URL: https://vercel.com/javiers-projects-cc8068ed/frontend
- Métricas: Builds, deployments, dominios, analytics

### Railway Dashboard

- URL: https://railway.app/dashboard
- Métricas: Logs, métricas, deployments, cron jobs

---

## 💰 Costos

### Frontend (Vercel)

- **Plan Hobby**: GRATIS
- 100 GB de transferencia/mes
- Deployments ilimitados
- Perfecto para empezar

### Backend (Railway)

- **Plan Free**: $5 USD de crédito inicial
- Después: ~$5-10 USD/mes (según uso)
- Incluye: CPU, RAM, almacenamiento

---

## 🎯 Checklist Pre-Producción

- [ ] Frontend desplegado en Vercel
- [ ] Backend desplegado en Railway
- [ ] Variables de entorno configuradas
- [ ] Health check del backend funciona
- [ ] Frontend carga correctamente
- [ ] CORS configurado correctamente
- [ ] Magic-links funcionan (con Resend o)
- [ ] Stripe configurado (opcional)
- [ ] Dominio personalizado configurado (opcional)

---

## 🎉 ¡Listo!

Tu plataforma está ahora en producción. 🍷

**Frontend**: https://frontend-delta-ten-77.vercel.app
**GitHub**: https://github.com/elcorreveidile/amigos-de-la-tertulia

---

## 📚 Recursos

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Stripe Guide**: [STRIPE-SETUP.md](./STRIPE-SETUP.md)
- **Complete Guide**: [GUIA-COMPLETA.md](./GUIA-COMPLETA.md)
