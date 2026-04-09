<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Hotel } from '@/types'
import { COUNTRIES, TIER_CONFIG } from '@/types'
import TierBadge from '@/components/shared/TierBadge.vue'
import ScoreBar from '@/components/shared/ScoreBar.vue'

const props = defineProps<{
  hotel: Hotel
  rank?: number
}>()

const country = computed(() =>
  COUNTRIES.find(c => c.code === props.hotel.country)
)

const pillar = computed(() => props.hotel.pillarScores)
const tierConfig = computed(() => TIER_CONFIG[props.hotel.tier])
</script>

<template>
  <RouterLink
    :to="`/hotel/${hotel.slug}`"
    class="group block"
  >
    <article
      class="glass border-heritage-border rounded-xl overflow-hidden transition-all duration-300 hover:border-heritage-gold/40 hover:shadow-lg hover:shadow-heritage-gold/5 hover:-translate-y-0.5"
    >
      <div class="flex flex-col sm:flex-row">
        <!-- Rank number (mobile: top left overlay, desktop: left side) -->
        <div
          v-if="rank"
          class="hidden sm:flex items-center justify-center w-16 shrink-0 bg-heritage-surface-light border-r border-heritage-border"
        >
          <span
            class="font-heading font-bold text-2xl tabular-nums"
            :style="{ color: rank <= 3 ? '#c9a96e' : '#a89e90' }"
          >
            {{ rank }}
          </span>
        </div>

        <!-- Hotel image -->
        <div class="relative sm:w-48 md:w-56 shrink-0 h-44 sm:h-auto overflow-hidden">
          <!-- Mobile rank overlay -->
          <div
            v-if="rank"
            class="sm:hidden absolute top-2 left-2 z-10 glass rounded-lg w-9 h-9 flex items-center justify-center"
          >
            <span
              class="font-heading font-bold text-base tabular-nums leading-none"
              :style="{ color: rank <= 3 ? '#c9a96e' : '#a89e90' }"
            >
              {{ rank }}
            </span>
          </div>

          <img
            v-if="hotel.imageUrl"
            :src="hotel.imageUrl"
            :alt="hotel.name"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
          />
          <div v-else class="w-full h-full bg-gradient-to-br from-heritage-surface-light to-heritage-dark flex items-center justify-center">
            <span class="font-heading text-heritage-text-secondary/40 text-sm text-center px-4">{{ hotel.name }}</span>
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-heritage-dark/60 to-transparent" />
        </div>

        <!-- Content -->
        <div class="flex-1 p-4 md:p-5 flex flex-col gap-3">
          <!-- Header -->
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="font-heading text-base md:text-lg font-semibold text-heritage-text leading-tight group-hover:text-heritage-gold transition-colors duration-200">
                {{ hotel.name }}
              </h3>
              <p class="text-xs text-heritage-text-secondary mt-0.5 flex items-center gap-1.5">
                <span v-if="country">{{ country.flag }}</span>
                {{ hotel.city }}, {{ country?.name }}
                <span class="text-heritage-border">·</span>
                Est. {{ hotel.yearBuilt }}
              </p>
            </div>

            <!-- HHI score badge -->
            <div class="shrink-0 text-center">
              <div
                class="w-14 h-14 rounded-xl glass-light border flex flex-col items-center justify-center"
                :style="{ borderColor: tierConfig.color + '40' }"
              >
                <span
                  class="font-heading font-bold text-xl leading-none tabular-nums"
                  :style="{ color: tierConfig.color }"
                >
                  {{ hotel.hhi.toFixed(0) }}
                </span>
                <span class="text-[9px] text-heritage-text-secondary mt-0.5 leading-none">HHI</span>
              </div>
            </div>
          </div>

          <!-- Tier badge -->
          <div>
            <TierBadge :tier="hotel.tier" size="sm" />
          </div>

          <!-- Mini pillar score bars -->
          <div class="flex flex-col gap-2 mt-auto">
            <ScoreBar
              label="Heritage & Authenticity"
              :score="pillar.ha"
              color="#c9a96e"
            />
            <ScoreBar
              label="Guest Experience"
              :score="pillar.ge"
              color="#a8b4a0"
            />
            <ScoreBar
              label="Operational Excellence"
              :score="pillar.oe"
              color="#8b9fc5"
            />
          </div>
        </div>
      </div>
    </article>
  </RouterLink>
</template>
