import { test, expect } from '@playwright/test'

test.describe('Mobile viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('home page renders on mobile', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    await expect(page.locator('h1')).toBeVisible()
    await expect(page.getByText('Raffles Hotel').first()).toBeVisible()
    // Hamburger should be visible on mobile
    await expect(page.locator('header button').first()).toBeVisible()
  })

  test('rankings filters work on mobile', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()

    await page.locator('select').first().selectOption('SG')
    await expect(page.getByText('Showing 5 heritage hotels')).toBeVisible()
  })

  test('hotel detail page readable on mobile', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    await expect(page.locator('h1')).toContainText('Raffles Hotel')
    await expect(page.getByText('About the Property')).toBeVisible()
  })

  test('mobile menu opens and navigates', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const hamburger = page.locator('header button').first()
    await hamburger.click()

    // Find the mobile nav links
    const mobileNav = page.locator('header nav').last()
    await mobileNav.getByRole('link', { name: 'Methodology' }).click()
    await expect(page).toHaveURL(/\/methodology/)
  })

  test('no horizontal overflow on mobile pages', async ({ page }) => {
    for (const path of ['/', '/rankings', '/methodology']) {
      await page.goto(path)
      if (path !== '/methodology') {
        await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
      }
      await page.waitForLoadState('domcontentloaded')

      const overflow = await page.evaluate(() => document.body.scrollWidth > window.innerWidth)
      expect(overflow, `${path} has horizontal overflow`).toBe(false)
    }
  })
})

test.describe('Tablet viewport', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('rankings page displays correctly on tablet', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing 108 heritage hotels')).toBeVisible()
  })

  test('hotel score and tier visible on tablet', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    await expect(page.getByText('HHI').first()).toBeVisible()
    await expect(page.getByText('Heritage Landmark').first()).toBeVisible()
  })
})
