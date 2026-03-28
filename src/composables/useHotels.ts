import { ref, reactive } from 'vue'
import type { Hotel, CountryCode, Tier, PriceRange } from '../types/index'

export interface HotelFilters {
  country: CountryCode[]
  tier: Tier[]
  priceRange: PriceRange[]
  sort: 'hhi' | 'ha' | 'ge' | 'oe' | 'name' | 'year'
  order: 'asc' | 'desc'
}

const API_BASE = '/api'

function buildQueryString(filters: HotelFilters): string {
  const params = new URLSearchParams()

  if (filters.country.length > 0) {
    params.set('country', filters.country.join(','))
  }
  if (filters.tier.length > 0) {
    params.set('tier', filters.tier.join(','))
  }
  if (filters.priceRange.length > 0) {
    params.set('price', filters.priceRange.join(','))
  }
  params.set('sort', filters.sort)
  params.set('order', filters.order)

  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export function useHotels() {
  const hotels = ref<Hotel[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const filters = reactive<HotelFilters>({
    country: [],
    tier: [],
    priceRange: [],
    sort: 'hhi',
    order: 'desc',
  })

  async function fetchHotels(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      // During SSR: query Neon DB directly (API server not available)
      if (import.meta.env.SSR) {
        if (!process.env.DATABASE_URL) {
          error.value = 'Database not configured'
          return
        }
        const { fetchAllHotels } = await import('@/data/db')
        hotels.value = await fetchAllHotels(process.env.DATABASE_URL)
        return
      }

      const qs = buildQueryString(filters)
      const response = await fetch(`${API_BASE}/hotels${qs}`)

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(body.error ?? `HTTP ${response.status}`)
      }

      hotels.value = await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch hotels'
      hotels.value = []
    } finally {
      loading.value = false
    }
  }

  async function getHotelBySlug(slug: string): Promise<Hotel | null> {
    try {
      // During SSR: query Neon DB directly (API server not available)
      if (import.meta.env.SSR) {
        if (!process.env.DATABASE_URL) return null
        const { fetchHotelBySlug } = await import('@/data/db')
        return fetchHotelBySlug(process.env.DATABASE_URL, slug)
      }

      const response = await fetch(`${API_BASE}/hotels/${encodeURIComponent(slug)}`)

      if (response.status === 404) return null

      if (!response.ok) {
        const body = await response.json().catch(() => ({ error: response.statusText }))
        throw new Error(body.error ?? `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch hotel'
      return null
    }
  }

  return {
    hotels,
    loading,
    error,
    filters,
    fetchHotels,
    getHotelBySlug,
  }
}
