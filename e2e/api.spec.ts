import { test, expect } from '@playwright/test'

const BASE = 'https://heritasian.netlify.app'

test.describe('API contract', () => {
  test('GET /api/hotels returns 15 hotels with correct shape', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels`)
    expect(res.status()).toBe(200)

    const hotels = await res.json()
    expect(hotels).toHaveLength(15)

    // Verify shape of first hotel
    const hotel = hotels[0]
    expect(hotel).toHaveProperty('id')
    expect(hotel).toHaveProperty('slug')
    expect(hotel).toHaveProperty('name')
    expect(hotel).toHaveProperty('country')
    expect(hotel).toHaveProperty('city')
    expect(hotel).toHaveProperty('yearBuilt')
    expect(hotel).toHaveProperty('hhi')
    expect(hotel).toHaveProperty('tier')
    expect(hotel).toHaveProperty('scores')
    expect(hotel).toHaveProperty('pillarScores')
    expect(hotel.scores).toHaveProperty('heritageAuthenticity')
    expect(hotel.scores).toHaveProperty('guestExperience')
    expect(hotel.scores).toHaveProperty('operationalExcellence')
  })

  test('hotels sorted by HHI desc by default', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels`)
    const hotels = await res.json()

    for (let i = 1; i < hotels.length; i++) {
      expect(hotels[i - 1].hhi).toBeGreaterThanOrEqual(hotels[i].hhi)
    }
  })

  test('Raffles Hotel is ranked #1', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels`)
    const hotels = await res.json()
    expect(hotels[0].name).toBe('Raffles Hotel')
    expect(hotels[0].hhi).toBeGreaterThanOrEqual(90)
  })

  test('filter by country=SG returns only Singapore hotels', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels?country=SG`)
    const hotels = await res.json()

    expect(hotels.length).toBeGreaterThanOrEqual(3)
    for (const h of hotels) {
      expect(h.country).toBe('SG')
    }
  })

  test('filter by tier=landmark returns only HHI >= 85', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels?tier=landmark`)
    const hotels = await res.json()

    expect(hotels.length).toBeGreaterThanOrEqual(1)
    for (const h of hotels) {
      expect(h.hhi).toBeGreaterThanOrEqual(85)
    }
  })

  test('filter by price=$$$$ returns only luxury hotels', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels?price=$$$$`)
    const hotels = await res.json()

    expect(hotels.length).toBeGreaterThanOrEqual(1)
    for (const h of hotels) {
      expect(h.priceRange).toBe('$$$$')
    }
  })

  test('sort by name asc returns alphabetically', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels?sort=name&order=asc`)
    const hotels = await res.json()

    for (let i = 1; i < hotels.length; i++) {
      expect(hotels[i - 1].name.localeCompare(hotels[i].name)).toBeLessThanOrEqual(0)
    }
  })

  test('sort by year asc returns oldest first', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels?sort=year&order=asc`)
    const hotels = await res.json()

    for (let i = 1; i < hotels.length; i++) {
      expect(hotels[i - 1].yearBuilt).toBeLessThanOrEqual(hotels[i].yearBuilt)
    }
  })

  test('GET /api/hotels/:slug returns single hotel with timeline', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels/raffles-hotel-singapore`)
    expect(res.status()).toBe(200)

    const hotel = await res.json()
    expect(hotel.name).toBe('Raffles Hotel')
    expect(hotel.slug).toBe('raffles-hotel-singapore')
    expect(hotel.timeline).toBeInstanceOf(Array)
    expect(hotel.timeline.length).toBeGreaterThanOrEqual(3)
    expect(hotel.timeline[0]).toHaveProperty('year')
    expect(hotel.timeline[0]).toHaveProperty('event')
  })

  test('GET /api/hotels/nonexistent returns 404', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels/nonexistent-hotel-slug`)
    expect(res.status()).toBe(404)
  })

  test('HHI scores match expected tier ranges', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels`)
    const hotels = await res.json()

    for (const h of hotels) {
      if (h.hhi >= 85) expect(h.tier).toBe('landmark')
      else if (h.hhi >= 70) expect(h.tier).toBe('distinguished')
      else if (h.hhi >= 55) expect(h.tier).toBe('notable')
      else expect(h.tier).toBe('emerging')
    }
  })

  test('all 9 sub-scores are numbers between 0-100', async ({ request }) => {
    const res = await request.get(`${BASE}/api/hotels`)
    const hotels = await res.json()

    for (const h of hotels) {
      const { heritageAuthenticity: ha, guestExperience: ge, operationalExcellence: oe } = h.scores
      for (const score of [
        ha.historicalSignificance, ha.architecturalIntegrity, ha.culturalImmersion,
        ge.authenticExperience, ge.reputationScore, ge.serviceQuality,
        oe.conservationCommitment, oe.modernComforts, oe.valuePositioning,
      ]) {
        expect(score).toBeGreaterThanOrEqual(0)
        expect(score).toBeLessThanOrEqual(100)
      }
    }
  })
})
