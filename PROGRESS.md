# Heritasian — Project Progress

## What Is Heritasian?

Heritasian is a heritage hotel directory and ranking platform for Southeast Asia — think of it as the **Michelin Guide for heritage hotels**. The platform uses a proprietary scoring system called the **Heritasian Heritage Index (HHI)** to evaluate and rank hotels housed in historically significant buildings across nine countries: Thailand, Vietnam, Cambodia, Myanmar, Malaysia, Singapore, Indonesia, Philippines, and Laos.

The goal is to become the definitive authority on heritage hospitality in the region — helping travelers discover hotels where history, architecture, and culture are part of the experience, not just an afterthought.

---

## What Has Been Built

The entire platform is live and functional. All four main pages are complete, the scoring engine works, and the site is deployed and accessible online. Here's what each part of the platform does:

### Home Page

The landing page introduces visitors to Heritasian with:

- A hero section with a clear call to action ("Explore Rankings")
- The top 5 highest-rated heritage hotels displayed as cards
- A visual explanation of the three scoring pillars (Heritage & Authenticity, Guest Experience, Operational Excellence)
- A "Nine Nations, One Index" section showing all nine countries with hotel counts for each

### Rankings Page

The full hotel directory with powerful filtering and sorting:

- **Filter by:** Country, tier (Landmark, Distinguished, Notable, Emerging), and price range
- **Sort by:** Overall HHI score, Heritage & Authenticity score, Guest Experience score, Operational Excellence score, year built, or hotel name
- Filters stay in the URL, so you can share a filtered view with someone
- Hotels display as cards showing their image, name, location, year built, HHI score, tier badge, and a visual breakdown of their three pillar scores

### Hotel Detail Page

Each hotel gets its own dedicated page featuring:

- A large hero image with the hotel name and location
- The HHI score displayed in a circular badge, color-coded by tier
- A **radar chart** visually comparing the three pillar scores
- A detailed **score breakdown** showing all nine individual metrics as animated progress bars
- An "About the Property" section with the hotel's story
- The building's **original purpose** (e.g., colonial mansion, royal palace, trading house)
- **Highlight tags** for quick-glance features
- A **historical timeline** showing key events in the property's history
- A link to the hotel's official website

### Methodology Page

Full transparency on how hotels are scored — critical for credibility:

- **Why the HHI exists:** Explains the gap that major travel platforms treat a 200-year-old colonial building the same as a modern hotel
- **Three Pillars breakdown:** Each pillar is explained with its weight, description, and the individual metrics within it
- **Tier definitions:** What it means to be rated Landmark vs. Distinguished vs. Notable vs. Emerging, with score ranges
- **Data sources:** Lists where the data comes from (Google Reviews, TripAdvisor, Booking.com, heritage registries, expert assessment)
- **Independence statement:** A clear declaration that Heritasian accepts no payment from hotels in exchange for ratings or inclusion

---

## The Scoring System (HHI)

Every hotel is scored on a 0–100 scale across three pillars:

### Heritage & Authenticity (40% of total score)
- **Historical Significance (15%)** — How old is the building? Is it heritage-listed? Was it associated with notable historical events or figures?
- **Architectural Integrity (15%)** — How much of the original structure is preserved? Is the restoration faithful to the original design?
- **Cultural Immersion (10%)** — Does the hotel offer historical tours, local art, cultural programming, or locally sourced food?

### Guest Experience (35% of total score)
- **Authentic Experience (15%)** — What do guests say about the heritage experience? Based on sentiment analysis of online reviews mentioning heritage-related keywords
- **Reputation Score (12%)** — Aggregated guest ratings from Google, TripAdvisor, Booking.com, and Agoda
- **Service Quality (8%)** — Do staff know the property's history? Are guided tours offered?

### Operational Excellence (25% of total score)
- **Conservation Commitment (10%)** — Does the hotel have a heritage maintenance plan? Sustainability certifications?
- **Modern Comforts (8%)** — Are modern amenities available without compromising the heritage character?
- **Value Positioning (7%)** — Is the pricing fair relative to the heritage experience offered?

### The Four Tiers

| Tier | Score Range | What It Means |
|------|------------|---------------|
| Landmark | 85–100 | The finest heritage hotels — exceptional preservation, outstanding guest experience, exemplary stewardship |
| Distinguished | 70–84 | Excellent heritage properties with strong scores across all three pillars |
| Notable | 55–69 | Solid heritage hotels with clear strengths and room for improvement |
| Emerging | 40–54 | Properties with heritage potential that are developing their offering |

---

## Design & Look

The platform has a **dark, luxurious aesthetic** that reflects the heritage theme:

- Deep charcoal backgrounds with warm gold accents
- Elegant serif headings (Playfair Display) paired with clean body text (Inter)
- Glassmorphism effects (frosted glass-like panels) throughout the interface
- Tier-specific colors: gold for Landmark, sage green for Distinguished, blue for Notable, terracotta for Emerging
- Fully responsive — designed mobile-first, works beautifully on phones, tablets, and desktops
- Smooth animations on score bars and page transitions

---

## Infrastructure

Everything needed to run the platform is in place:

- The website is **deployed and live** on Netlify
- The **database** is set up on Neon PostgreSQL with tables for hotels, historical timeline events, and countries
- The **API** is built and handles all filtering, sorting, and hotel lookups
- The scoring engine calculates HHI scores both on the server and in the browser, keeping them perfectly in sync

---

## What's Ready vs. What's Next

### Done
- Complete website with all four pages
- Full scoring engine with weighted calculations
- Database schema for hotels, timeline events, and countries
- API with filtering and sorting
- Responsive design with dark luxury theme
- Methodology transparency page
- Deployed and accessible online
- Nine countries defined with flag icons

### Next Steps
- **Populate the database** with 50–100 heritage hotels (John's curation + Marc's data collection)
- **Manual scoring** for Heritage & Authenticity metrics (John's domain expertise)
- **Automated scoring** via review scraping and NLP sentiment analysis (Marc's data pipeline)
- **Pilot validation** — score 10 well-known hotels first as a sanity check
- **SEO optimization** — per-page meta tags, Open Graph images, structured data for search engines
- **Hotel outreach** — inform top-ranked hotels of their ranking, offer badges
- **Launch content** — blog post or press release announcing the index

---

## The Vision Ahead

Once populated with hotel data, Heritasian will be the first platform to treat heritage hotels as a distinct category deserving their own evaluation framework. Future plans include AI-powered photo analysis for architectural scoring, a hotel self-submission portal, affiliate booking integration, expansion to South Asia, and an annual Heritasian Awards ceremony.

The platform is built. Now it's time to fill it with the stories of Southeast Asia's most remarkable heritage properties.
