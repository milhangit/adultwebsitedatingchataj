# MatchLK - Sri Lankan Matrimonial PWA

A premium, mobile-first matrimonial platform built for the Sri Lankan market. This application uses Next.js (App Router) on Cloudflare Pages with a D1 Database.

## 🚀 Live Demo
- **Production**: [https://datesl.pages.dev](https://datesl.pages.dev)
- **Main Branch**: [https://main.datesl.pages.dev](https://main.datesl.pages.dev)

## ✨ Key Features
- **PWA Ready**: Installable on iOS/Android with offline capabilities.
- **Search System**: Filter by Age, Location, Religion, Caste, and Gender.
- **Sri Lankan Mobile Validation**: Auto-detects Dialog, Mobitel, Hutch, Airtel.
- **Secure Registration**: Mandatory T&C agreement and mobile verification.
- **Admin Dashboard**: Manage users, reports, and site settings.
- **Multi-language**: English, Sinhala, Tamil support.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Database**: Cloudflare D1 (SQLite)
- **Styling**: TailwindCSS v4
- **Deployment**: Cloudflare Pages via `@cloudflare/next-on-pages`

## 🔑 Admin Access
The admin dashboard is located at `/admin/login` (or directly via `/admin/dashboard` if session persists).

**Credentials (Development/Seed):**
- **User**: `admin`
- **Password**: `admin123`

*(Note: In production, change these in the database or auth handler)*

## 📦 Deployment Instructions

### Prerequisites
- Node.js 18+
- Wrangler CLI (`npm i -g wrangler`)
- Cloudflare Account

### 1. Install Dependencies
```bash
npm install
```

### 2. Local Development
```bash
# Run Next.js dev server
npm run dev

# Run Cloudflare Pages functions locally
npx wrangler pages dev .vercel/output/static
```

### 3. Database Setup (Cloudflare D1)
```bash
# Create the database
npx wrangler d1 create datesl-db

# Apply migrations (Local)
npx wrangler d1 execute datesl-db --local --file=./migrations/0001_create_profiles.sql
npx wrangler d1 execute datesl-db --local --file=./migrations/0002_admin_schema.sql

# Apply migrations (Remote/Production)
npx wrangler d1 execute datesl-db --remote --file=./migrations/0001_create_profiles.sql
npx wrangler d1 execute datesl-db --remote --file=./migrations/0002_admin_schema.sql
```

### 4. Production Build & Deploy
```bash
# Build the application
npm run build
npx @cloudflare/next-on-pages

# Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static --project-name=datesl
```

## 🐛 Troubleshooting

### "Unexpected end of JSON input"
This error occurs if the API crashes. We have implemented a safe-wrapper in `src/app/register/page.tsx` and `functions/api/auth/register.ts` to handle this. If seen again, check Cloudflare logs.

### Images not loading
We use Base64 SVGs for carrier logos to prevent external blocking. User profile images use `ui-avatars.com` or `unsplash.com`.

## 📄 License
Private Property of MatchLK.
