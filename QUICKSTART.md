# 🚀 Guía de Inicio Rápido

## Setup en 3 Pasos

### 1. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173)

### 2. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus claves reales

uvicorn server:app --reload --port 8000
```

API docs en [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Stripe (Pagos)

**Crear productos en Stripe Dashboard:**

1. Ve a [Products](https://dashboard.stripe.com/products)
2. Create product → "Socio Joven"
3. Add price:
   - **€5/mes** (recurring, monthly)
   - **€50/año** (recurring, yearly)
4. Repetir para "Socio Colaborador" (€10/€100) y "Socio Protector" (€25/€250)

**Copiar Price IDs:**
```bash
# Añadir a backend/.env
STRIPE_PRICE_JOVEN_MONTHLY=price_xxx
STRIPE_PRICE_JOVEN_YEARLY=price_yyy
STRIPE_PRICE_COLABORADOR_MONTHLY=price_zzz
STRIPE_PRICE_COLABORADOR_YEARLY=price_www
STRIPE_PRICE_PROTECTOR_MONTHLY=price_qqq
STRIPE_PRICE_PROTECTOR_YEARLY=price_vvv
```

---

## 📋 Checklist Pre-Lanzamiento

### Técnico
- [ ] MongoDB Atlas configurado
- [ ] Stripe en modo test con productos creados
- [ ] Resend API key configurada
- [ ] Frontend build funcional (`npm run build`)
- [ ] Backend sin errores (`uvicorn server:app`)

### Contenido
- [ ] Fotos del bar (hero + eventos)
- [ ] Testimonios verificados de clientes
- [ ] Manifiesto revisado
- [ ] Precios finales confirmados

### Legal
- [ ] Política de privacidad
- [ ] Términos y condiciones
- [ ] RGPD compliant (datos EU)

---

## 🧪 Testing del Flujo de Pago

### Tarjeta de Prueba Stripe
```
Número: 4242 4242 4242 4242
Fecha: 12/34 (cualquier futuro)
CVC: 123
ZIP: 12345
```

### Flujo Completo a Probar

1. **Landing** → Click "Hazte Socio"
2. **Checkout** → Completar pago
3. **Redirección** → A Dashboard socio
4. **Email** → Magic-link de bienvenida
5. **Login** → Acceder con email
6. **Dashboard** → Ver estado de membresía
7. **Webhook** → Usuario activado en MongoDB

---

## 🐛 Troubleshooting

### Error: "MongoDB connection failed"
**Solución:** Verificar `MONGO_URL` en `.env`

```bash
# Formato correcto:
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/amigoslatertulia
```

### Error: "Stripe API key invalid"
**Solución:** Usar clave **sk_test_** (modo test), no sk_live_

### Error: "CORS policy"
**Solución:** Verificar `FRONTEND_ORIGIN` en backend/.env

```bash
FRONTEND_ORIGIN=http://localhost:5173
```

### Error: "Webhook signature verification failed"
**Solución:** Usar `STRIPE_WEBHOOK_SECRET` correcto del dashboard

---

## 📦 Deploy a Producción

### Frontend (Vercel)

```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway/Render)

1. Conectar repo GitHub
2. Configurar variables de entorno
3. Deploy automático en cada push

### Environment Variables Necesarias

**Frontend:**
```bash
VITE_API_URL=https://tu-backend.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

**Backend:**
```bash
MONGO_URL=mongodb+srv://...
STRIPE_API_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=tu_secreto_super_seguro
RESEND_API_KEY=re_...
FRONTEND_ORIGIN=https://tu-dominio.com
```

---

## 📞 Soporte

- **Stack Overflow:** [etiqueta fastapi](https://stackoverflow.com/questions/tagged/fastapi)
- **Stripe Docs:** [docs.stripe.com](https://docs.stripe.com)
- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)

---

**¿Problemas?** Revisa el [README.md](./README.md) completo para más detalles.
