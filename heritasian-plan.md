# Heritasian Heritage Hotel Index (HHI) - Implementation Plan

## Context

John is building **Heritasian.com** as a heritage hotel directory and ranking platform for Southeast Asia — think "Michelin Guide for heritage hotels." The platform needs a proprietary **Heritasian Heritage Index (HHI)** that scores and ranks 50-100 heritage hotels across Southeast Asia (Thailand, Vietnam, Cambodia, Myanmar, Malaysia, Singapore, Indonesia, Philippines, Laos).

**Constraints:** Bootstrap budget (free/public data only for MVP), no paid audits or mystery shoppers initially.

**Goal:** A credible, transparent, defensible index that establishes Heritasian.com as the authority on heritage hospitality in Southeast Asia.

---

## Task Ownership Legend

| Icon | Owner | Role |
|------|-------|------|
| **[J]** | **John** | Domain expert, hotel relationships, editorial, on-the-ground research |
| **[M]** | **Marc** | Tech/data, scraping, NLP, database, web platform |
| **[J+M]** | **Both** | Collaborative work requiring both domain and tech expertise |

---

## Phase 1: Define the Scoring Framework (Weeks 1-3)

### 1.1 Finalize Index Categories and Weights [J+M]

Three pillars with sub-metrics. Proposed weights (John validates based on domain expertise):

| Category | Weight | Sub-metrics |
|----------|--------|-------------|
| **Heritage & Authenticity (H&A)** | 40% | Historical Significance (15%), Architectural Integrity (15%), Cultural Immersion (10%) |
| **Guest Experience (GE)** | 35% | Authentic Experience Score via NLP (15%), Reputation Score (12%), Service Quality (8%) |
| **Operational Excellence (OE)** | 25% | Conservation Commitment (10%), Modern Comforts (8%), Value Positioning (7%) |

**Tasks:**
- **[J]** Review and adjust weights based on what matters most to heritage travelers. Decide: should a perfectly preserved but uncomfortable hotel score higher than a well-adapted one?
- **[J]** Define what "Cultural Immersion" means concretely: local art? staff in traditional dress? historical tours? local food sourcing?
- **[M]** Create a scoring rubric spreadsheet with 0-100 scales for each sub-metric, with clear descriptors for each score range (e.g., 0-20 = "No heritage features preserved", 80-100 = "UNESCO-listed, original structure intact")
- **[J+M]** Validate rubric against 5 well-known hotels (e.g., Raffles Singapore, The Siam Bangkok, Capella Singapore) as calibration anchors

### 1.2 Define Heritage Classification Tiers [J]

Create tier system for the index output (not just a number):

| Tier | HHI Score | Label |
|------|-----------|-------|
| Tier 1 | 85-100 | "Heritage Landmark" |
| Tier 2 | 70-84 | "Heritage Distinguished" |
| Tier 3 | 55-69 | "Heritage Notable" |
| Tier 4 | 40-54 | "Heritage Emerging" |

- **[J]** Name the tiers (above are suggestions — John picks final branding)
- **[J]** Write a 2-3 sentence description of what each tier represents

---

## Phase 2: Build the Hotel Database (Weeks 2-5)

### 2.1 Compile the Initial Hotel List [J]

- **[J]** Curate a seed list of 50-100 heritage hotels across Southeast Asia. Sources:
  - CNN Travel's "Best heritage hotels in Asia" lists
  - Condé Nast Traveler heritage features
  - Local tourism board heritage hotel programs (e.g., Thailand's TAT heritage listings)
  - UNESCO World Heritage Site hotel conversions
  - Personal knowledge and industry contacts
- **[J]** For each hotel, capture: name, location, country, year built, original purpose, current ownership, whether listed/protected, key architectural features, website URL
- **[M]** Create a structured database/spreadsheet template for John to fill in

### 2.2 Gather Heritage & Government Data [J+M]

Southeast Asian heritage building registries to cross-reference:

| Country | Heritage Authority | Data Source |
|---------|-------------------|-------------|
| Thailand | Fine Arts Department (กรมศิลปากร) | Listed ancient monuments register |
| Vietnam | Ministry of Culture (Law on Cultural Heritage 2024) | National heritage site listings |
| Cambodia | APSARA Authority | Angkor zone protections |
| Myanmar | Department of Archaeology | Protected monuments list |
| Malaysia | Jabatan Warisan Negara | National Heritage Act 2005 registry |
| Singapore | URA Conservation + Preservation of Sites & Monuments | 7,000+ gazetted buildings list |
| Indonesia | Balai Pelestarian Cagar Budaya | Cagar Budaya (cultural property) register |
| Philippines | National Historical Commission | Heritage zone declarations |
| Laos | Ministry of Information, Culture & Tourism | Luang Prabang UNESCO zone |

- **[M]** Scrape/download publicly available heritage building lists from each country
- **[J]** Cross-reference hotel list against heritage registries — which hotels are in officially protected/listed buildings?
- **[J]** Research each hotel's historical narrative: original construction date, purpose, notable events/figures, architectural style

### 2.3 Collect Guest Review Data [M]

- **[M]** Build scrapers or use free API tiers for:
  - **Google Maps/Places API** (free tier: review snippets, ratings, photo count)
  - **TripAdvisor** (public review pages — scrape within ToS limits)
  - **Booking.com** (public review scores and category breakdowns)
  - **Agoda** (particularly strong in SEA)
- **[M]** For each hotel, collect: overall rating, number of reviews, review text samples (minimum 50 per hotel for NLP), category scores where available
- **[M]** Store in structured database with source attribution

---

## Phase 3: Score Calculation Engine (Weeks 4-7)

### 3.1 Heritage & Authenticity Scoring [J+M]

**Historical Significance (15%):**
- **[M]** Auto-score based on: building age (older = higher), protected/listed status (binary bonus), UNESCO association (binary bonus)
- **[J]** Manual score for: association with notable figures/events, historical importance of original purpose (palace > warehouse > office)
- **[J+M]** Calibrate: a 400-year-old temple conversion vs. a 100-year-old colonial mansion — how do we normalize?

**Architectural Integrity (15%):**
- **[J]** Manual assessment for MVP (no budget for architect audits): based on hotel website photos, virtual tours, travel articles, and personal knowledge
- **[J]** Score on: % of original structure preserved, quality of restoration, use of traditional materials, authenticity of interior design
- **[M]** Later phase: build a photo analysis tool using AI vision to detect original vs. modern elements

**Cultural Immersion (10%):**
- **[J]** Manual score based on: Does the hotel offer historical tours? Local art/craft displays? Cultural programming? Local food sourcing? Community engagement?
- **[M]** Supplement with NLP: scan hotel website and review text for cultural programming keywords

### 3.2 Guest Experience Scoring [M]

**Authentic Experience Score (15%):**
- **[M]** Run NLP sentiment analysis on collected reviews using Claude API or OpenAI:
  - Filter reviews containing heritage-related keywords: "authentic", "historic", "charm", "character", "story", "heritage", "original", "restored", "colonial", "traditional", "unique", "atmosphere"
  - Score sentiment of these filtered reviews (positive mentions of heritage = high score)
  - Calculate ratio: (positive heritage mentions) / (total reviews) * sentiment strength
- **[M]** Research shows LLMs (GPT-4, Claude) outperform traditional NLP for context-rich sentiment analysis — use zero-shot classification

**Reputation Score (12%):**
- **[M]** Aggregate scores across platforms: Google (1-5), TripAdvisor (1-5), Booking.com (1-10), Agoda (1-10)
- **[M]** Normalize all to 0-100 scale, weighted by review count (more reviews = more reliable)
- **[M]** Formula: `Reputation = weighted_avg(normalized_scores) * confidence_factor(review_count)`

**Service Quality (8%):**
- **[M]** NLP analysis of reviews mentioning staff, service, knowledge, hospitality
- **[J]** Bonus points for: staff trained in property history, guided tours offered, cultural concierge services

### 3.3 Operational Excellence Scoring [J+M]

**Conservation Commitment (10%):**
- **[J]** Manual research: Does the hotel publish conservation/sustainability reports? Heritage maintenance plans? Green certifications?
- **[M]** Scrape hotel websites for sustainability/conservation page content

**Modern Comforts (8%):**
- **[M]** Extract from Booking.com/TripAdvisor: facility listings, amenity scores, accessibility info
- **[J]** Assess balance: modern comforts that don't compromise heritage character

**Value Positioning (7%):**
- **[M]** Collect ADR (Average Daily Rate) from public booking sites
- **[M]** Calculate value ratio: HHI score / price relative to local luxury average
- **[J]** Contextualize: a $50/night heritage hotel in Laos vs. $500/night in Singapore

### 3.4 Index Calculation [M]

- **[M]** Normalize all sub-metric scores to 0-100 using min-max normalization:
  ```
  Normalized = ((Value - Min) / (Max - Min)) * 100
  ```
- **[M]** Apply weights and sum:
  ```
  HHI = (H&A_score * 0.40) + (GE_score * 0.35) + (OE_score * 0.25)
  ```
- **[M]** Handle missing data: if a sub-metric lacks data, redistribute its weight proportionally among available metrics in the same category
- **[M]** Generate confidence score per hotel based on data completeness (% of metrics with actual data vs. estimated/missing)

---

## Phase 4: Presentation & Platform (Weeks 6-9)

### 4.1 Hotel Profile Pages [M]

Each hotel gets a profile page showing:
- HHI score + tier badge
- Radar chart showing H&A / GE / OE breakdown
- Historical timeline (year built, key events, conversion to hotel)
- Photo gallery
- Key heritage features highlighted
- Link to booking (affiliate revenue opportunity)

### 4.2 Index Rankings Page [M]

- Overall Top 50/100 ranking
- Filter by: country, tier, price range, architectural style, era
- Sort by: overall HHI, H&A score, GE score, OE score

### 4.3 Methodology Transparency Page [J+M]

- **[J]** Write the editorial explanation of why these metrics matter
- **[M]** Document the technical methodology (data sources, normalization, weighting)
- **[J+M]** This is critical for credibility — Michelin, Forbes Travel Guide, and similar indices all publish their methodology

### 4.4 Visual Identity for the Index [J]

- **[J]** Design tier badges/seals that hotels can display (like "TripAdvisor Certificate of Excellence")
- **[J]** Create a "Heritasian Verified" badge for hotels that have been personally visited/audited

---

## Phase 5: Validation & Launch (Weeks 8-12)

### 5.1 Pilot Validation [J+M]

- **[J+M]** Score 10 well-known heritage hotels first as a sanity check
- **[J]** Review results: Do the scores match industry consensus? Does Raffles rank near the top? Do the tiers feel right?
- **[M]** Adjust weights/normalization if results seem off (e.g., age dominating over guest experience)
- **[J+M]** Have 2-3 hotel industry contacts review the pilot results for face validity

### 5.2 Scale to Full List [J+M]

- **[J]** Complete manual scoring for all 50-100 hotels (H&A metrics)
- **[M]** Run automated scoring pipeline for all hotels (GE + OE metrics)
- **[M]** Generate final HHI scores and rankings
- **[J]** Write editorial descriptions for Top 10 hotels

### 5.3 Launch Strategy [J]

- **[J]** Reach out to top-ranked hotels — inform them of their ranking, offer the badge, build relationships
- **[J]** Write a launch blog post / press release explaining the index
- **[J]** Consider: offering hotels a free "Heritage Assessment" as a lead generation tool

---

## Future Enhancements (Post-Launch)

| Enhancement | Owner | When |
|-------------|-------|------|
| AI vision analysis of hotel photos for architectural scoring | [M] | V2 |
| Mystery guest program (volunteer heritage enthusiasts) | [J] | V2 |
| Hotel self-submission portal with verification | [M] | V2 |
| Quarterly re-scoring with fresh review data | [M] | Ongoing |
| Expand to South Asia (India, Sri Lanka, Nepal) | [J+M] | V3 |
| Affiliate booking integration for revenue | [M] | V2 |
| API for hotels to embed their HHI badge | [M] | V2 |
| Partnership with ReviewPro/TrustYou for premium data | [J] | V3 |
| Annual "Heritasian Awards" ceremony | [J] | Year 2 |

---

## Key Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Hotels dispute their ranking | Publish transparent methodology; offer hotels the ability to submit additional documentation |
| Insufficient review data for smaller hotels | Use confidence scores; mark data-sparse hotels as "Preliminary Rating" |
| Bias toward well-known/expensive hotels | Weight cultural immersion and conservation commitment to give smaller authentic hotels a chance |
| Legal issues with review scraping | Use official APIs where available; only store aggregated scores, not full review text |
| John can't manually score 100 hotels alone | Start with Top 50; use tiered approach (full audit for Top 20, lighter touch for rest) |

---

## Verification / How to Test

1. **Rubric validation:** Score 5 calibration hotels independently (John + Marc), compare scores, resolve disagreements to refine rubric
2. **Data pipeline test:** Run full automated scoring for 10 hotels, verify all data sources return valid data
3. **NLP accuracy:** Manually label 100 reviews as "heritage-positive/negative/neutral", compare against NLP output, target >80% agreement
4. **Index face validity:** Show final Top 10 ranking to 3 industry contacts — do they agree with the ordering?
5. **Edge cases:** Test hotels with minimal online presence, very old vs. recently converted properties, budget vs. luxury

---

## Summary of Work Split

| Phase | John's Work | Marc's Work |
|-------|-------------|-------------|
| 1. Framework | Define what matters, set weights, name tiers | Build scoring rubric spreadsheet, create templates |
| 2. Database | Curate hotel list, research histories, cross-ref heritage registries | Build database, scrape government data, collect reviews |
| 3. Scoring | Manual H&A scoring for each hotel, editorial judgment calls | NLP pipeline, automated GE/OE scoring, index calculation |
| 4. Platform | Write editorial content, methodology narrative, design badges | Build website pages, charts, ranking system |
| 5. Launch | Hotel outreach, press, industry validation | Run full pipeline, generate final scores, deploy |

**Estimated John effort:** ~60-80 hours over 12 weeks (heavy in Phases 1-2, lighter in 3-4)
**Estimated Marc effort:** ~40-60 hours over 12 weeks (heavy in Phases 2-3, lighter in 1 and 5)
