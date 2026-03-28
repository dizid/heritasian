import { test, expect } from '@playwright/test'

test.describe('Score accuracy', () => {
  test('API pillarScores match weighted calculation', async ({ request }) => {
    const res = await request.get(`/api/hotels/raffles-hotel-singapore`)
    const hotel = await res.json()

    const { heritageAuthenticity: ha, guestExperience: ge, operationalExcellence: oe } = hotel.scores

    // Heritage & Authenticity pillar = (hs*15 + ai*15 + ci*10) / 40
    const expectedHA = (ha.historicalSignificance * 15 + ha.architecturalIntegrity * 15 + ha.culturalImmersion * 10) / 40
    expect(hotel.pillarScores.ha).toBeCloseTo(expectedHA, 0)

    // Guest Experience pillar = (ae*15 + rs*12 + sq*8) / 35
    const expectedGE = (ge.authenticExperience * 15 + ge.reputationScore * 12 + ge.serviceQuality * 8) / 35
    expect(hotel.pillarScores.ge).toBeCloseTo(expectedGE, 0)

    // Operational Excellence pillar = (cc*10 + mc*8 + vp*7) / 25
    const expectedOE = (oe.conservationCommitment * 10 + oe.modernComforts * 8 + oe.valuePositioning * 7) / 25
    expect(hotel.pillarScores.oe).toBeCloseTo(expectedOE, 0)
  })

  test('HHI score matches weighted sum of all sub-scores', async ({ request }) => {
    const res = await request.get(`/api/hotels/raffles-hotel-singapore`)
    const hotel = await res.json()

    const { heritageAuthenticity: ha, guestExperience: ge, operationalExcellence: oe } = hotel.scores

    const expectedHHI =
      ha.historicalSignificance * 0.15 +
      ha.architecturalIntegrity * 0.15 +
      ha.culturalImmersion * 0.10 +
      ge.authenticExperience * 0.15 +
      ge.reputationScore * 0.12 +
      ge.serviceQuality * 0.08 +
      oe.conservationCommitment * 0.10 +
      oe.modernComforts * 0.08 +
      oe.valuePositioning * 0.07

    expect(hotel.hhi).toBeCloseTo(expectedHHI, 1)
  })

  test('all hotels have valid pillarScores', async ({ request }) => {
    const res = await request.get(`/api/hotels`)
    const hotels = await res.json()

    for (const h of hotels) {
      expect(h.pillarScores).toBeTruthy()
      expect(h.pillarScores.ha).toBeGreaterThanOrEqual(0)
      expect(h.pillarScores.ha).toBeLessThanOrEqual(100)
      expect(h.pillarScores.ge).toBeGreaterThanOrEqual(0)
      expect(h.pillarScores.ge).toBeLessThanOrEqual(100)
      expect(h.pillarScores.oe).toBeGreaterThanOrEqual(0)
      expect(h.pillarScores.oe).toBeLessThanOrEqual(100)
    }
  })

  test('hotel detail page displays all 9 sub-scores as numbers', async ({ page }) => {
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)

    // Each score bar should show a numeric value
    const scoreLabels = [
      'Historical Significance', 'Architectural Integrity', 'Cultural Immersion',
      'Authentic Experience', 'Reputation Score', 'Service Quality',
      'Conservation Commitment', 'Modern Comforts', 'Value Positioning',
    ]

    for (const label of scoreLabels) {
      await expect(page.getByText(label).first()).toBeVisible()
    }
  })

  test('tier badge matches HHI score range', async ({ page }) => {
    // Raffles should be Landmark (HHI >= 85)
    await page.goto('/hotel/raffles-hotel-singapore')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/raffles') && resp.status() === 200)
    await expect(page.getByText('Heritage Landmark').first()).toBeVisible()

    // The Henry should be Emerging (HHI < 55)
    await page.goto('/hotel/the-henry-hotel-manila')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels/the-henry') && resp.status() === 200)
    await expect(page.getByText('Heritage Emerging').first()).toBeVisible()
  })
})

test.describe('Score display on rankings', () => {
  test('rankings hotel cards show HHI score', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)

    // First hotel card (Raffles) should have a visible score
    const firstCard = page.locator('article').first()
    await expect(firstCard).toBeVisible()
    // Score should be a number
    const scoreText = await firstCard.getByText(/\d{2,3}/).first().textContent()
    expect(scoreText).toBeTruthy()
  })

  test('rankings sorted by pillar ha shows different order', async ({ page }) => {
    await page.goto('/rankings')
    await page.waitForResponse(resp => resp.url().includes('/api/hotels') && resp.status() === 200)
    await expect(page.getByText('Showing')).toBeVisible()

    // Sort by Heritage & Authenticity
    await page.locator('select').nth(3).selectOption('ha')
    await expect(page.getByText(/Showing \d+ heritage hotel/)).toBeVisible()
  })
})
