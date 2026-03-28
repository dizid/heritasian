<script setup lang="ts">
import type { Hotel } from '@/types'
import HotelCard from '@/components/hotel/HotelCard.vue'

defineProps<{
  hotels: Hotel[]
  loading: boolean
}>()
</script>

<template>
  <div>
    <!-- Loading skeleton -->
    <div v-if="loading" class="flex flex-col gap-4" role="status" aria-label="Loading hotels">
      <div
        v-for="i in 5"
        :key="i"
        class="glass rounded-xl h-36 animate-pulse bg-heritage-surface-light border border-heritage-border"
        aria-hidden="true"
      />
      <span class="sr-only">Loading hotel rankings...</span>
    </div>

    <!-- Hotel list -->
    <div v-else-if="hotels.length > 0" class="flex flex-col gap-4">
      <HotelCard
        v-for="(hotel, index) in hotels"
        :key="hotel.id"
        :hotel="hotel"
        :rank="index + 1"
      />
    </div>

    <!-- Empty state -->
    <div
      v-else
      class="glass rounded-xl p-16 text-center border border-heritage-border"
      role="status"
      aria-live="polite"
    >
      <div class="text-4xl mb-4" aria-hidden="true">🏛️</div>
      <h3 class="font-heading text-xl text-heritage-text mb-2">No hotels match your filters</h3>
      <p class="text-heritage-text-secondary text-sm">
        Try adjusting your filters to discover more heritage hotels.
      </p>
    </div>
  </div>
</template>
