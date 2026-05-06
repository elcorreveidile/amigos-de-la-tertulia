# 🧪 GUÍA DE PRUEBAS - Amigos de La Tertulia

Sigue estos pasos para probar todo el sistema end-to-end.

---

## 📋 Preparación

### 1. Verifica que los servidores estén corriendo

**Backend (Terminal 1)**:
```bash
cd /Users/blablaele/Desktop/AI/amigos-la-tertulia/backend
python3 server_simple.py
```

Debes ver:
```
============================================================
🍷 AMIGOS DE LA TERTULIA - BACKEND SIMPLIFICADO
============================================================
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Frontend (Terminal 2)**:
```bash
cd /Users/blablaele/Desktop/AI/amigos-la-tertulia/frontend
npm run dev
```

Debes ver:
```
➜  Local:   http://localhost:5173/
```

---

## 🧪 PRUEBA 1: Landing Page

### Objetivo
Verificar que la página principal carga correctamente con el nuevo diseño.

### Pasos

1. **Abre el navegador** en: http://localhost:5173/

2. **Verifica lo siguiente**:
   - [ ] El fondo es blanco puro (sin márgenes)
   - [ ] El color corporativo es rojo (#C41E3A)
   - [ ] El texto es negro sobre blanco (muy legible)
   - [ ] El copyright dice "© 2026"
   - [ ] El navbar dice "🍷 Amigos de La Tertulia"
   - [ ] Hay un contador de socios: "47/100"
   - [ ] Hay 3 tipos de membresía visibles
   - [ ] Puedes cambiar entre "Mensual" y "Anual"
   - [ ] Las fotos cargan (escenario.jpg, libros.jpg)

3. **Resultado esperado**: ✅ Todo se ve correctamente y es legible

---

## 🧪 PRUEBA 2: Login como Socio

### Objetivo
Probar el sistema de magic-link para un socio normal.

### Pasos

1. **Ve a**: http://localhost:5173/login

2. **Escribe cualquier email** (inventa uno):
   ```
   maria@example.com
   ```

3. **Click en "Enviar Magic Link"**

4. **MIRA LA TERMINAL DEL BACKEND** - verás algo como:
   ```
   ============================================================
   🔗 MAGIC LINK PARA: maria@example.com
   ============================================================
   http://localhost:5173/login/verify?token=abc123...
   ============================================================
   ```

5. **COPIA ese enlace completo**

6. **Pégalo en una nueva pestaña del navegador**

7. **Verifica**:
   - [ ] Fuiste redirigido al dashboard de socio
   - [ ] Ves tu email en la pantalla
   - [ ] Tu rol es "socio"
   - [ ] Puedes ver las opciones: Dashboard, Carnet, Pagos

8. **Resultado esperado**: ✅ Login exitoso, dashboard de socio visible

---

## 🧪 PRUEBA 3: Dashboard de Socio

### Objetivo
Explorar el área de socio y verificar todas las funcionalidades.

### Pasos

1. **Desde el dashboard de socio**, verifica:

   **Pestaña Dashboard**:
   - [ ] Ves tu estado de membresía
   - [ ] Ves "Membresía: Socio Colaborador"
   - [ ] Ves "Estado: Activo"
   - [ ] Ves la fecha de alta

   **Pestaña Carnet**:
   - [ ] El carnet es visible
   - [ ] Tiene tu nombre
   - [ ] Tiene un código QR (placeholder)
   - [ ] Tiene el logo de La Tertulia

   **Pestaña Pagos**:
   - [ ] Ves el historial de pagos
   - [ ] (Vacío porque no has pagado todavía)

2. **Resultado esperado**: ✅ Todas las secciones del socio funcionan

---

## 🧪 PRUEBA 4: Login como Admin

### Objetivo
Probar el acceso administrativo.

### Pasos

1. **Cierra sesión** (borra localStorage o usa incógnito)

2. **Ve a**: http://localhost:5173/login

3. **Escribe el email de admin**:
   ```
   javier@amigoslatertulia.com
   ```

4. **Click en "Enviar Magic Link"**

5. **MIRA LA TERMINAL DEL BACKEND** - copia el magic link

6. **Abre el magic link en el navegador**

7. **Verifica**:
   - [ ] Fuiste redirigido al dashboard de admin
   - [ ] Tu rol es "admin"
   - [ ] Tienes acceso a /admin/dashboard
   - [ ] Tienes acceso a /admin/socios

8. **Resultado esperado**: ✅ Login como admin exitoso

---

## 🧪 PRUEBA 5: Dashboard de Admin

### Objetivo
Verificar la gestión de socios desde el panel admin.

### Pasos

1. **Ve a**: http://localhost:5173/admin/socios

2. **Verifica**:
   - [ ] Ves una lista de socios (datos de prueba)
   - [ ] Cada socio tiene: nombre, email, tipo, estado, total pagado
   - [ ] Hay un buscador "🔍 Buscar socio..."
   - [ ] Hay filtros por estado
   - [ ] Hay filtros por tipo de membresía
   - [ ] Hay un botón "📥 Exportar"
   - [ ] Hay tarjetas con stats: Total Socios, Activos, Pendientes

3. **Interactúa**:
   - [ ] Haz clic en el botón 👁️ de algún socio
   - [ ] Haz clic en el botón ✏️ de algún socio

4. **Resultado esperado**: ✅ Panel admin funcional

---

## 🧪 PRUEBA 6: Botón "Hazte Socio" (Sin Stripe)

### Objetivo
Verificar que el flujo de checkout funciona (sin pagar realmente).

### Pasos

1. **Ve a la landing**: http://localhost:5173/

2. **Desplázate a "Hazte Socio"**

3. **Selecciona "Socio Colaborador"**

4. **Verifica**:
   - [ ] Ves el precio: €10/mes
   - [ ] Ves también el precio anual: €100/año
   - [ ] Ves la lista de beneficios
   - [ ] Hay un botón "Hazte Socio"

5. **Click en "Hazte Socio"**

6. **Resultado esperado**:
   - ⚠️ Verás un error porque Stripe no está configurado aún
   - Esto es **NORMAL** - el sistema está esperando las claves de Stripe

---

## 🧪 PRUEBA 7: Checkout con Stripe (OPCIONAL)

### Nota
Esta prueba solo funciona si ya configuraste Stripe siguiendo **[STRIPE-SETUP.md](./STRIPE-SETUP.md)**.

### Pasos

1. **Si ya tienes Stripe configurado**, repite la Prueba 6

2. **Serás redirigido a Stripe Checkout**

3. **Usa estos datos de prueba**:
   - **Tarjeta**: `4242 4242 4242 4242`
   - **Fecha**: Cualquier fecha futura (ej: `12/34`)
   - **CVC**: `123`
   - **Código postal**: `28001`

4. **Click en "Pay"**

5. **Verifica**:
   - [ ] Pago procesado exitosamente
   - [ ] Redirigido de vuelta al dashboard
   - [ ] Tu estado ahora es "active"
   - [ ] Ves la suscripción en Mis Pagos

6. **Verifica en Stripe Dashboard**:
   - Ve a https://dashboard.stripe.com/test/payments
   - [ ] Ves el pago de €10.00
   - [ ] Ve la suscripción activa

---

## 🧪 PRUEBA 8: Protección de Rutas

### Objetivo
Verificar que las rutas protegidas funcionan correctamente.

### Pasos

1. **Abre una ventana de incógnito**

2. **Intenta acceder directamente a**: http://localhost:5173/socio/dashboard

3. **Verifica**:
   - [ ] Fuiste redirigido a /login
   - [ ] Ves mensaje: "Inicia sesión para acceder"

4. **Ahora intenta**: http://localhost:5173/admin/socios

5. **Verifica**:
   - [ ] Fuiste redirigido a /login

6. **Haz login como socio** (ver Prueba 2)

7. **Intenta acceder a**: http://localhost:5173/admin/socios

8. **Verifica**:
   - [ ] Fuiste redirigido a la landing (no tienes permiso)

9. **Resultado esperado**: ✅ Protección de rutas funciona

---

## 🧪 PRUEBA 9: API Endpoints (Opcional)

### Objetivo
Probar los endpoints del backend directamente.

### Pasos

Abre una terminal y ejecuta:

**1. Health Check**:
```bash
curl http://localhost:8000/health
```
✅ Esperado: `{"status":"healthy","mode":"dev_simple"...}`

**2. Obtener Membresías**:
```bash
curl http://localhost:8000/memberships
```
✅ Esperado: Lista con 3 tipos de socio

**3. Solicitar Magic Link**:
```bash
curl -X POST http://localhost:8000/auth/request-link \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
✅ Esperado: `{"message":"Magic link enviado"...}`

---

## ✅ Checklist Final

Marca cada prueba cuando la completes:

- [ ] **Prueba 1**: Landing Page ✅
- [ ] **Prueba 2**: Login como Socio ✅
- [ ] **Prueba 3**: Dashboard de Socio ✅
- [ ] **Prueba 4**: Login como Admin ✅
- [ ] **Prueba 5**: Dashboard de Admin ✅
- [ ] **Prueba 6**: Botón "Hazte Socio" (sin Stripe) ✅
- [ ] **Prueba 7**: Checkout con Stripe (opcional) ⬜
- [ ] **Prueba 8**: Protección de Rutas ✅
- [ ] **Prueba 9**: API Endpoints (opcional) ⬜

---

## 🐛 Si Algo No Funciona

### "No carga la página"
- **Solución**: Verifica que el frontend esté corriendo (Terminal 2)

### "Error de conexión"
- **Solución**: Verifica que el backend esté corriendo (Terminal 1)

### "El magic link no funciona"
- **Solución**: Asegúrate de copiar el enlace COMPLETO desde la consola del backend

### "No veo el diseño nuevo"
- **Solución**: Hard refresh: `Cmd + Shift + R` (Mac) o `Ctrl + Shift + R` (Windows)

### "Stripe no está configurado"
- **Solución**: Normal si no has seguido STRIPE-SETUP.md aún

---

## 📊 Reporta tus Resultados

Cuando termines, deberías tener:

✅ **9 pruebas completadas** (7 obligatorias + 2 opcionales)
✅ **Sistema 100% funcional**
✅ **Listo para configurar Stripe** (si quieres pagos reales)

---

## 🎯 ¿Siguiente Paso?

Si todas las pruebas funcionaron:

1. **Para desarrollo**: ¡Ya está todo listo! 🎉
2. **Para producción**: Configura Stripe → [STRIPE-SETUP.md](./STRIPE-SETUP.md)
3. **Para deploy**: Sigue las instrucciones en [GUIA-COMPLETA.md](./GUIA-COMPLETA.md)

---

**¡Buena suerte probando! 🍷**
