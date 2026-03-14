<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { CountryCode, Tier, PriceRange } from '@/types'
import { getPillarScore } from '@/types'
import { useHotels } from '@/composables/useHotels'
import { useSeo } from '@/composables/useSeo'
import RankingsFilter from '@/components/rankings/RankingsFilter.vue'

useSeo({
  title: 'Heritage Hotel Rankings',
  description: "Discover Southeast Asia's finest heritage hotels, independently rated and ranked by the Heritage Hotel Index across heritage authenticity, guest experience, and operational excellence.",
  path: '/rankings',
})
import RankingsList from '@/components/rankings/RankingsList.vue'
import type { FilterState } from '@/components/rankings/RankingsFilter.vue'

const route = useRoute()
const router = useRouter()
const { hotels, loading, fetchHotels } = useHotels()

// UI filter state — synced with URL query params
const filters = ref<FilterState>({
  country: (route.query.country as CountryCode) || '',
  tier: (route.query.tier as Tier) || '',
  priceRange: (route.query.priceRange as PriceRange) || '',
  sort: (route.query.sort as string) || 'hhi',
  order: (route.query.order as 'asc' | 'desc') || 'desc',
})

// Sync filter changes to URL
watch(filters, (f) => {
  router.replace({
    query: {
      ...(f.country ? { country: f.country } : {}),
      ...(f.tier ? { tier: f.tier } : {}),
      ...(f.priceRange ? { priceRange: f.priceRange } : {}),
      ...(f.sort !== 'hhi' ? { sort: f.sort } : {}),
      ...(f.order !== 'desc' ? { order: f.order } : {}),
    },
  })
}, { deep: true })

onMounted(() => {
  fetchHotels()
})

// Client-side filtering and sorting of the full hotel list
const filteredHotels = computed(() => {
  let list = [...hotels.value]
  const f = filters.value

  if (f.country) list = list.filter(h => h.country === f.country)
  if (f.tier) list = list.filter(h => h.tier === f.tier)
  if (f.priceRange) list = list.filter(h => h.priceRange === f.priceRange)

  list.sort((a, b) => {
    let valA: number | string = 0
    let valB: number | string = 0

    switch (f.sort) {
      case 'hhi':
        valA = a.hhi; valB = b.hhi
        break
      case 'ha':
        valA = getPillarScore(a.scores).ha; valB = getPillarScore(b.scores).ha
        break
      case 'ge':
        valA = getPillarScore(a.scores).ge; valB = getPillarScore(b.scores).ge
        break
      case 'oe':
        valA = getPillarScore(a.scores).oe; valB = getPillarScore(b.scores).oe
        break
      case 'yearBuilt':
        valA = a.yearBuilt; valB = b.yearBuilt
        break
      case 'name':
        valA = a.name; valB = b.name
        break
    }

    if (typeof valA === 'string') {
      return f.order === 'asc'
        ? valA.localeCompare(valB as string)
        : (valB as string).localeCompare(valA)
    }
    return f.order === 'asc'
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number)
  })

  return list
})
</script>

<template>
  <div class="min-h-screen pt-20">
    <!-- Page header -->
    <div class="max-w-7xl mx-auto px-4 pt-10 pb-8">
      <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-3">Independently Rated</p>
      <h1 class="font-heading text-3xl md:text-4xl font-bold text-heritage-text mb-3">
        Heritage Hotel Rankings
      </h1>
      <p class="text-heritage-text-secondary text-sm max-w-2xl">
        Discover Southeast Asia's finest heritage hotels, independently rated and ranked
        by the Heritage Hotel Index — a composite score across three pillars.
      </p>
    </div>

    <!-- Sticky filter bar -->
    <div class="sticky top-16 z-40 border-b border-heritage-border bg-heritage-dark/95 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 py-3">
        <RankingsFilter
          v-model="filters"
          @update:filters="(f) => (filters = f)"
        />
      </div>
    </div>

    <!-- Results -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Result count -->
      <div class="mb-6">
        <p class="text-heritage-text-secondary text-xs">
          <template v-if="loading">Loading hotels...</template>
          <template v-else>
            Showing <span class="text-heritage-gold font-medium">{{ filteredHotels.length }}</span>
            heritage hotel{{ filteredHotels.length !== 1 ? 's' : '' }}
          </template>
        </p>
      </div>

      <RankingsList :hotels="filteredHotels" :loading="loading" />
    </div>
  </div>
</template>
