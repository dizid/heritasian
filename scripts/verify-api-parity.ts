/**
 * Golden-master API parity verification script.
 *
 * Usage:
 *   npx tsx scripts/verify-api-parity.ts capture [baseUrl]
 *   npx tsx scripts/verify-api-parity.ts verify  [baseUrl]
 *
 * capture: Fetches all API responses and writes tests/fixtures/api-parity-golden.json
 * verify:  Fetches the same endpoints and compares to the golden file
 *
 * baseUrl defaults to https://heritasian.netlify.app
 *
 * Exit codes: 0 = pass, 1 = parity violations, 2 = script error
 */

const BASE_URL_DEFAULT = 'https://heritasian.netlify.app'

interface GoldenEntry {
  url: string
  body: unknown
}

interface GoldenFile {
  capturedAt: string
  baseUrl: string
  entries: GoldenEntry[]
}

// Stable JSON stringify: sort object keys recursively, preserve array order
function stableStringify(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return Object.keys(value).sort().reduce((sorted: Record<string, unknown>, k) => {
        sorted[k] = value[k]
        return sorted
      }, {})
    }
    return value
  }, 2)
}

// Build the query matrix — curated representative set
function buildQueryMatrix(): string[] {
  const urls: string[] = []

  // Unfiltered sorts (all 6 sort options × 2 orders = 12)
  const sorts = ['hhi', 'ha', 'ge', 'oe', 'name', 'year']
  const orders = ['asc', 'desc']
  for (const sort of sorts) {
    for (const order of orders) {
      urls.push(`/api/hotels?sort=${sort}&order=${order}`)
    }
  }

  // Each tier individually with default sort (4)
  const tiers = ['landmark', 'distinguished', 'notable', 'emerging']
  for (const tier of tiers) {
    urls.push(`/api/hotels?tier=${tier}`)
  }

  // Multi-tier (2)
  urls.push('/api/hotels?tier=landmark,distinguished')
  urls.push('/api/hotels?tier=landmark,distinguished,notable,emerging')

  // Each country individually with default sort (9)
  const countries = ['TH', 'VN', 'KH', 'MM', 'MY', 'SG', 'ID', 'PH', 'LA']
  for (const country of countries) {
    urls.push(`/api/hotels?country=${country}`)
  }

  // Multi-country (1)
  urls.push('/api/hotels?country=TH,VN,KH')

  // Each price individually (4)
  const prices = ['$', '$$', '$$$', '$$$$']
  for (const price of prices) {
    urls.push(`/api/hotels?price=${encodeURIComponent(price)}`)
  }

  // Multi-price (1)
  urls.push(`/api/hotels?price=${encodeURIComponent('$$')},${encodeURIComponent('$$$')}`)

  // Cross-filter combos: tier × sort × country (representative sample)
  urls.push('/api/hotels?tier=landmark&sort=ha&order=desc')
  urls.push('/api/hotels?tier=distinguished&sort=ge&order=asc')
  urls.push('/api/hotels?tier=notable&sort=oe&order=desc')
  urls.push('/api/hotels?country=TH&tier=landmark')
  urls.push('/api/hotels?country=VN,KH&sort=year&order=asc')
  urls.push(`/api/hotels?country=MY&price=${encodeURIComponent('$$$')}&sort=hhi`)
  urls.push(`/api/hotels?tier=landmark,distinguished&price=${encodeURIComponent('$$$$')}&sort=name&order=asc`)

  return urls
}

// Stabilize array ordering for list responses. When two hotels share the same
// sort-key value (e.g. same year_built), Postgres may return them in any order.
// We sub-sort ties by slug so the comparison is deterministic.
function stabilizeOrder(data: unknown, url: string): unknown {
  if (!Array.isArray(data) || data.length === 0 || !data[0]?.slug) return data

  // Parse sort key from URL query params
  const params = new URLSearchParams(url.split('?')[1] ?? '')
  const sort = params.get('sort') ?? 'hhi'
  const order = (params.get('order') ?? 'desc').toLowerCase()

  const sortKeyMap: Record<string, string> = {
    hhi: 'hhi', ha: 'pillarScores', ge: 'pillarScores', oe: 'pillarScores',
    name: 'name', year: 'yearBuilt',
  }
  const key = sortKeyMap[sort] ?? 'hhi'

  const getSortValue = (item: Record<string, unknown>): number | string => {
    if (key === 'pillarScores') {
      const ps = item.pillarScores as Record<string, number>
      return ps?.[sort] ?? 0
    }
    return item[key] as number | string
  }

  return [...data].sort((a, b) => {
    const av = getSortValue(a)
    const bv = getSortValue(b)
    let cmp = 0
    if (typeof av === 'number' && typeof bv === 'number') {
      cmp = order === 'asc' ? av - bv : bv - av
    } else {
      cmp = order === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    }
    // Tie-break by slug for deterministic order
    if (cmp === 0) return String(a.slug).localeCompare(String(b.slug))
    return cmp
  })
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}: ${await res.text()}`)
  }
  const contentType = res.headers.get('content-type') ?? ''
  if (contentType.includes('xml')) {
    return await res.text()
  }
  return await res.json()
}

async function capture(baseUrl: string): Promise<void> {
  const fs = await import('node:fs')
  const path = await import('node:path')

  console.log(`Capturing golden master from ${baseUrl}...`)

  // First, get the full hotel list to discover all slugs
  const allHotels = await fetchJson(`${baseUrl}/api/hotels?sort=hhi&order=desc`) as Array<{ slug: string }>
  console.log(`Found ${allHotels.length} hotels`)

  const queryUrls = buildQueryMatrix()

  // Add individual hotel slug URLs
  const slugUrls = allHotels.map(h => `/api/hotels/${h.slug}`)

  // Add sitemap
  const allUrls = [...queryUrls, ...slugUrls, '/api/sitemap.xml']

  console.log(`Fetching ${allUrls.length} endpoints...`)

  const entries: GoldenEntry[] = []
  let done = 0

  // Fetch in batches of 10 to be polite to the API
  const batchSize = 10
  for (let i = 0; i < allUrls.length; i += batchSize) {
    const batch = allUrls.slice(i, i + batchSize)
    const results = await Promise.all(
      batch.map(async (url) => {
        const body = await fetchJson(`${baseUrl}${url}`)
        return { url, body: stabilizeOrder(body, url) }
      })
    )
    entries.push(...results)
    done += results.length
    process.stdout.write(`\r  ${done}/${allUrls.length} endpoints fetched`)
  }
  console.log('')

  const golden: GoldenFile = {
    capturedAt: new Date().toISOString(),
    baseUrl,
    entries,
  }

  const outPath = path.join(process.cwd(), 'tests', 'fixtures', 'api-parity-golden.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, stableStringify(golden) + '\n')
  console.log(`Golden master written to ${outPath}`)
  console.log(`  ${entries.length} entries, ${(fs.statSync(outPath).size / 1024).toFixed(0)} KB`)
}

function firstDiff(a: string, b: string): string {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      const start = Math.max(0, i - 40)
      const end = Math.min(a.length, i + 40)
      return `Position ${i}:\n  golden: ...${a.slice(start, end)}...\n  actual: ...${b.slice(start, end)}...`
    }
  }
  if (a.length !== b.length) {
    return `Length mismatch: golden=${a.length}, actual=${b.length}`
  }
  return 'No diff found'
}

async function verify(baseUrl: string): Promise<void> {
  const fs = await import('node:fs')
  const path = await import('node:path')

  const goldenPath = path.join(process.cwd(), 'tests', 'fixtures', 'api-parity-golden.json')
  if (!fs.existsSync(goldenPath)) {
    console.error(`Golden master not found at ${goldenPath}`)
    console.error('Run "npx tsx scripts/verify-api-parity.ts capture" first')
    process.exit(2)
  }

  const golden: GoldenFile = JSON.parse(fs.readFileSync(goldenPath, 'utf-8'))
  console.log(`Verifying ${golden.entries.length} endpoints against ${baseUrl}`)
  console.log(`Golden captured at: ${golden.capturedAt} from ${golden.baseUrl}`)

  const failures: Array<{ url: string; diff: string }> = []
  let passed = 0
  let done = 0

  const batchSize = 10
  for (let i = 0; i < golden.entries.length; i += batchSize) {
    const batch = golden.entries.slice(i, i + batchSize)
    await Promise.all(
      batch.map(async (entry) => {
        try {
          const raw = await fetchJson(`${baseUrl}${entry.url}`)
          const actual = stabilizeOrder(raw, entry.url)
          const goldenStr = stableStringify(entry.body)
          const actualStr = stableStringify(actual)
          if (goldenStr !== actualStr) {
            failures.push({ url: entry.url, diff: firstDiff(goldenStr, actualStr) })
          } else {
            passed++
          }
        } catch (e) {
          failures.push({
            url: entry.url,
            diff: `Fetch error: ${e instanceof Error ? e.message : String(e)}`,
          })
        }
        done++
        process.stdout.write(`\r  ${done}/${golden.entries.length} verified`)
      })
    )
  }
  console.log('')

  if (failures.length === 0) {
    console.log(`\nPARITY PASSED: ${passed}/${golden.entries.length} endpoints match`)
    process.exit(0)
  } else {
    console.log(`\nPARITY FAILED: ${failures.length} mismatches out of ${golden.entries.length}`)
    for (const f of failures.slice(0, 20)) {
      console.log(`\n  ${f.url}`)
      console.log(`  ${f.diff}`)
    }
    if (failures.length > 20) {
      console.log(`\n  ... and ${failures.length - 20} more`)
    }
    process.exit(1)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const mode = args[0]
  const baseUrl = (args[1] ?? BASE_URL_DEFAULT).replace(/\/$/, '')

  if (mode === 'capture') {
    await capture(baseUrl)
  } else if (mode === 'verify') {
    await verify(baseUrl)
  } else {
    console.error('Usage: npx tsx scripts/verify-api-parity.ts <capture|verify> [baseUrl]')
    process.exit(2)
  }
}

main().catch((e) => {
  console.error('Script error:', e)
  process.exit(2)
})
