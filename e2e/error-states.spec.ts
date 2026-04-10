import { test, expect } from '@playwright/test'

test.describe('Error states', () => {
  test('hotel 404 shows error page with navigation', async ({ page }) => {
    await page.goto('/hotel/this-hotel-definitely-does-not-exist-anywhere')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/') && resp.status() === 404)

    await expect(page.getByText('Hotel Not Found')).toBeVisible()
    await expect(page.getByText(/doesn.t exist in our index/)).toBeVisible()
    const backLink = page.getByRole('link', { name: /Back to Rankings/i })
    await expect(backLink).toBeVisible()
    await backLink.click()
    await expect(page).toHaveURL(/\/rankings/)
  })

  test('API failure on home page shows graceful degradation', async ({ page }) => {
    await page.route('**/api/hotels', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal server error' }),
    }))

    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
    await expect(page.getByText('Heritasian').first()).toBeVisible()
  })

  test('API failure on rankings page does not crash', async ({ page }) => {
    await page.route('**/api/hotels', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal server error' }),
    }))

    await page.goto('/rankings')
    await expect(page.locator('header')).toBeVisible()
  })

  test('network abort on hotel page does not crash', async ({ page }) => {
    await page.route('**/api/hotels/nonexistent*', route => route.abort())
    await page.goto('/hotel/nonexistent-slow-hotel')
    await expect(page.locator('header')).toBeVisible()
  })
})

test.describe('Edge cases — rankings filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()
  })

  test('triple filter narrows results', async ({ page }) => {
    await page.locator('select').first().selectOption('SG')
    await page.locator('select').nth(1).selectOption('landmark')
    const hasResults = await page.getByText(/Showing \d+ heritage hotel/).isVisible().catch(() => false)
    const hasEmpty = await page.getByText('No hotels match').isVisible().catch(() => false)
    expect(hasResults || hasEmpty).toBeTruthy()
  })

  test('sort by each pillar score works', async ({ page }) => {
    for (const sortValue of ['ha', 'ge', 'oe']) {
      await page.locator('select').nth(3).selectOption(sortValue)
      await expect(page.getByText(/Showing \d+ heritage hotel/)).toBeVisible()
    }
  })

  test('clear filters after multiple filters resets to default', async ({ page }) => {
    await page.locator('select').first().selectOption('MY')
    await page.locator('select').nth(3).selectOption('name')
    await page.getByRole('button', { name: /Descending/i }).click()

    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.getByText('Showing 108 heritage hotels')).toBeVisible()
  })

  test('direct URL with filters loads correctly', async ({ page }) => {
    await page.goto('/rankings?country=SG&sort=name&order=asc')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing 5 heritage hotels')).toBeVisible()
    await expect(page.getByText('Ascending')).toBeVisible()
  })
})
