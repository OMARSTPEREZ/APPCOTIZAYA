# ⚡ CotizaRápido — APPCOTIZAYA

> **Generador de Cotizaciones y Cuentas de Cobro en PDF**  
> Aplicación móvil PWA para freelancers y emprendedores latinoamericanos

[![MIT License](https://img.shields.io/badge/License-MIT-6366f1?style=for-the-badge)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge&logo=pwa)](https://omarstperez.github.io/APPCOTIZAYA/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

---

## 🎯 ¿Qué es CotizaRápido?

CotizaRápido es una app móvil-first (PWA) que permite a freelancers, consultores y pequeños negocios crear **cotizaciones y cuentas de cobro profesionales en segundos**, generar PDFs directamente en el dispositivo y enviarlos por WhatsApp — con **$0 costo de servidor inicial**.

### ✨ Funcionalidades Principales

| Feature | Plan Free | Plan Pro |
|---|---|---|
| Generar PDFs ilimitados | ✅ | ✅ |
| 5 documentos/mes | ✅ | — |
| Documentos ilimitados | ❌ | ✅ |
| Envío por WhatsApp | ✅ | ✅ |
| Plantillas de mensaje (4 tonos) | ✅ | ✅ |
| Conversión Cotización → Cuenta de Cobro | ✅ | ✅ |
| Selector de moneda (COP, USD, EUR, MXN...) | ✅ | ✅ |
| Vista pública para el cliente (enlace) | ✅ | ✅ |
| Aceptación digital de cotización | ✅ | ✅ |
| Sincronización en la nube (Supabase) | ❌ | ✅ |
| Almacenamiento de logo corporativo | ❌ | ✅ |
| Sin marca de agua | ❌ | ✅ |

---

## 🏗️ Tech Stack

```
Frontend:     React 19 + TypeScript + Vite
Estilos:      Tailwind CSS v4
PDF:          jsPDF + html2canvas
Base de datos: Supabase (PostgreSQL + RLS)
Almacenamiento: Supabase Storage (logos) + LocalStorage/IndexedDB (offline)
Auth:         Supabase Auth (email magic link)
Deploy:       GitHub Pages (PWA) / Vercel
```

---

## 🚀 Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/OMARSTPEREZ/APPCOTIZAYA.git
cd APPCOTIZAYA
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon
```

### 4. Configurar la base de datos

En el **SQL Editor de Supabase**, ejecuta el archivo `supabase_schema.sql` que se encuentra en la raíz del proyecto. Este script crea:

- 📋 Tabla `profiles` (con `subscription_tier` y `monthly_quote_count` para Freemium)
- 📄 Tabla `quotes` (con `public_token` para vista pública del cliente)
- 🔐 Políticas de seguridad RLS
- 🪣 Bucket `logos` en Storage
- ⚙️ Función SQL para control de cuota mensual

### 5. Iniciar en desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`

---

## 📱 Estructura del Proyecto

```
APPCOTIZAYA/
├── public/
│   ├── manifest.json          # PWA manifest (instalable en móvil)
│   ├── favicon.svg
│   └── icons/                 # Íconos PWA (72px a 512px)
├── src/
│   ├── components/
│   │   ├── Header.tsx          # Navegación mobile con tabs
│   │   ├── DocumentEditor.tsx  # Formulario de creación de documentos
│   │   ├── DocumentPreview.tsx # Vista previa + botones PDF/WhatsApp
│   │   ├── DocumentHistory.tsx # Historial de documentos con búsqueda
│   │   ├── BusinessProfileModal.tsx # Config del negocio y logo
│   │   ├── SupabaseConfigModal.tsx  # Conexión a la nube
│   │   ├── PublicView.tsx      # Vista pública para el cliente final
│   │   ├── EmptyState.tsx      # Estado vacío amigable
│   │   └── FreemiumWall.tsx    # Muro de pago Free → Pro
│   ├── services/
│   │   ├── storageService.ts   # Persistencia LocalStorage (offline-first)
│   │   ├── supabase.ts         # Integración Supabase (auth + CRUD + storage)
│   │   ├── pdfService.ts       # Generación PDF en el dispositivo
│   │   ├── whatsappService.ts  # Plantillas de mensajes WhatsApp
│   │   └── currencyService.ts  # Detección de moneda por región
│   ├── types.ts                # Interfaces TypeScript + validaciones
│   ├── App.tsx                 # Orquestador principal
│   └── main.tsx
├── supabase_schema.sql         # ⭐ Script SQL completo para Supabase
├── index.html                  # Meta tags SEO + PWA + Open Graph
└── vite.config.ts
```

---

## 🗄️ Esquema de Base de Datos

### Tabla `profiles`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | Vinculado a `auth.users` |
| `business_name` | TEXT | Nombre del negocio |
| `owner_name` | TEXT | Nombre del propietario |
| `subscription_tier` | TEXT | `'free'` o `'pro'` |
| `monthly_quote_count` | INTEGER | Contador de docs este mes |
| `quota_reset_date` | DATE | Fecha de reinicio del contador |

### Tabla `quotes`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID | ID único del documento |
| `user_id` | UUID | Propietario del documento |
| `public_token` | UUID | Token para vista pública del cliente |
| `status` | TEXT | `pending` / `sent` / `accepted` / `rejected` / `converted` |
| `document_type` | TEXT | `cotizacion` o `cuenta_cobro` |

---

## 💡 Funciones Avanzadas

### 1. 🤖 Auto-Mensajes para WhatsApp
Plantillas inteligentes con 4 tonos de comunicación:
- **Formal**: Lenguaje corporativo y profesional
- **Amable**: Cálido y cercano
- **Directo**: Sin rodeos, al punto
- **Cobro**: Para recordatorios de pago

**Plantilla predeterminada de lanzamiento:**
```
Hola [Nombre Cliente] 👋 Adjunto la cotización #[Número] emitida por [Mi Negocio].
Puedes verla o descargarla directamente aquí: [Enlace_PDF].
¡Quedo atento a tus comentarios!
```

### 2. 💱 Selector de Moneda Dinámico
Detección automática de moneda según la región del usuario:
- 🇨🇴 Colombia → COP ($)
- 🇺🇸 USA → USD ($)
- 🇲🇽 México → MXN ($)
- 🇦🇷 Argentina → ARS ($)
- 🇪🇺 Europa → EUR (€)
- 🇧🇷 Brasil → BRL (R$)

### 3. ⚡ Conversión 1-Clic: Cotización → Cuenta de Cobro
Un botón dentro de las cotizaciones aprobadas genera automáticamente la cuenta de cobro con el número `CC-XXX` sin redigitar ningún dato.

### 4. 🔗 Vista Pública para el Cliente
Cada cotización tiene un enlace único (`?token=xxx`) donde el cliente puede:
- Ver el detalle completo del documento
- **Aceptar la cotización** con un botón
- Confirmar pago por WhatsApp (en cuentas de cobro)

---

## 🔐 Sistema Freemium

### Plan Free (por defecto)
- Máximo **5 documentos por mes**
- El contador se reinicia automáticamente el 1° de cada mes
- Al alcanzar el límite, se muestra el modal de upgrade

### Plan Pro ($4.99/mes)
- Documentos **ilimitados**
- Sincronización en la nube
- Sin marca de agua
- Soporte prioritario

### Lógica de control (SQL)

```sql
-- La función increment_monthly_quote_count:
-- 1. Verifica si el mes cambió → reinicia contador
-- 2. Si plan Free y count >= 5 → lanza excepción
-- 3. Si todo OK → incrementa el contador
SELECT public.increment_monthly_quote_count('user-uuid-aqui');
```

---

## 🌐 Deploy

### GitHub Pages (gratuito)

```bash
npm run build
# Subir el contenido de /dist a la rama gh-pages
npx gh-pages -d dist
```

### Vercel (recomendado para PWA)

```bash
npm install -g vercel
vercel --prod
```

---

## 📲 Instalar como App Móvil (PWA)

1. Abre la URL de la app en Chrome Mobile
2. Toca el menú (⋮) → "Añadir a la pantalla de inicio"
3. ¡La app se instala como nativa sin tienda de apps!

---

## 🛣️ Roadmap

- [ ] Autenticación completa con Supabase Auth
- [ ] Panel de métricas (ingresos por mes, docs enviados)
- [ ] Firma digital del cliente
- [ ] Plantillas de cotización prediseñadas (web, diseño, construcción)
- [ ] Integración con Stripe/Wompi para cobros online
- [ ] Multi-idioma (ES/EN/PT)
- [ ] Exportar a Excel/CSV
- [ ] Historial de versiones por documento

---

## 🤝 Contribuir

1. Haz fork del repositorio
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

MIT © 2026 [OMARSTPEREZ](https://github.com/OMARSTPEREZ)

---

<div align="center">
  <strong>⚡ Construido para velocidad y alta conversión • Costo de servidor: $0</strong><br>
  <em>Hecho con ❤️ para freelancers y emprendedores de Latinoamérica</em>
</div>
