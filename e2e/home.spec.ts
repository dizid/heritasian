import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
  })

  test('page title contains Heritasian', async ({ page }) => {
    await expect(page).toHaveTitle(/Heritasian/)
  })

  test('header is visible with logo and nav', async ({ page }) => {
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.getByText('Heritasian')).toBeVisible()
    await expect(header.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(header.getByRole('link', { name: 'Rankings' })).toBeVisible()
    await expect(header.getByRole('link', { name: 'Methodology' })).toBeVisible()
  })

  test('hero section shows heading and subtitle', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Heritage Hotels')
    await expect(page.getByText('Independently rated').first()).toBeVisible()
  })

  test('top 5 hotels are rendered', async ({ page }) => {
    await expect(page.getByText('Top Rated Heritage Hotels')).toBeVisible()
    await expect(page.getByText('Raffles Hotel').first()).toBeVisible()
  })

  test('3 pillar cards are visible', async ({ page }) => {
    const howWeRate = page.locator('section').filter({ hasText: 'How We Rate' })
    await expect(howWeRate.getByText('Heritage & Authenticity')).toBeVisible()
    await expect(howWeRate.getByText('Guest Experience')).toBeVisible()
    await expect(howWeRate.getByText('Operational Excellence')).toBeVisible()
  })

  test('9 country tiles are rendered', async ({ page }) => {
    await expect(page.getByText('Nine Nations, One Index')).toBeVisible()
    for (const country of ['Thailand', 'Vietnam', 'Malaysia', 'Singapore', 'Laos', 'Myanmar', 'Philippines']) {
      await expect(page.getByText(country).first()).toBeVisible()
    }
  })

  test('Explore Rankings CTA navigates to /rankings', async ({ page }) => {
    await page.getByRole('link', { name: 'Explore Rankings' }).click()
    await expect(page).toHaveURL(/\/rankings/)
  })

  test('country tile navigates to /rankings with country param', async ({ page }) => {
    // Click on the country tile section, find Singapore link
    const countrySection = page.locator('section').filter({ hasText: 'Nine Nations' })
    await countrySection.getByText('Singapore').click()
    await expect(page).toHaveURL(/\/rankings\?country=SG/)
  })

  test('View All Rankings link works', async ({ page }) => {
    await page.getByRole('link', { name: /View All Rankings/ }).click()
    await expect(page).toHaveURL(/\/rankings/)
  })

  test('Read full methodology link works', async ({ page }) => {
    await page.locator('main').getByRole('link', { name: /methodology/i }).first().click()
    await expect(page).toHaveURL(/\/methodology/)
  })
})
