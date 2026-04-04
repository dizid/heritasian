<script setup lang="ts">
import { computed, onMounted, onServerPrefetch } from 'vue'
import { RouterLink } from 'vue-router'
import { COUNTRIES, TIER_CONFIG } from '@/types'
import { useHotels } from '@/composables/useHotels'
import { useSeo } from '@/composables/useSeo'
import TierBadge from '@/components/shared/TierBadge.vue'

useSeo({
  title: 'Heritage Hotels',
  description: "Browse all heritage hotels in Southeast Asia, rated and ranked by the Heritage Hotel Index. Explore historic properties across 9 countries.",
  path: '/hotels',
})

const { hotels, loading, fetchHotels } = useHotels()

onServerPrefetch(() => fetchHotels())
onMounted(() => {
  fetchHotels()
})

const sortedHotels = computed(() =>
  [...hotels.value].sort((a, b) => b.hhi - a.hhi)
)
</script>

<template>
  <div class="min-h-screen pt-20">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="font-heading text-3xl md:text-4xl font-bold text-heritage-text mb-2">
          Heritage Hotels
        </h1>
        <p class="text-heritage-text-secondary text-sm md:text-base max-w-2xl">
          Browse all {{ hotels.length }} heritage properties in our index, ranked by the Heritage Hotel Index.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="status" aria-label="Loading hotels">
        <div
          v-for="i in 6"
          :key="i"
          class="glass rounded-xl h-56 animate-pulse bg-heritage-surface-light border border-heritage-border"
          aria-hidden="true"
        />
        <span class="sr-only">Loading hotels...</span>
      </div>

      <!-- Hotel grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <RouterLink
          v-for="hotel in sortedHotels"
          :key="hotel.id"
          :to="`/hotel/${hotel.slug}`"
          class="group"
        >
          <article class="glass border-heritage-border rounded-xl overflow-hidden transition-all duration-300 hover:border-heritage-gold/40 hover:-translate-y-0.5">
            <!-- Thumbnail -->
            <div class="relative h-36 overflow-hidden">
              <img
                :src="hotel.imageUrl"
                :alt="hotel.name"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-heritage-dark/70 to-transparent" />

              <!-- HHI score badge -->
              <div
                class="absolute top-2 right-2 w-11 h-11 rounded-lg glass flex flex-col items-center justify-center"
                :style="{ borderColor: TIER_CONFIG[hotel.tier].color + '40' }"
              >
                <span
                  class="font-heading font-bold text-base leading-none tabular-nums"
                  :style="{ color: TIER_CONFIG[hotel.tier].color }"
                >
                  {{ hotel.hhi.toFixed(0) }}
                </span>
                <span class="text-[8px] text-heritage-text-secondary leading-none">HHI</span>
              </div>
            </div>

            <!-- Info -->
            <div class="p-3">
              <h2 class="font-heading text-sm font-semibold text-heritage-text leading-tight group-hover:text-heritage-gold transition-colors duration-200 mb-1">
                {{ hotel.name }}
              </h2>
              <p class="text-xs text-heritage-text-secondary flex items-center gap-1 mb-2">
                <span>{{ COUNTRIES.find(c => c.code === hotel.country)?.flag }}</span>
                {{ hotel.city }}, {{ COUNTRIES.find(c => c.code === hotel.country)?.name }}
                <span class="text-heritage-border">·</span>
                {{ hotel.yearBuilt }}
              </p>
              <TierBadge :tier="hotel.tier" size="sm" />
            </div>
          </article>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
