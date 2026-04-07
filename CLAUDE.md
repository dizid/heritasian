# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Heritasian.com** — Heritage hotel directory and ranking platform for Southeast Asia. Scores and ranks heritage hotels using the proprietary Heritasian Heritage Index (HHI).

## Commands

- `npm run dev` — Start Vite dev server (includes Netlify Functions via `@netlify/vite-plugin`)
- `npm run build` — Type-check with `vue-tsc` then build with Vite
- `npm run preview` — Preview production build locally

E2E tests use Playwright (`npx playwright test`). No unit test runner configured yet.

## Stack

- **Frontend:** Vue 3 (`<script setup>`), TypeScript, Tailwind CSS 4 (`@theme {}` in `src/assets/main.css`), Vue Router
- **Backend:** Single Netlify Function (`netlify/functions/api.ts`) using `@neondatabase/serverless`
- **Database:** Neon PostgreSQL (tables: `hotels`, `timeline_events`, `countries`)
- **SEO:** `@unhead/vue` for head management
- **Deploy:** Netlify (config in `netlify.toml`)

## Architecture

### HHI Scoring System

Three pillars with weighted sub-metrics (defined in `src/types/index.ts`):
- **Heritage & Authenticity (40%):** historicalSignificance (15%), architecturalIntegrity (15%), culturalImmersion (10%)
- **Guest Experience (35%):** authenticExperience (15%), reputationScore (12%), serviceQuality (8%)
- **Operational Excellence (25%):** conservationCommitment (10%), modernComforts (8%), valuePositioning (7%)

HHI calculation and tier derivation exist in two places that must stay in sync:
1. **Client-side:** `calculateHHI()`, `getTier()`, `getPillarScore()` in `src/types/index.ts`
2. **Server-side:** `HHI_SQL` expression, `deriveTier()`, `derivePillarScores()` in `netlify/functions/api.ts`

Four tiers: landmark (85-100), distinguished (70-84), notable (55-69), emerging (40-54).

### API

Single function at `netlify/functions/api.ts`, routed via Netlify redirect `/api/*`:
- `GET /api/hotels` — List with filters (`country`, `tier`, `price`), sort (`hhi`, `ha`, `ge`, `oe`, `name`, `year`), order
- `GET /api/hotels/:slug` — Single hotel with timeline events (joined from `timeline_events` table)

The function computes HHI in SQL via a CTE and transforms flat DB rows into the `Hotel` interface shape.

### Frontend Patterns

- **Composables:** `useHotels()` for fetching/filtering, `useScores()` for display formatting
- **Views** (lazy-loaded): Home, Rankings, Hotel (`:slug`), Methodology
- **Components:** organized under `hotel/`, `layout/`, `shared/`
- **Styling:** Dark theme with heritage luxury palette. Uses `.glass` / `.glass-light` classes for glassmorphism. `.text-gold-gradient` for accent text. Fonts: Playfair Display (headings), Inter (body).

### Path Alias

`@` maps to `src/` (configured in `vite.config.ts`).

## Deployment

- **GitHub:** https://github.com/dizid/heritasian
- **Netlify site:** heritasian (ID: a0128d79-b04e-4eab-8a07-f382a2a06417)
- **Netlify URL:** https://heritasian.netlify.app
- **Neon project:** heritasian (ID: solitary-glitter-26300820)
- **Neon branch:** main (ID: br-red-violet-akwqhdc7)
- **Neon database:** neondb

## Environment

`DATABASE_URL` — Neon PostgreSQL connection string (see `.env.example`).

## Database

Tables: `hotels` (all score columns are `score_*` snake_case), `timeline_events` (foreign key to `hotels.id`), `countries`. No migrations directory exists yet — schema managed directly.
