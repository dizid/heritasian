import { test, expect } from '@playwright/test'

test.describe('Prerendered HTML content', () => {
  // These tests fetch raw HTML to verify SSR content is present.
  // They validate that prerendered pages have actual content (not just a shell).

  test('home page HTML has title and meta tags', async ({ request }) => {
    const res = await request.get('/')
    expect(res.status()).toBe(200)
    const html = await res.text()
    expect(html).toContain('Heritasian')
    expect(html).toContain('<title>')
  })

  test('home page HTML has structured data or app shell', async ({ request }) => {
    const res = await request.get('/')
    const html = await res.text()
    // After SSR deploy: contains Organization schema
    // Before SSR deploy: contains app shell with entry script
    const hasSchema = html.includes('Organization')
    const hasAppShell = html.includes('id="app"')
    expect(hasSchema || hasAppShell).toBe(true)
  })

  test('prerendered HTML has no SSR outlet marker leaking', async ({ request }) => {
    const res = await request.get('/')
    const html = await res.text()
    expect(html).not.toContain('<!--ssr-outlet-->')
  })

  test('prerendered HTML has exactly one charset meta', async ({ request }) => {
    const res = await request.get('/')
    const html = await res.text()
    const charsetCount = (html.match(/meta charset/gi) || []).length
    expect(charsetCount).toBe(1)
  })

  test('prerendered HTML has exactly one viewport meta', async ({ request }) => {
    const res = await request.get('/')
    const html = await res.text()
    const viewportCount = (html.match(/name="viewport"/gi) || []).length
    expect(viewportCount).toBe(1)
  })

  test('prerendered HTML has exactly one lang attribute', async ({ request }) => {
    const res = await request.get('/')
    const html = await res.text()
    const langCount = (html.match(/lang="en"/gi) || []).length
    expect(langCount).toBe(1)
  })

  test('hotel detail page returns 200', async ({ request }) => {
    const res = await request.get('/hotel/raffles-hotel-singapore')
    expect(res.status()).toBe(200)
    const html = await res.text()
    // Page should have a title and app container
    expect(html).toContain('<title>')
    expect(html).toContain('id="app"')
  })

  test('rankings page returns 200', async ({ request }) => {
    const res = await request.get('/rankings')
    expect(res.status()).toBe(200)
  })

  test('methodology page returns 200', async ({ request }) => {
    const res = await request.get('/methodology')
    expect(res.status()).toBe(200)
  })
})

test.describe('Client-side hydration', () => {
  test('home page loads and becomes interactive', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Raffles Hotel').first()).toBeVisible()
    // Proves hydration works — can click links
    await page.getByRole('link', { name: 'View Rankings' }).first().click()
    await expect(page).toHaveURL(/\/rankings/)
  })

  test('client-side navigation works after page load', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    await page.getByText('Raffles Hotel').first().click()
    await expect(page).toHaveURL(/\/hotel\/raffles/)
    await expect(page.locator('h1')).toContainText('Raffles Hotel')

    await page.goBack()
    await expect(page).toHaveURL(/\/rankings/)
  })

  test('browser back/forward navigation works', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    // Navigate via header nav (use first match which is the header link)
    await page.locator('header').getByRole('link', { name: 'Rankings' }).click()
    await expect(page).toHaveURL(/\/rankings/)

    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/')

    // Go forward
    await page.goForward()
    await expect(page).toHaveURL(/\/rankings/)
  })
})
