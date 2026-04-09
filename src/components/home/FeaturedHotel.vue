<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Hotel } from '@/types'
import { TIER_CONFIG } from '@/types'
import TierBadge from '@/components/shared/TierBadge.vue'

const props = defineProps<{
  hotel: Hotel | null
  loading: boolean
}>()

const tier = computed(() => props.hotel?.tier ?? null)
const tierColor = computed(() => tier.value ? TIER_CONFIG[tier.value].color : '#c9a96e')
const excerpt = computed(() => {
  if (!props.hotel?.description) return ''
  const text = props.hotel.description
  return text.length > 160 ? text.slice(0, 160).replace(/\s+\S*$/, '') + '...' : text
})
</script>

<template>
  <!-- Loading state -->
  <div v-if="loading" class="glass rounded-2xl h-64 animate-pulse bg-heritage-surface-light border border-heritage-border" />

  <!-- Empty state -->
  <div v-else-if="!hotel" class="glass rounded-2xl p-10 md:p-14 text-center border border-heritage-border border-gold-glow">
    <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-4 font-medium">Coming Soon</p>
    <h3 class="font-heading text-2xl md:text-3xl font-bold text-heritage-text mb-4">
      Our First Heritage Hotel Ratings
    </h3>
    <p class="text-heritage-text-secondary text-sm max-w-lg mx-auto leading-relaxed mb-6">
      The Heritasian Heritage Index evaluates properties across 9 dimensions of heritage authenticity,
      guest experience, and operational excellence. Our inaugural ratings are being finalized.
    </p>
    <RouterLink
      to="/methodology"
      class="inline-flex items-center gap-2 text-heritage-gold hover:text-heritage-gold-light text-sm font-medium transition-colors duration-200"
    >
      Learn how we rate →
    </RouterLink>
  </div>

  <!-- Featured hotel -->
  <RouterLink
    v-else
    :to="`/hotel/${hotel.slug}`"
    class="group block glass rounded-2xl overflow-hidden border-heritage-border hover:border-heritage-gold/30 transition-all duration-500"
  >
    <div class="flex flex-col md:flex-row">
      <!-- Image -->
      <div class="relative md:w-[60%] h-56 md:h-80 overflow-hidden">
        <img
          v-if="hotel.imageUrl"
          :src="hotel.imageUrl"
          :alt="hotel.name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
        />
        <div v-else class="w-full h-full bg-gradient-to-br from-heritage-surface-light to-heritage-dark flex items-center justify-center">
          <span class="font-heading text-heritage-text-secondary/30 text-lg text-center px-6">{{ hotel.name }}</span>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-heritage-dark/80 via-heritage-dark/30 to-transparent" />
        <!-- Label -->
        <div class="absolute top-4 left-4 glass-light rounded-lg px-3 py-1.5">
          <span class="text-heritage-gold text-[10px] uppercase tracking-[0.2em] font-semibold">Highest Rated</span>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 p-6 md:p-8 flex flex-col justify-center gap-4">
        <div>
          <p class="text-heritage-text-secondary text-xs mb-1">{{ hotel.city }} · Built {{ hotel.yearBuilt }}</p>
          <h3 class="font-heading text-2xl md:text-3xl font-bold text-heritage-text group-hover:text-heritage-gold-light transition-colors duration-300">
            {{ hotel.name }}
          </h3>
        </div>

        <div class="flex items-center gap-3">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center font-heading font-bold text-lg text-heritage-dark"
            :style="{ backgroundColor: tierColor }"
          >
            {{ hotel.hhi }}
          </div>
          <TierBadge v-if="tier" :tier="tier" size="sm" />
        </div>

        <p class="text-heritage-text-secondary text-sm leading-relaxed">
          {{ excerpt }}
        </p>

        <span class="text-heritage-gold text-sm font-medium group-hover:translate-x-1 transition-transform duration-200 inline-flex items-center gap-1">
          View full profile →
        </span>
      </div>
    </div>
  </RouterLink>
</template>
