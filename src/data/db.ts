import { neon } from '@neondatabase/serverless'
import type { Hotel, ScoreDimension } from '../types'
import { getTier } from '../lib/scoring'

// Group flat evidence rows by dimension
function groupEvidence(raw: unknown[]): Hotel['evidence'] {
  const result: Hotel['evidence'] = {}
  if (!Array.isArray(raw)) return result
  for (const item of raw as Array<{ dimension: string; sourceUrl: string | null; excerpt: string | null; notes: string | null; ratingRationale: string | null }>) {
    const dim = item.dimension as ScoreDimension
    if (!result[dim]) result[dim] = []
    result[dim]!.push({
      sourceUrl: item.sourceUrl,
      excerpt: item.excerpt,
      notes: item.notes,
      ratingRationale: item.ratingRationale,
    })
  }
  return result
}

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
    evidence: groupEvidence((row.evidence as unknown[]) ?? []),
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

// Fetch a single hotel by slug, including timeline events and evidence
export async function fetchHotelBySlug(connectionString: string, slug: string): Promise<Hotel | null> {
  const sql = neon(connectionString)
  const rows = await sql.query(`
    SELECT
      h.*,
      (SELECT COALESCE(json_agg(
          json_build_object('year', te.year, 'event', te.event) ORDER BY te.year
        ), '[]')
       FROM timeline_events te WHERE te.hotel_id = h.id
      ) AS timeline,
      (SELECT COALESCE(json_agg(
          json_build_object(
            'dimension', se.dimension,
            'sourceUrl', se.source_url,
            'excerpt', se.excerpt,
            'notes', se.notes,
            'ratingRationale', se.rating_rationale
          )
        ), '[]')
       FROM score_evidence se WHERE se.hotel_id = h.id
      ) AS evidence
    FROM hotels h
    WHERE h.slug = $1
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
