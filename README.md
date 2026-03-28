# Heritasian

**The Michelin Guide for heritage hotels in Southeast Asia.**

Heritasian.com is a heritage hotel directory and ranking platform that scores and ranks hotels housed in historically significant buildings across nine Southeast Asian countries using the proprietary **Heritasian Heritage Index (HHI)**.

**Live:** [heritasian.netlify.app](https://heritasian.netlify.app)

---

## The Heritasian Heritage Index (HHI)

Every hotel is scored 0–100 across three weighted pillars:

| Pillar | Weight | What It Measures |
|--------|--------|-----------------|
| Heritage & Authenticity | 40% | Historical significance, architectural integrity, cultural immersion |
| Guest Experience | 35% | Authentic experience (NLP sentiment), reputation scores, service quality |
| Operational Excellence | 25% | Conservation commitment, modern comforts, value positioning |

Hotels are classified into four tiers: **Landmark** (85–100), **Distinguished** (70–84), **Notable** (55–69), and **Emerging** (40–54).

See [PROGRESS.md](PROGRESS.md) for a detailed non-technical overview of what has been built.
See [heritasian-plan.md](heritasian-plan.md) for the full implementation plan and work split.

---

## Tech Stack

- **Frontend:** Vue 3, TypeScript, Tailwind CSS 4, Vue Router, Chart.js
- **Backend:** Netlify Functions (serverless)
- **Database:** Neon PostgreSQL
- **Deploy:** Netlify
- **Testing:** Playwright (E2E)

## Getting Started

```bash
# Clone
git clone https://github.com/dizid/heritasian.git
cd heritasian

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Add your Neon DATABASE_URL to .env

# Development
npm run dev

# Build (includes type checking)
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
  views/           Home, Rankings, Hotel detail, Methodology
  components/
    hotel/         HotelCard, RadarChart, Timeline, ScoreBadge
    layout/        Header, Footer
    rankings/      Filter, List
    shared/        TierBadge, ScoreBar
  composables/     useHotels (data fetching + filtering)
  types/           TypeScript interfaces + HHI calculation
  router/          Vue Router config
  assets/          Tailwind CSS + custom theme
netlify/
  functions/       API endpoint (hotels listing + detail)
e2e/               Playwright E2E tests
```

## Countries Covered

Thailand, Vietnam, Cambodia, Myanmar, Malaysia, Singapore, Indonesia, Philippines, Laos
