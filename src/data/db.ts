import { neon } from '@neondatabase/serverless'
import type { Hotel, Tier } from '@/types'

// HHI SQL expression — computed in-database so we can sort and filter on it
export const HHI_SQL = `
  ROUND((
    (score_historical_significance * 0.15 + score_architectural_integrity * 0.15 + score_cultural_immersion * 0.10)
    + (score_authentic_experience * 0.15 + score_reputation * 0.12 + score_service_quality * 0.08)
    + (score_conservation * 0.10 + score_modern_comforts * 0.08 + score_value * 0.07)
  )::numeric, 2) AS hhi
`

// Tier derived from HHI score
export function deriveTier(hhi: number): Tier {
  if (hhi >= 85) return 'landmark'
  if (hhi >= 70) return 'distinguished'
  if (hhi >= 55) return 'notable'
  return 'emerging'
}

// Pillar scores (0-100 scale)
export function derivePillarScores(row: Record<string, number>) {
  const ha = Math.round(
    ((row.score_historical_significance * 15 +
      row.score_architectural_integrity * 15 +
      row.score_cultural_immersion * 10) / 40) * 10
  ) / 10

  const ge = Math.round(
    ((row.score_authentic_experience * 15 +
      row.score_reputation * 12 +
      row.score_service_quality * 8) / 35) * 10
  ) / 10

  const oe = Math.round(
    ((row.score_conservation * 10 +
      row.score_modern_comforts * 8 +
      row.score_value * 7) / 25) * 10
  ) / 10

  return { ha, ge, oe }
}

// Transform a flat DB row into the Hotel interface shape
export function transformHotel(row: Record<string, unknown>): Hotel {
  const hhi = Number(row.hhi)
  const pillarScores = derivePillarScores(row as Record<string, number>)

  return {
    id: row.id as string,
    slug: row.slug as string,
    name: row.name as string,
    country: row.country_code as Hotel['country'],
    city: row.city as string,
    yearBuilt: row.year_built as number,
    originalPurpose: row.original_purpose as string,
    architecturalStyle: row.architectural_style as string,
    tagline: (row.tagline as string | null) ?? '',
    description: row.description as string,
    highlights: row.highlights as string[],
    imageUrl: row.image_url as string,
    websiteUrl: row.website_url as string,
    priceRange: row.price_range as Hotel['priceRange'],
    scores: {
      heritageAuthenticity: {
        historicalSignificance: row.score_historical_significance as number,
        architecturalIntegrity: row.score_architectural_integrity as number,
        culturalImmersion: row.score_cultural_immersion as number,
      },
      guestExperience: {
        authenticExperience: row.score_authentic_experience as number,
        reputationScore: row.score_reputation as number,
        serviceQuality: row.score_service_quality as number,
      },
      operationalExcellence: {
        conservationCommitment: row.score_conservation as number,
        modernComforts: row.score_modern_comforts as number,
        valuePositioning: row.score_value as number,
      },
    },
    hhi,
    tier: deriveTier(hhi),
    pillarScores,
    timeline: (row.timeline as Array<{ year: number; event: string }>) ?? [],
  }
}

// Fetch all hotels with HHI scores, sorted by HHI descending
export async function fetchAllHotels(connectionString: string): Promise<Hotel[]> {
  const sql = neon(connectionString)
  const rows = await sql.query(`
    WITH scored AS (
      SELECT
        id, slug, name, country_code, city, year_built, original_purpose,
        architectural_style, tagline, description, highlights, image_url, website_url,
        price_range,
        score_historical_significance, score_architectural_integrity, score_cultural_immersion,
        score_authentic_experience, score_reputation, score_service_quality,
        score_conservation, score_modern_comforts, score_value,
        ${HHI_SQL}
      FROM hotels
    )
    SELECT * FROM scored
    ORDER BY hhi DESC
  `)
  return rows.map(r => transformHotel(r as Record<string, unknown>))
}

// Fetch a single hotel by slug, including timeline events
export async function fetchHotelBySlug(connectionString: string, slug: string): Promise<Hotel | null> {
  const sql = neon(connectionString)
  const rows = await sql.query(`
    WITH scored AS (
      SELECT
        h.*,
        ${HHI_SQL},
        COALESCE(
          json_agg(
            json_build_object('year', te.year, 'event', te.event)
            ORDER BY te.year
          ) FILTER (WHERE te.id IS NOT NULL),
          '[]'
        ) AS timeline
      FROM hotels h
      LEFT JOIN timeline_events te ON te.hotel_id = h.id
      WHERE h.slug = $1
      GROUP BY h.id
    )
    SELECT * FROM scored
  `, [slug])
  if (rows.length === 0) return null
  return transformHotel(rows[0] as Record<string, unknown>)
}

// Fetch all hotel slugs (for prerender route generation)
export async function fetchHotelSlugs(connectionString: string): Promise<string[]> {
  const sql = neon(connectionString)
  const rows = await sql`SELECT slug FROM hotels ORDER BY slug`
  return rows.map(r => r.slug as string)
}
