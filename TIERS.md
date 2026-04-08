# Heritage Tiers

> **Methodology version:** v1.0 &nbsp;·&nbsp; **As of:** 2026-04-09 &nbsp;·&nbsp; **Framework:** [ICOMOS Nara Document on Authenticity (1994)](https://www.icomos.org/en/charters-and-texts/179-articles-en-francais/ressources/charters-and-standards/386-the-nara-document-on-authenticity-1994)

Every hotel in the Heritasian index receives a **Heritage Hotel Index (HHI)** score from 0–100. That score maps to one of four tiers.

The HHI operationalises the six authenticity dimensions of the ICOMOS Nara Document — the international reference framework used by UNESCO for World Heritage evaluation — into nine measurable sub-metrics. Full mapping is on the [methodology page](/methodology).

## Tiers

| Tier | Label | HHI range | What it means |
|---|---|---|---|
| `landmark` | Heritage Landmark | **85 – 100** | Exceptional — a defining heritage property of the region |
| `distinguished` | Heritage Distinguished | **70 – 84** | Strong heritage credentials, well executed |
| `notable` | Heritage Notable | **55 – 69** | Real heritage character with room to grow |
| `emerging` | Heritage Emerging | **40 – 54** | Heritage elements present, still developing |

Hotels scoring below 40 are not listed.

## How HHI is calculated

HHI is a weighted average of **9 sub-metrics** (each scored 0–100) grouped under **3 pillars**. Weights sum to 100%, so HHI itself lands on a 0–100 scale.

| Pillar | Weight | Sub-metric | Weight |
|---|---|---|---|
| **Heritage & Authenticity** | **40%** | Historical significance | 15% |
| | | Architectural integrity | 15% |
| | | Cultural immersion | 10% |
| **Guest Experience** | **35%** | Authentic experience | 15% |
| | | Reputation score | 12% |
| | | Service quality | 8% |
| **Operational Excellence** | **25%** | Conservation commitment | 10% |
| | | Modern comforts | 8% |
| | | Value positioning | 7% |

Each sub-metric is multiplied by its weight, the nine terms are summed, and the result is rounded to two decimals. The tier is then read off the table above.

**Worked example:** a hotel scoring 90 across every sub-metric gets HHI = 90.00 → *Heritage Landmark*. A hotel averaging 72 gets HHI ≈ 72 → *Heritage Distinguished*.

## Where this lives in code

The formula is currently mirrored in two places and **must stay in sync** (this will be fixed in Phase 1 by moving the formula into a Postgres view — see `drizzle/0001_evidence_layer.sql`):

- **Client-side:** `calculateHHI()` and `getTier()` in [src/types/index.ts](src/types/index.ts)
- **Server-side:** `HHI_SQL` expression in [src/data/db.ts](src/data/db.ts), used by [netlify/functions/api.ts](netlify/functions/api.ts)

## Changelog

| Version | Date | Change |
|---|---|---|
| v1.0 | 2026-04-09 | Initial public methodology. Anchored to ICOMOS Nara framework. Reputation-score aggregation claim (Google / TripAdvisor / Booking.com) removed pending v2 implementation. |
