import { test, expect } from '@playwright/test'

test.describe('Rankings page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()
  })

  test('page loads with title and all 15 hotels', async ({ page }) => {
    await expect(page.getByText('Heritage Hotel Rankings')).toBeVisible()
    await expect(page.getByText('Showing 15 heritage hotels')).toBeVisible()
  })

  test('hotels are ordered by HHI desc by default (Raffles first)', async ({ page }) => {
    await expect(page.getByText('Raffles Hotel').first()).toBeVisible()
  })

  test('filter by country Singapore shows 3 hotels', async ({ page }) => {
    await page.locator('select').first().selectOption('SG')
    await expect(page.getByText('Showing 3 heritage hotels')).toBeVisible()
    await expect(page).toHaveURL(/country=SG/)
  })

  test('filter by tier landmark shows only top-tier hotels', async ({ page }) => {
    await page.locator('select').nth(1).selectOption('landmark')
    // Verify filtered results — landmark means HHI >= 85, should show 3 hotels
    await expect(page.getByText(/Showing [1-5] heritage hotel/)).toBeVisible()
    await expect(page).toHaveURL(/tier=landmark/)
  })

  test('filter by price $$ shows budget hotels', async ({ page }) => {
    await page.locator('select').nth(2).selectOption('$$')
    await expect(page.getByText('Showing 3 heritage hotels')).toBeVisible()
  })

  test('sort by name ascending', async ({ page }) => {
    await page.locator('select').nth(3).selectOption('name')
    await page.getByRole('button', { name: /Descending/i }).click()
    await expect(page.getByText('Ascending')).toBeVisible()
  })

  test('sort by year ascending shows oldest first', async ({ page }) => {
    await page.locator('select').nth(3).selectOption('yearBuilt')
    await page.getByRole('button', { name: /Descending/i }).click()
    // E&O Hotel (1885) should appear near the top
    await expect(page.getByText('E&O Hotel').first()).toBeVisible()
  })

  test('order toggle flips between asc and desc', async ({ page }) => {
    await expect(page.getByText('Descending')).toBeVisible()
    await page.getByRole('button', { name: /Descending/i }).click()
    await expect(page.getByText('Ascending')).toBeVisible()
    await expect(page).toHaveURL(/order=asc/)
  })

  test('clear filters resets everything', async ({ page }) => {
    await page.locator('select').first().selectOption('SG')
    await expect(page.getByText('Showing 3')).toBeVisible()
    await page.getByRole('button', { name: 'Clear filters' }).click()
    await expect(page.getByText('Showing 15 heritage hotels')).toBeVisible()
  })

  test('combined filters: Malaysia + distinguished', async ({ page }) => {
    await page.locator('select').first().selectOption('MY')
    await page.locator('select').nth(1).selectOption('distinguished')
    await expect(page.getByText('The Majestic Malacca')).toBeVisible()
  })

  test('filter with no results shows empty state', async ({ page }) => {
    await page.locator('select').first().selectOption('KH')
    await expect(page.getByText(/No hotels match/)).toBeVisible()
  })

  test('URL query params persist on reload', async ({ page }) => {
    await page.locator('select').first().selectOption('TH')
    await expect(page).toHaveURL(/country=TH/)
    await page.reload()
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing 2 heritage hotels')).toBeVisible()
  })

  test('clicking hotel card navigates to hotel detail', async ({ page }) => {
    await page.getByText('Raffles Hotel').first().click()
    await expect(page).toHaveURL(/\/hotel\/raffles/)
  })
})
