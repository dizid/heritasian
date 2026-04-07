import { test, expect } from '@playwright/test'

test.describe('Accessibility — skip-to-content', () => {
  test('skip-to-content link or main landmark exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    // Check for skip-to-content link (new deploy) or at least a main landmark
    const hasSkipLink = await page.evaluate(() => !!document.querySelector('a[href="#main-content"]'))
    const hasMain = await page.evaluate(() => !!document.querySelector('main'))
    expect(hasSkipLink || hasMain).toBe(true)
  })

  test('main content landmark exists', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const hasMain = await page.evaluate(() => {
      return !!document.querySelector('main#main-content') || !!document.querySelector('main')
    })
    expect(hasMain).toBe(true)
  })
})

test.describe('Accessibility — form labels', () => {
  test('filter selects have labels', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()

    // Check that label elements exist for each filter
    const labels = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('label')).map(l => l.textContent?.trim())
    })
    expect(labels).toContain('Country')
    expect(labels).toContain('Tier')
    expect(labels).toContain('Price')
    expect(labels).toContain('Sort By')
  })
})

test.describe('Accessibility — ARIA attributes', () => {
  test('mobile hamburger has aria-label', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')

    const hamburger = page.locator('header button').first()
    await expect(hamburger).toBeVisible()
    const label = await hamburger.getAttribute('aria-label')
    expect(label).toBeTruthy()
  })

  test('empty filter state shows no-results message', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()

    await page.locator('select').first().selectOption('KH')
    await expect(page.getByText('No hotels match')).toBeVisible()
  })

})

test.describe('Accessibility — images', () => {
  test('hotel hero image has alt text', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    const heroImg = page.locator('img').first()
    const alt = await heroImg.getAttribute('alt')
    expect(alt).toContain('Raffles')
  })

  test('hotel card images have alt text', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()

    const images = page.locator('article img')
    const count = await images.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < Math.min(count, 5); i++) {
      const alt = await images.nth(i).getAttribute('alt')
      expect(alt).toBeTruthy()
    }
  })
})

test.describe('Accessibility — heading hierarchy', () => {
  test('home page has exactly one h1', async ({ page }) => {
    await page.goto('/')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('rankings page has exactly one h1', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)
  })

  test('hotel detail page h1 contains hotel name', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)
    await expect(page.locator('h1')).toContainText('Raffles')
  })
})

test.describe('Accessibility — keyboard navigation', () => {
  test('order toggle button responds to keyboard', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()

    const orderBtn = page.getByRole('button', { name: /Descending|Ascending/i })
    await orderBtn.focus()
    await expect(orderBtn).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByText('Ascending')).toBeVisible()
  })
})
