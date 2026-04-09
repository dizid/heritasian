import { neon } from '@neondatabase/serverless'
import type { Hotel } from '../types'
import { getTier } from '../lib/scoring'

// Transform a flat DB row into the Hotel interface shape.
// HHI and pillar scores come from Postgres generated columns — no math here.
export function transformHotel(row: Record<string, unknown>): Hotel {
  const hhi = Number(row.hhi)

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
    tier: getTier(hhi),
    pillarScores: {
      ha: Number(row.pillar_ha),
      ge: Number(row.pillar_ge),
      oe: Number(row.pillar_oe),
    },
    timeline: (row.timeline as Array<{ year: number; event: string }>) ?? [],
  }
}

// Fetch all hotels with HHI scores, sorted by HHI descending
export async function fetchAllHotels(connectionString: string): Promise<Hotel[]> {
  const sql = neon(connectionString)
  const rows = await sql.query(`
    SELECT
      id, slug, name, country_code, city, year_built, original_purpose,
      architectural_style, tagline, description, highlights, image_url, website_url,
      price_range,
      score_historical_significance, score_architectural_integrity, score_cultural_immersion,
      score_authentic_experience, score_reputation, score_service_quality,
      score_conservation, score_modern_comforts, score_value,
      hhi, pillar_ha, pillar_ge, pillar_oe
    FROM hotels
    ORDER BY hhi DESC
  `)
  return rows.map(r => transformHotel(r as Record<string, unknown>))
}

// Fetch a single hotel by slug, including timeline events
export async function fetchHotelBySlug(connectionString: string, slug: string): Promise<Hotel | null> {
  const sql = neon(connectionString)
  const rows = await sql.query(`
    SELECT
      h.*,
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
