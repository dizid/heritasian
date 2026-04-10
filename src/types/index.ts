export type CountryCode = 'TH' | 'VN' | 'KH' | 'MM' | 'MY' | 'SG' | 'ID' | 'PH' | 'LA'
export type PriceRange = '$' | '$$' | '$$$' | '$$$$'
export type Tier = 'landmark' | 'distinguished' | 'notable' | 'emerging'

export interface TimelineEvent {
  year: number
  event: string
}

export interface HHIScores {
  heritageAuthenticity: {
    historicalSignificance: number
    architecturalIntegrity: number
    culturalImmersion: number
  }
  guestExperience: {
    authenticExperience: number
    reputationScore: number
    serviceQuality: number
  }
  operationalExcellence: {
    conservationCommitment: number
    modernComforts: number
    valuePositioning: number
  }
}

export type ScoreDimension =
  | 'historical_significance' | 'architectural_integrity' | 'cultural_immersion'
  | 'authentic_experience' | 'reputation' | 'service_quality'
  | 'conservation' | 'modern_comforts' | 'value'

export interface EvidenceItem {
  sourceUrl: string | null
  excerpt: string | null
  notes: string | null
  ratingRationale: string | null
}

export interface Hotel {
  id: string
  slug: string
  name: string
  country: CountryCode
  city: string
  yearBuilt: number
  originalPurpose: string
  architecturalStyle: string
  tagline: string
  description: string
  highlights: string[]
  imageUrl: string
  websiteUrl: string
  priceRange: PriceRange
  scores: HHIScores
  hhi: number
  tier: Tier
  pillarScores: { ha: number; ge: number; oe: number }
  timeline: TimelineEvent[]
  evidence: Partial<Record<ScoreDimension, EvidenceItem[]>>
}

export interface Country {
  code: CountryCode
  name: string
  flag: string
}

export const COUNTRIES: Country[] = [
  { code: 'TH', name: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}' },
  { code: 'VN', name: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}' },
  { code: 'KH', name: 'Cambodia', flag: '\u{1F1F0}\u{1F1ED}' },
  { code: 'MM', name: 'Myanmar', flag: '\u{1F1F2}\u{1F1F2}' },
  { code: 'MY', name: 'Malaysia', flag: '\u{1F1F2}\u{1F1FE}' },
  { code: 'SG', name: 'Singapore', flag: '\u{1F1F8}\u{1F1EC}' },
  { code: 'ID', name: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}' },
  { code: 'PH', name: 'Philippines', flag: '\u{1F1F5}\u{1F1ED}' },
  { code: 'LA', name: 'Laos', flag: '\u{1F1F1}\u{1F1E6}' },
]

// Re-export from canonical scoring module for backward compatibility.
// 8 components import TIER_CONFIG from '@/types' — this alias preserves those imports.
export { TIER_BOUNDS as TIER_CONFIG, getTier } from '../lib/scoring'
