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

export interface Hotel {
  id: string
  slug: string
  name: string
  country: CountryCode
  city: string
  yearBuilt: number
  originalPurpose: string
  architecturalStyle: string
  description: string
  highlights: string[]
  imageUrl: string
  websiteUrl: string
  priceRange: PriceRange
  scores: HHIScores
  hhi: number
  tier: Tier
  timeline: TimelineEvent[]
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

export const TIER_CONFIG: Record<Tier, { label: string; min: number; max: number; color: string }> = {
  landmark: { label: 'Heritage Landmark', min: 85, max: 100, color: '#c9a96e' },
  distinguished: { label: 'Heritage Distinguished', min: 70, max: 84, color: '#a8b4a0' },
  notable: { label: 'Heritage Notable', min: 55, max: 69, color: '#8b9fc5' },
  emerging: { label: 'Heritage Emerging', min: 40, max: 54, color: '#b08d8d' },
}

export function getTier(score: number): Tier {
  if (score >= 85) return 'landmark'
  if (score >= 70) return 'distinguished'
  if (score >= 55) return 'notable'
  return 'emerging'
}

export function calculateHHI(scores: HHIScores): number {
  const ha =
    scores.heritageAuthenticity.historicalSignificance * 0.15 +
    scores.heritageAuthenticity.architecturalIntegrity * 0.15 +
    scores.heritageAuthenticity.culturalImmersion * 0.10

  const ge =
    scores.guestExperience.authenticExperience * 0.15 +
    scores.guestExperience.reputationScore * 0.12 +
    scores.guestExperience.serviceQuality * 0.08

  const oe =
    scores.operationalExcellence.conservationCommitment * 0.10 +
    scores.operationalExcellence.modernComforts * 0.08 +
    scores.operationalExcellence.valuePositioning * 0.07

  return Math.round((ha + ge + oe) * 100) / 100
}

export function getPillarScore(scores: HHIScores): { ha: number; ge: number; oe: number } {
  const ha =
    (scores.heritageAuthenticity.historicalSignificance * 15 +
      scores.heritageAuthenticity.architecturalIntegrity * 15 +
      scores.heritageAuthenticity.culturalImmersion * 10) / 40

  const ge =
    (scores.guestExperience.authenticExperience * 15 +
      scores.guestExperience.reputationScore * 12 +
      scores.guestExperience.serviceQuality * 8) / 35

  const oe =
    (scores.operationalExcellence.conservationCommitment * 10 +
      scores.operationalExcellence.modernComforts * 8 +
      scores.operationalExcellence.valuePositioning * 7) / 25

  return {
    ha: Math.round(ha * 10) / 10,
    ge: Math.round(ge * 10) / 10,
    oe: Math.round(oe * 10) / 10,
  }
}
