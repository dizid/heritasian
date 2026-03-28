import { test, expect } from '@playwright/test'

test.describe('SEO meta tags', () => {
  test('home page has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Heritasian/)
  })

  test('home page has description meta', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    const desc = await page.evaluate(() => document.querySelector('meta[name="description"]')?.getAttribute('content'))
    expect(desc).toBeTruthy()
    expect(desc).toContain('heritage hotel')
  })

  test('home page has Open Graph tags', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    const ogTitle = await page.evaluate(() => document.querySelector('meta[property="og:title"]')?.getAttribute('content'))
    const ogImage = await page.evaluate(() => document.querySelector('meta[property="og:image"]')?.getAttribute('content'))
    expect(ogTitle).toContain('Heritasian')
    expect(ogImage).toBeTruthy()
  })

  test('home page has Twitter Card tags', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    // Wait for @unhead/vue to inject meta
    await page.waitForTimeout(500)

    const card = await page.evaluate(() => document.querySelector('meta[name="twitter:card"]')?.getAttribute('content'))
    expect(card).toBe('summary_large_image')
  })

  test('home page has canonical URL', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await page.waitForTimeout(500)

    const canonical = await page.evaluate(() => document.querySelector('link[rel="canonical"]')?.getAttribute('href'))
    expect(canonical).toBeTruthy()
  })

  test('rankings page has correct title', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page).toHaveTitle(/Rankings|Heritasian/)
  })

  test('methodology page has correct title', async ({ page }) => {
    await page.goto('/methodology')
    await expect(page).toHaveTitle(/Methodology|Heritasian/)
  })

  test('hotel detail page has dynamic title', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)
    // Wait for @unhead/vue to update the title after data loads
    await page.waitForTimeout(1000)
    await expect(page).toHaveTitle(/Raffles Hotel|Heritasian/)
  })

  test('hotel detail page has dynamic description', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    const desc = await page.evaluate(() => document.querySelector('meta[name="description"]')?.getAttribute('content'))
    expect(desc).toContain('Raffles Hotel')
  })
})

test.describe('Structured data (JSON-LD)', () => {
  test('home page has Organization schema', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    const scripts = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent)
    )
    const orgSchema = scripts.find(s => s?.includes('"Organization"'))
    expect(orgSchema).toBeTruthy()
    const parsed = JSON.parse(orgSchema!)
    expect(parsed.name).toBe('Heritasian')
  })

  test('home page has BreadcrumbList schema', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    const scripts = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent)
    )
    expect(scripts.find(s => s?.includes('"BreadcrumbList"'))).toBeTruthy()
  })

  test('hotel page has LodgingBusiness schema without aggregateRating', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    const scripts = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent)
    )
    const hotelSchema = scripts.find(s => s?.includes('"LodgingBusiness"'))
    expect(hotelSchema).toBeTruthy()
    const parsed = JSON.parse(hotelSchema!)
    expect(parsed.name).toBe('Raffles Hotel')
    expect(parsed.foundingDate).toBe('1887')
    expect(parsed.aggregateRating).toBeUndefined()
  })

  test('hotel page has 3-level BreadcrumbList', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    const scripts = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent)
    )
    const bcSchema = scripts.find(s => s?.includes('"BreadcrumbList"'))
    expect(bcSchema).toBeTruthy()
    const parsed = JSON.parse(bcSchema!)
    expect(parsed.itemListElement.length).toBe(3)
  })

  test('rankings page has ItemList schema', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    const scripts = await page.evaluate(() =>
      Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent)
    )
    const listSchema = scripts.find(s => s?.includes('"ItemList"'))
    expect(listSchema).toBeTruthy()
    const parsed = JSON.parse(listSchema!)
    expect(parsed.itemListElement.length).toBeGreaterThanOrEqual(10)
  })
})

test.describe('Sitemap and robots.txt', () => {
  test('robots.txt is accessible', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('User-agent')
    expect(body).toContain('Sitemap')
  })

  test('sitemap.xml is accessible and valid', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const body = await res.text()
    expect(body).toContain('<?xml')
    expect(body).toContain('<url>')
  })

  test('sitemap contains hotel URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    const body = await res.text()
    expect(body).toContain('/hotel/')
  })

  test('sitemap has lastmod entries', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    const body = await res.text()
    expect(body).toContain('<lastmod>')
  })
})
