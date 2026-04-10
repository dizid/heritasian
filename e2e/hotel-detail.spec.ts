import { test, expect } from '@playwright/test'

test.describe('Hotel detail page', () => {
  test('Raffles Hotel page loads with all sections', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    await expect(page.locator('h1')).toContainText('Raffles Hotel')
    await expect(page.getByText('Singapore').first()).toBeVisible()
    await expect(page.getByText('1887').first()).toBeVisible()
    // HHI score badge should show the overall score
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByText('Heritage Landmark').first()).toBeVisible()
  })

  test('HHI score badge and tier badge are visible', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    // HHI score is displayed prominently
    await expect(page.getByText('HHI').first()).toBeVisible()
    await expect(page.getByText('Heritage Landmark').first()).toBeVisible()
  })

  test('timeline events are rendered', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)
    await expect(page.getByText('History Timeline')).toBeVisible()
    await expect(page.getByText('National Monument').first()).toBeVisible()
  })

  test('highlights tags are visible', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)
    await expect(page.getByText('Highlights')).toBeVisible()
    await expect(page.getByText('National Monument of Singapore').first()).toBeVisible()
  })

  test('About the Property section shows description', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)
    await expect(page.getByText('About the Property')).toBeVisible()
    await expect(page.getByText('iconic Raffles Hotel')).toBeVisible()
  })

  test('Visit Official Website link has correct href and target', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)
    const link = page.getByRole('link', { name: /Visit Official Website/i })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('href', /raffles\.com/)
  })

  test('Back to Rankings link navigates correctly', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)
    await page.getByRole('link', { name: /Back to Rankings/i }).first().click()
    await expect(page).toHaveURL(/\/rankings/)
  })

  test('nonexistent hotel slug shows 404 state', async ({ page }) => {
    await page.goto('/hotel/this-hotel-does-not-exist')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/this-hotel') && resp.status() === 404)
    await expect(page.getByText('Hotel Not Found')).toBeVisible()
    await expect(page.getByRole('link', { name: /Back to Rankings/i })).toBeVisible()
  })

  test('different hotels load correctly (The Strand)', async ({ page }) => {
    await page.goto('/hotel/the-strand-yangon')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/the-strand') && resp.status() === 200)
    await expect(page.locator('h1')).toContainText('The Strand')
    await expect(page.getByText('Yangon').first()).toBeVisible()
    await expect(page.getByText('Heritage Distinguished').first()).toBeVisible()
  })

  test('emerging tier hotel displays correctly (The Henry)', async ({ page }) => {
    await page.goto('/hotel/the-henry-hotel-manila')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/the-henry') && resp.status() === 200)
    await expect(page.locator('h1')).toContainText('The Henry Hotel')
    await expect(page.getByText('Heritage Emerging').first()).toBeVisible()
  })
})
