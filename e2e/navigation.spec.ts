import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('header logo navigates to home', async ({ page }) => {
    await page.goto('/rankings')
    await page.locator('header').getByText('Heritasian').click()
    await expect(page).toHaveURL('/')
  })

  test('Home nav link works', async ({ page }) => {
    await page.goto('/methodology')
    await page.locator('header').getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
  })

  test('Rankings nav link works', async ({ page }) => {
    await page.goto('/')
    await page.locator('header').getByRole('link', { name: 'Rankings' }).click()
    await expect(page).toHaveURL('/rankings')
  })

  test('Methodology nav link works', async ({ page }) => {
    await page.goto('/')
    await page.locator('header').getByRole('link', { name: 'Methodology' }).click()
    await expect(page).toHaveURL('/methodology')
  })

  test('footer is visible on home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('footer is visible on rankings page', async ({ page }) => {
    await page.goto('/rankings')
    await expect(page.locator('footer')).toBeVisible()
  })

  test('footer is visible on methodology page', async ({ page }) => {
    await page.goto('/methodology')
    await expect(page.locator('footer')).toBeVisible()
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('hamburger menu toggles and nav links work', async ({ page }) => {
    await page.goto('/')
    const hamburger = page.locator('header button')
    await expect(hamburger).toBeVisible()
    await hamburger.click()

    // Mobile Rankings link should be visible
    await page.locator('header nav').last().getByRole('link', { name: 'Rankings' }).click()
    await expect(page).toHaveURL('/rankings')
  })

  test('mobile menu closes on link click', async ({ page }) => {
    await page.goto('/')
    const hamburger = page.locator('header button')
    await hamburger.click()

    await page.locator('header nav').last().getByRole('link', { name: 'Methodology' }).click()
    await expect(page).toHaveURL(/\/methodology/)
  })
})

test.describe('Full user journey', () => {
  test('Home → Rankings → Hotel → Back', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    await page.getByRole('link', { name: 'Explore Rankings' }).click()
    await expect(page).toHaveURL('/rankings')
    await expect(page.getByText('Showing').first()).toBeVisible()

    await page.getByText('Raffles Hotel').first().click()
    await expect(page).toHaveURL(/\/hotel\/raffles/)
    await expect(page.locator('h1')).toContainText('Raffles Hotel')

    await page.getByRole('link', { name: /Back to Rankings/i }).first().click()
    await expect(page).toHaveURL(/\/rankings/)
  })

  test('Country tile → filtered rankings', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    const countrySection = page.locator('section').filter({ hasText: 'Nine Nations' })
    await countrySection.getByText('Thailand').click()
    await expect(page).toHaveURL(/\/rankings\?country=TH/)

    await expect(page.getByText('Showing 2 heritage hotels')).toBeVisible()
  })
})
