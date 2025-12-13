# YOUWARE.md

## Project Overview
This is a mobile-first React application designed for reading stories ("Gác Truyện Lú"). It uses a Cloudflare Worker backend with D1 database.

## Architecture
- **Frontend**: React 18, Vite, Tailwind CSS, Zustand (State Management).
- **Backend**: Cloudflare Workers (Hono framework), D1 Database (SQLite).
- **Database**: Tables for `users`, `stories`, `chapters`, `unlocks`, `transactions`.

## Key Commands
- `npm install`: Install dependencies.
- `npm run build`: Build the frontend for production.
- `npm run dev`: Run local development server.
- `npm run preview`: Preview the production build.

## Backend & Database
- **Schema**: Defined in `backend/schema.sql`.
- **API URL**: Configured in `src/store/useAuthStore.ts` and `src/store/useStoryStore.ts`. Currently set to `https://backend.youware.com/api`.
- **Deployment**: Backend is deployed to Cloudflare Workers. Frontend can be deployed to any static host (Netlify, Vercel, Cloudflare Pages).

## Mobile Features
- Uses `src/utils/mobileFeatures.ts` for mobile-specific interactions (haptics, image downloads).
- Layout is optimized for mobile viewports with bottom navigation.

## Authentication
- Google Login via `google.accounts.id` API.
- User session managed via `useAuthStore` and persisted in `users` table.

## Deployment Guide
Detailed step-by-step deployment instructions for GitHub, Cloudflare Workers, and Netlify are available in `DEPLOY.md`.

## Recent Changes
- Initialized database schema and seed data.
- Updated `Profile.tsx` to match design with specific icons and layout.
- Updated `Home.tsx` to make blue bar items functional (filtering).
- Created `DEPLOY.md` with detailed deployment instructions.
