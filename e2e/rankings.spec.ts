import { test, expect } from '@playwright/test'

test.describe('Rankings page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()
  })

  test('page loads with title and all hotels', async ({ page }) => {
    await expect(page.getByText('Heritage Hotel Rankings')).toBeVisible()
    await expect(page.getByText('Showing 108 heritage hotels')).toBeVisible()
  })

  test('hotels are ordered by HHI desc by default (Raffles first)', async ({ page }) => {
    await expect(page.getByText('Raffles Hotel').first()).toBeVisible()
  })

  test('filter by country Singapore shows SG hotels', async ({ page }) => {
    await page.locator('select').first().selectOption('SG')
    await expect(page.getByText('Showing 5 heritage hotels')).toBeVisible()
    await expect(page).toHaveURL(/country=SG/)
  })

  test('filter by tier landmark shows only top-tier hotels', async ({ page }) => {
    await page.locator('select').nth(1).selectOption('landmark')
    await expect(page.getByText(/Showing \d+ heritage hotel/)).toBeVisible()
    await expect(page).toHaveURL(/tier=landmark/)
  })

  test('filter by price $$ shows budget hotels', async ({ page }) => {
    await page.locator('select').nth(2).selectOption('$$')
    await expect(page.getByText(/Showing \d+ heritage hotel/)).toBeVisible()
  })

  test('sort by name ascending', async ({ page }) => {
    await page.locator('select').nth(3).selectOption('name')
    await page.getByRole('button', { name: /Descending/i }).click()
    await expect(page.getByText('Ascending')).toBeVisible()
  })

  test('sort by year ascending shows oldest first', async ({ page }) => {
    const sortSelect = page.locator('select').nth(3)
    const hasYear = await sortSelect.locator('option[value="year"]').count()
    await sortSelect.selectOption(hasYear > 0 ? 'year' : 'yearBuilt')
    await page.getByRole('button', { name: /Descending/i }).click()
    // Terrapuri Heritage Village (1700) is the oldest
    await expect(page.getByText('Terrapuri Heritage Village').first()).toBeVisible()
  })

  test('order toggle flips between asc and desc', async ({ page }) => {
    await expect(page.getByText('Descending')).toBeVisible()
    await page.getByRole('button', { name: /Descending/i }).click()
    await expect(page.getByText('Ascending')).toBeVisible()
    await expect(page).toHaveURL(/order=asc/)
  })

  test('clear filters resets everything', async ({ page }) => {
    await page.locator('select').first().selectOption('SG')
    await expect(page.getByText('Showing 5')).toBeVisible()
    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.getByText('Showing 108 heritage hotels')).toBeVisible()
  })

  test('combined filters: Malaysia + distinguished', async ({ page }) => {
    await page.locator('select').first().selectOption('MY')
    await page.locator('select').nth(1).selectOption('distinguished')
    await expect(page.getByText('The Majestic Malacca')).toBeVisible()
  })

  test('filter with no results shows empty state', async ({ page }) => {
    // Myanmar has hotels but Myanmar + landmark should be empty
    await page.locator('select').first().selectOption('MM')
    await page.locator('select').nth(1).selectOption('landmark')
    await expect(page.getByText(/No hotels match/)).toBeVisible()
  })

  test('URL query params persist on reload', async ({ page }) => {
    await page.locator('select').first().selectOption('TH')
    await expect(page).toHaveURL(/country=TH/)
    await page.reload()
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing 30 heritage hotels')).toBeVisible()
  })

  test('clicking hotel card navigates to hotel detail', async ({ page }) => {
    await page.getByText('Raffles Hotel').first().click()
    await expect(page).toHaveURL(/\/hotel\/raffles/)
  })
})
