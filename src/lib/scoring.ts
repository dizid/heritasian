/**
 * Canonical source for HHI scoring constants and tier derivation.
 *
 * The HHI formula itself lives in Postgres generated columns (see drizzle/0002 + 0003).
 * This module exports the weight constants (for documentation/UI) and the tier
 * bucketing function (used by transformHotel to derive tier from the DB-computed hhi).
 */

import type { Tier } from '../types'

// Sub-metric weights as percentages (sum to 100).
// The Postgres generated column uses these same values — keep in sync via migration.
export const HHI_WEIGHTS = {
  historical_significance: 15,
  architectural_integrity: 15,
  cultural_immersion: 10,
  authentic_experience: 15,
  reputation: 12,
  service_quality: 8,
  conservation: 10,
  modern_comforts: 8,
  value: 7,
} as const

// Pillar divisors (sum of each pillar's sub-metric weights)
export const PILLAR_DIVISORS = { ha: 40, ge: 35, oe: 25 } as const

// Single source of truth for tier bounds, labels, and colors.
// Emerging is bounded at 40 — hotels with hhi < 40 are rejected by a DB CHECK constraint.
export const TIER_BOUNDS: Record<Tier, { label: string; min: number; max: number; color: string }> = {
  landmark:      { label: 'Heritage Landmark',      min: 85, max: 100,   color: '#c9a96e' },
  distinguished: { label: 'Heritage Distinguished', min: 70, max: 84.99, color: '#b5c1ad' },
  notable:       { label: 'Heritage Notable',       min: 55, max: 69.99, color: '#a3b3d4' },
  emerging:      { label: 'Heritage Emerging',      min: 40, max: 54.99, color: '#c9a5a5' },
}

// Derive tier from a DB-computed HHI score.
export function getTier(hhi: number): Tier {
  if (hhi >= 85) return 'landmark'
  if (hhi >= 70) return 'distinguished'
  if (hhi >= 55) return 'notable'
  if (hhi >= 40) return 'emerging'
  throw new Error(`HHI ${hhi} is below the minimum tier bound (40)`)
}
