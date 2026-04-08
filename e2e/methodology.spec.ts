import { test, expect } from '@playwright/test'

test.describe('Methodology page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/methodology')
  })

  test('page loads with heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Our Methodology' })).toBeVisible()
  })

  test('why section is visible', async ({ page }) => {
    await expect(page.getByText('Why the HHI Exists')).toBeVisible()
  })

  test('3 pillars with correct weights', async ({ page }) => {
    await expect(page.getByText('The Three Pillars')).toBeVisible()
    // Check pillar names exist in the page
    const main = page.locator('main')
    await expect(main.getByText('Heritage & Authenticity').first()).toBeVisible()
    await expect(main.getByText('Guest Experience').first()).toBeVisible()
    await expect(main.getByText('Operational Excellence').first()).toBeVisible()
  })

  test('all 9 sub-scores listed', async ({ page }) => {
    await expect(page.getByText('Historical Significance').first()).toBeVisible()
    await expect(page.getByText('Architectural Integrity').first()).toBeVisible()
    await expect(page.getByText('Cultural Immersion').first()).toBeVisible()
    await expect(page.getByText('Authentic Experience Score').first()).toBeVisible()
    await expect(page.getByText('Reputation Score').first()).toBeVisible()
    await expect(page.getByText('Service Quality').first()).toBeVisible()
    await expect(page.getByText('Conservation Commitment').first()).toBeVisible()
    await expect(page.getByText('Modern Comforts').first()).toBeVisible()
    await expect(page.getByText('Value Positioning').first()).toBeVisible()
  })

  test('tier definitions table with 4 tiers', async ({ page }) => {
    await expect(page.getByText('Tier Definitions')).toBeVisible()
    await expect(page.getByText('Heritage Landmark').first()).toBeVisible()
    await expect(page.getByText('Heritage Distinguished').first()).toBeVisible()
    await expect(page.getByText('Heritage Notable').first()).toBeVisible()
    await expect(page.getByText('Heritage Emerging').first()).toBeVisible()
  })

  test('data sources section lists ICOMOS Nara, Heritage Registries, Expert Assessment, Google Reviews', async ({ page }) => {
    await expect(page.getByText('Data Sources')).toBeVisible()
    await expect(page.getByText('ICOMOS Nara Framework').first()).toBeVisible()
    await expect(page.getByText('Heritage Registries').first()).toBeVisible()
    await expect(page.getByText('Expert Assessment').first()).toBeVisible()
    await expect(page.getByText('Google Reviews').first()).toBeVisible()
  })

  test('data sources section does NOT claim TripAdvisor or Booking.com aggregation', async ({ page }) => {
    // Phase 0 credibility fix (2026-04-09): the previous v1 methodology advertised
    // aggregation from TripAdvisor and Booking.com that the code never actually implemented.
    // Those claims were removed. The dataSources cards must not show them as sources.
    const dataSourcesSection = page.locator('section, div').filter({ hasText: 'Data Sources' }).first()
    await expect(dataSourcesSection.getByText('TripAdvisor', { exact: true })).toHaveCount(0)
    await expect(dataSourcesSection.getByText('Booking.com', { exact: true })).toHaveCount(0)
  })

  test('ICOMOS Nara anchor section is visible with live link', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Anchored in the ICOMOS Nara Framework/i })).toBeVisible()
    const naraLink = page.getByRole('link', { name: /ICOMOS Nara Document on Authenticity/i })
    await expect(naraLink).toBeVisible()
    await expect(naraLink).toHaveAttribute('href', /icomos\.org/)
  })

  test('transparency/independence note', async ({ page }) => {
    await expect(page.getByText('A Note on Independence')).toBeVisible()
    await expect(page.getByText('accepts no payment from hotels')).toBeVisible()
  })
})
