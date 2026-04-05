#!/usr/bin/env node
/**
 * Fetch hotel OG images from their websites, resize, and save locally.
 * Usage: node scripts/fetch-hotel-images.js [slug1 slug2 ...]
 *   If no slugs provided, processes all hotels.
 */
import { neon } from '@neondatabase/serverless'
import sharp from 'sharp'
import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = resolve(__dirname, '../public/images/hotels')
const WIDTH = 800
const HEIGHT = 500
const QUALITY = 80

// Ensure output directory exists
if (!existsSync(IMAGES_DIR)) mkdirSync(IMAGES_DIR, { recursive: true })

// Load DATABASE_URL from .env.local
const envPath = resolve(__dirname, '../.env.local')
let DATABASE_URL = process.env.DATABASE_URL
if (!DATABASE_URL) {
  try {
    const envContent = (await import('fs')).readFileSync(envPath, 'utf8')
    const match = envContent.match(/DATABASE_URL=(.+)/)
    if (match) DATABASE_URL = match[1].trim()
  } catch {}
}
if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in env or .env.local')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

// Fetch with timeout and proper headers
async function fetchWithTimeout(url, timeoutMs = 15000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; HeritasianBot/1.0)',
        'Accept': 'text/html,image/*,*/*',
      },
      redirect: 'follow',
    })
    clearTimeout(timer)
    return res
  } catch (e) {
    clearTimeout(timer)
    throw e
  }
}

// Extract OG image URL from HTML
function extractOgImage(html, baseUrl) {
  // Try og:image first
  const ogMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
  if (ogMatch) return resolveUrl(ogMatch[1], baseUrl)

  // Try twitter:image
  const twMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i)
  if (twMatch) return resolveUrl(twMatch[1], baseUrl)

  // Try first large image in hero/banner area
  const imgMatch = html.match(/<img[^>]*src=["']([^"']+\.(jpg|jpeg|png|webp)(\?[^"']*)?)["'][^>]*/i)
  if (imgMatch) return resolveUrl(imgMatch[1], baseUrl)

  return null
}

function resolveUrl(url, base) {
  if (!url) return null
  if (url.startsWith('//')) return 'https:' + url
  if (url.startsWith('http')) return url
  try {
    return new URL(url, base).href
  } catch {
    return null
  }
}

// Download image and resize with sharp
async function downloadAndResize(imageUrl, outputPath) {
  const res = await fetchWithTimeout(imageUrl)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())

  await sharp(buffer)
    .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'center' })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outputPath)
}

// Main
async function main() {
  const slugFilter = process.argv.slice(2)

  const hotels = await sql`SELECT slug, name, website_url FROM hotels ORDER BY name`

  const filtered = slugFilter.length > 0
    ? hotels.filter(h => slugFilter.includes(h.slug))
    : hotels

  console.log(`Processing ${filtered.length} hotels...`)

  let success = 0, failed = 0, skipped = 0

  for (const hotel of filtered) {
    const outputPath = resolve(IMAGES_DIR, `${hotel.slug}.jpg`)

    // Skip if image already exists
    if (existsSync(outputPath)) {
      console.log(`  [skip] ${hotel.name} — already exists`)
      skipped++
      continue
    }

    const url = hotel.website_url
    if (!url || url === '') {
      console.log(`  [skip] ${hotel.name} — no website URL`)
      skipped++
      continue
    }

    try {
      // Fetch the hotel website page
      const pageRes = await fetchWithTimeout(url)
      if (!pageRes.ok) throw new Error(`Page HTTP ${pageRes.status}`)
      const html = await pageRes.text()

      // Extract OG image
      const imageUrl = extractOgImage(html, url)
      if (!imageUrl) throw new Error('No OG image found')

      // Download and resize
      await downloadAndResize(imageUrl, outputPath)
      console.log(`  [ok] ${hotel.name} — ${imageUrl.substring(0, 80)}...`)
      success++
    } catch (e) {
      console.log(`  [fail] ${hotel.name} — ${e.message}`)
      failed++
    }
  }

  console.log(`\nDone: ${success} ok, ${failed} failed, ${skipped} skipped`)
}

main().catch(e => { console.error(e); process.exit(1) })
