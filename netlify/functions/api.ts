import { neon } from '@neondatabase/serverless'
import type { Handler, HandlerEvent, HandlerResponse } from '@netlify/functions'
import { transformHotel } from '../../src/data/db'
import { TIER_BOUNDS } from '../../src/lib/scoring'

// CORS headers for local dev and production
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
}

function ok(body: unknown): HandlerResponse {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  }
}

function err(statusCode: number, message: string): HandlerResponse {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: message }),
  }
}

// Map sort param to actual SQL column name.
// Pillar scores are now generated columns — no more inline SQL formulas.
const SORT_COLUMNS: Record<string, string> = {
  hhi: 'hhi',
  ha: 'pillar_ha',
  ge: 'pillar_ge',
  oe: 'pillar_oe',
  name: 'name',
  year: 'year_built',
}

async function handleGetHotels(sql: ReturnType<typeof neon>, params: URLSearchParams): Promise<HandlerResponse> {
  const countryParam = params.get('country')
  const tierParam = params.get('tier')
  const priceParam = params.get('price')
  const sort = params.get('sort') ?? 'hhi'
  const order = (params.get('order') ?? 'desc').toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

  const countries = countryParam ? countryParam.split(',').map(c => c.trim().toUpperCase()) : []
  const tiers = tierParam ? tierParam.split(',').map(t => t.trim().toLowerCase()) : []
  const prices = priceParam ? priceParam.split(',').map(p => p.trim()) : []

  // Build WHERE clauses
  const conditions: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (countries.length > 0) {
    conditions.push(`country_code = ANY($${paramIndex}::text[])`)
    values.push(countries)
    paramIndex++
  }

  if (prices.length > 0) {
    conditions.push(`price_range = ANY($${paramIndex}::text[])`)
    values.push(prices)
    paramIndex++
  }

  // Tier filter: translate tier names to HHI ranges using the generated hhi column
  if (tiers.length > 0) {
    const tierConditions = tiers
      .filter(t => t in TIER_BOUNDS)
      .map(t => {
        const { min, max } = TIER_BOUNDS[t as keyof typeof TIER_BOUNDS]
        return `(hhi BETWEEN ${min} AND ${max})`
      })
    if (tierConditions.length > 0) {
      conditions.push(`(${tierConditions.join(' OR ')})`)
    }
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const sortColumn = SORT_COLUMNS[sort] ?? 'hhi'

  const query = `
    SELECT
      id, slug, name, country_code, city, year_built, original_purpose,
      architectural_style, tagline, description, highlights, image_url, website_url,
      price_range,
      score_historical_significance, score_architectural_integrity, score_cultural_immersion,
      score_authentic_experience, score_reputation, score_service_quality,
      score_conservation, score_modern_comforts, score_value,
      hhi, pillar_ha, pillar_ge, pillar_oe
    FROM hotels
    ${whereClause}
    ORDER BY ${sortColumn} ${order}
  `

  const rows = await sql.query(query, values)
  return ok(rows.map(transformHotel))
}

async function handleGetHotelBySlug(sql: ReturnType<typeof neon>, slug: string): Promise<HandlerResponse> {
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

  if (rows.length === 0) {
    return err(404, 'Hotel not found')
  }

  return ok(transformHotel(rows[0] as Record<string, unknown>))
}

async function handleSitemap(sql: ReturnType<typeof neon>): Promise<HandlerResponse> {
  const baseUrl = process.env.URL || process.env.DEPLOY_URL || 'https://heritasian.netlify.app'
  const today = new Date().toISOString().split('T')[0]

  // Get all hotel slugs
  let hotelSlugs: string[] = []
  try {
    const rows = await sql`SELECT slug FROM hotels ORDER BY slug`
    hotelSlugs = rows.filter(r => r?.slug).map((r: Record<string, unknown>) => String(r.slug))
  } catch (e) {
    console.warn('[sitemap] Failed to fetch hotel slugs:', e instanceof Error ? e.message : e)
  }

  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/hotels', priority: '0.85', changefreq: 'weekly' },
    { loc: '/rankings', priority: '0.9', changefreq: 'weekly' },
    { loc: '/methodology', priority: '0.6', changefreq: 'monthly' },
  ]

  const hotelPages = hotelSlugs.map(slug => ({
    loc: `/hotel/${slug}`,
    priority: '0.8',
    changefreq: 'weekly' as const,
  }))

  const urls = [...staticPages, ...hotelPages]
    .map(p => `  <url>\n    <loc>${baseUrl}${p.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`

  return {
    statusCode: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/xml' },
    body: xml,
  }
}

export const handler: Handler = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return err(405, 'Method not allowed')
  }

  if (!process.env.DATABASE_URL) {
    return err(500, 'DATABASE_URL is not configured')
  }

  const sql = neon(process.env.DATABASE_URL)

  // Parse path: /.netlify/functions/api or /api (via redirect) + optional /hotels or /hotels/:slug
  const rawPath = event.path ?? ''
  // Strip the function prefix so we can match /hotels or /hotels/:slug
  const path = rawPath
    .replace(/^\/.netlify\/functions\/api/, '')
    .replace(/^\/api/, '')
    .replace(/\/$/, '') // strip trailing slash

  const params = new URLSearchParams(event.rawQuery ?? '')

  try {
    if (path === '/hotels' || path === '') {
      return await handleGetHotels(sql, params)
    }

    const slugMatch = path.match(/^\/hotels\/([^/]+)$/)
    if (slugMatch) {
      return await handleGetHotelBySlug(sql, slugMatch[1])
    }

    if (path === '/sitemap.xml') {
      return await handleSitemap(sql)
    }

    return err(404, 'Route not found')
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Internal server error'
    console.error('[api] Error:', message, e)
    return err(500, message)
  }
}
