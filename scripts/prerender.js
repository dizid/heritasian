/**
 * Prerender script — runs after Vite client + SSR builds.
 * Generates static HTML files for all routes so search engines can index content.
 *
 * Usage: node scripts/prerender.js
 * Requires: DATABASE_URL env var (reads from .env if present)
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const distDir = path.resolve(root, 'dist')

// Load .env file if present (for local builds)
const envPath = path.resolve(root, '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIdx = trimmed.indexOf('=')
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

async function prerender() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('[prerender] DATABASE_URL not set — skipping prerender')
    process.exit(0) // Don't fail the build
  }

  // Import the SSR entry module (built by Vite)
  const { render } = await import(path.resolve(distDir, 'server', 'entry-server.js'))

  // Read the client-built HTML template
  const template = fs.readFileSync(path.resolve(distDir, 'index.html'), 'utf-8')

  // Fetch hotel slugs from DB for dynamic routes
  const { neon } = await import('@neondatabase/serverless')
  const sql = neon(connectionString)
  let slugs = []
  try {
    const rows = await sql`SELECT slug FROM hotels ORDER BY slug`
    slugs = rows.map(r => r.slug)
  } catch (e) {
    console.warn('[prerender] Failed to fetch hotel slugs:', e.message)
  }

  // Build the full route list
  const routes = [
    '/',
    '/rankings',
    '/methodology',
    ...slugs.map(s => `/hotel/${s}`),
  ]

  console.log(`[prerender] Generating ${routes.length} pages...`)

  let success = 0
  let failed = 0

  for (const route of routes) {
    try {
      const { html: appHtml, head } = await render(route)

      // Inject SSR content into the template
      let page = template
        .replace('<!--ssr-outlet-->', appHtml)

      // Inject head tags before </head>
      if (head.headTags) {
        page = page.replace('</head>', `${head.headTags}\n</head>`)
      }

      // Inject html attributes (replace entire tag to avoid duplicate lang="en")
      if (head.htmlAttrs) {
        page = page.replace(/<html[^>]*>/, `<html ${head.htmlAttrs}>`)
      }

      // Append body attributes to existing body tag (preserve original classes)
      if (head.bodyAttrs) {
        page = page.replace(/<body([^>]*)>/, (_, existing) => `<body${existing} ${head.bodyAttrs}>`)
      }

      // Inject body tags before </body>
      if (head.bodyTags) {
        page = page.replace('</body>', `${head.bodyTags}\n</body>`)
      }

      // Inject body tags right after <body>
      if (head.bodyTagsOpen) {
        page = page.replace(/<body[^>]*>/, (match) => `${match}\n${head.bodyTagsOpen}`)
      }

      // Write the file
      const filePath = route === '/'
        ? path.resolve(distDir, 'index.html')
        : path.resolve(distDir, route.slice(1), 'index.html')

      fs.mkdirSync(path.dirname(filePath), { recursive: true })
      fs.writeFileSync(filePath, page)

      success++
      console.log(`  [ok] ${route}`)
    } catch (e) {
      failed++
      console.error(`  [fail] ${route}: ${e.message}`)
    }
  }

  console.log(`[prerender] Done: ${success} ok, ${failed} failed`)

  if (failed > 0) {
    process.exit(1)
  }
}

prerender()
