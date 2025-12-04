# Sithumina Matrimonial App
> Find Your Life Partner in Sri Lanka

This is a production-ready Next.js application for a Sri Lankan matrimonial service. It features a modern UI, AI-powered profile chatbots, and comprehensive search filters.

## Tech Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS v4
- **Backend**: Cloudflare Workers (API), Cloudflare D1 (Database), Cloudflare R2 (Storage)
- **AI**: Cloudflare Workers AI (LLaMA)
- **Deployment**: Cloudflare Pages

## Features
- **Responsive Design**: Mobile-first approach with a culturally resonant UI.
- **AI Chatbot**: Interactive chatbot for each profile (seeded or real) to simulate conversations.
- **Advanced Search**: Filter by Age, Religion, Caste, Location, etc.
- **Profile Management**: Detailed profiles with photos and family details.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup (Cloudflare D1)
1. Create a D1 database in your Cloudflare dashboard.
2. Update `wrangler.toml` with your `database_id`.
3. Run migrations locally (optional):
```bash
npx wrangler d1 execute sithumina-db --local --file=./migrations/0001_initial_schema.sql
```

### 3. Seed Data
Generate 400 seeded profiles:
```bash
node scripts/generate_seed.js
```
This will create `scripts/seed.sql` which you can execute against D1.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

### 5. Deployment
Deploy to Cloudflare Pages:
```bash
npx wrangler pages deploy .
```

## Project Structure
- `src/app`: Next.js App Router pages.
- `src/components`: Reusable UI components (Header, Footer, ProfileCard, ChatWindow).
- `src/lib`: Shared types and utilities.
- `migrations`: SQL migration files.
- `scripts`: Seeding scripts.

## License
MIT
