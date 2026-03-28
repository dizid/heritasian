<script setup lang="ts">
import { computed, onMounted, onServerPrefetch } from 'vue'
import { RouterLink } from 'vue-router'
import { COUNTRIES } from '@/types'
import HotelCard from '@/components/hotel/HotelCard.vue'
import FeaturedHotel from '@/components/home/FeaturedHotel.vue'
import TrustStrip from '@/components/home/TrustStrip.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import SectionDivider from '@/components/shared/SectionDivider.vue'
import { useHotels } from '@/composables/useHotels'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: "Southeast Asia's Heritage Hotel Index",
  description: "The definitive guide to Southeast Asia's heritage hotels. Independently rated, historically significant, authentically experienced. Explore rankings across 9 countries.",
  path: '/',
})

const { hotels, loading, error, fetchHotels } = useHotels()

onServerPrefetch(() => fetchHotels())
onMounted(() => {
  fetchHotels()
})

const featuredHotel = computed(() => hotels.value[0] ?? null)
const topHotels = computed(() => hotels.value.slice(1, 4))

const pillars = [
  {
    icon: '🏛️',
    name: 'Heritage & Authenticity',
    weight: '40%',
    desc: 'Historical significance, architectural integrity, and cultural immersion.',
    subs: ['Historical Significance (15%)', 'Architectural Integrity (15%)', 'Cultural Immersion (10%)'],
  },
  {
    icon: '✨',
    name: 'Guest Experience',
    weight: '35%',
    desc: 'Authentic storytelling, verified reputation, and service excellence.',
    subs: ['Authentic Experience (15%)', 'Reputation Score (12%)', 'Service Quality (8%)'],
  },
  {
    icon: '⚙️',
    name: 'Operational Excellence',
    weight: '25%',
    desc: 'Conservation commitment, modern comforts, and value positioning.',
    subs: ['Conservation Commitment (10%)', 'Modern Comforts (8%)', 'Value Positioning (7%)'],
  },
]

// Count hotels per country from loaded data
function countryHotelCount(code: string): number {
  return hotels.value.filter(h => h.country === code).length
}

// Stats for hero section
const hotelCount = computed(() => hotels.value.length)
const countryCount = computed(() => new Set(hotels.value.map(h => h.country)).size)
</script>

<template>
  <!-- Hero Section -->
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background gradient -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-heritage-dark via-heritage-surface to-heritage-dark"
    />
    <!-- Decorative radial glow -->
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
      style="background: radial-gradient(circle, #c9a96e, transparent 70%)"
    />
    <!-- Subtle background texture -->
    <div
      class="absolute inset-0 opacity-[0.03]"
      style="background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(201,169,110,0.15) 35px, rgba(201,169,110,0.15) 36px)"
    />

    <div class="relative z-10 max-w-4xl mx-auto px-4 text-center py-24">
      <!-- Eyebrow -->
      <p class="animate-fade-up text-heritage-gold text-xs md:text-sm uppercase tracking-[0.3em] mb-6 font-medium">
        The Heritage Hotel Index
      </p>

      <!-- Main heading -->
      <h1
        class="animate-fade-up delay-100 font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-heritage-text leading-tight mb-6"
      >
        The Definitive Guide to<br />
        <span class="text-gold-gradient">Southeast Asia's</span><br />
        Heritage Hotels
      </h1>

      <!-- Subtitle -->
      <p class="animate-fade-up delay-200 text-heritage-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
        Every heritage hotel in Southeast Asia, independently scored across 9 dimensions.
        No sponsorships. No advertising.
      </p>

      <!-- Stats bar -->
      <div class="animate-fade-up delay-200 flex items-center justify-center gap-6 md:gap-8 mb-10 text-xs md:text-sm">
        <div class="flex flex-col items-center gap-1">
          <span class="text-heritage-gold font-heading font-bold text-lg md:text-xl tabular-nums">
            {{ loading ? '—' : hotelCount }}
          </span>
          <span class="text-heritage-text-secondary">Hotels Rated</span>
        </div>
        <div class="w-px h-8 bg-heritage-border" />
        <div class="flex flex-col items-center gap-1">
          <span class="text-heritage-gold font-heading font-bold text-lg md:text-xl tabular-nums">
            {{ loading ? '—' : (countryCount || 9) }}
          </span>
          <span class="text-heritage-text-secondary">Countries</span>
        </div>
        <div class="w-px h-8 bg-heritage-border" />
        <div class="flex flex-col items-center gap-1">
          <span class="text-heritage-gold font-heading font-bold text-lg md:text-xl">9</span>
          <span class="text-heritage-text-secondary">Dimensions</span>
        </div>
      </div>

      <!-- Dual CTAs -->
      <div class="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
        <RouterLink
          to="/rankings"
          class="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-heritage-dark transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-heritage-gold/20"
          style="background: linear-gradient(135deg, #dcc599 0%, #c9a96e 50%, #b8944f 100%)"
        >
          View Rankings
          <span class="text-lg">→</span>
        </RouterLink>
        <RouterLink
          to="/methodology"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-heritage-gold border border-heritage-gold/30 hover:border-heritage-gold/60 hover:bg-heritage-gold/5 transition-all duration-300"
        >
          Our Methodology
        </RouterLink>
      </div>

      <!-- Scroll hint -->
      <div class="mt-16 flex justify-center">
        <div class="flex flex-col items-center gap-2 opacity-40">
          <div class="w-px h-8 bg-heritage-gold animate-bounce" />
          <span class="text-xs text-heritage-text-secondary tracking-widest uppercase">Scroll</span>
        </div>
      </div>
    </div>
  </section>

  <SectionDivider />

  <!-- Featured Hotel Spotlight -->
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="text-center mb-10">
      <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-3">Editor's Pick</p>
      <h2 class="font-heading text-3xl md:text-4xl font-bold text-heritage-text">
        Featured Property
      </h2>
    </div>
    <FeaturedHotel :hotel="featuredHotel" :loading="loading" />
  </section>

  <SectionDivider />

  <!-- Top Rated Hotels Section -->
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="text-center mb-12">
      <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-3">Curated Selection</p>
      <h2 class="font-heading text-3xl md:text-4xl font-bold text-heritage-text">
        Top Rated Heritage Hotels
      </h2>
      <p class="text-heritage-text-secondary mt-3 text-sm max-w-xl mx-auto">
        The finest heritage properties in Southeast Asia, ranked by the Heritage Hotel Index.
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex flex-col gap-4">
      <div
        v-for="i in 3"
        :key="i"
        class="glass rounded-xl h-36 animate-pulse bg-heritage-surface-light border border-heritage-border"
      />
    </div>

    <!-- Error / empty state -->
    <div
      v-else-if="error || topHotels.length === 0"
      class="glass rounded-xl p-12 text-center border border-heritage-border"
    >
      <div class="text-3xl mb-4">🏛️</div>
      <p class="text-heritage-text-secondary text-sm mb-4">
        We're currently evaluating heritage properties across Southeast Asia.
      </p>
      <RouterLink
        to="/methodology"
        class="text-heritage-gold hover:text-heritage-gold-light text-sm font-medium transition-colors duration-200"
      >
        Learn how we rate them →
      </RouterLink>
    </div>

    <!-- Hotel cards -->
    <div v-else class="flex flex-col gap-4">
      <HotelCard
        v-for="(hotel, index) in topHotels"
        :key="hotel.id"
        :hotel="hotel"
        :rank="index + 2"
      />
    </div>

    <div class="text-center mt-10">
      <RouterLink
        to="/rankings"
        class="inline-flex items-center gap-2 text-heritage-gold hover:text-heritage-gold-light text-sm font-medium tracking-wide transition-colors duration-200 border border-heritage-border hover:border-heritage-gold/40 px-6 py-3 rounded-xl"
      >
        View All Rankings →
      </RouterLink>
    </div>
  </section>

  <SectionDivider />

  <!-- Trust Strip -->
  <TrustStrip />

  <!-- How We Rate Section -->
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="text-center mb-12">
      <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-3">A Rigorous Framework</p>
      <h2 class="font-heading text-3xl md:text-4xl font-bold text-heritage-text">
        The Heritage Hotel Index
      </h2>
      <p class="text-heritage-text-secondary mt-3 text-sm max-w-xl mx-auto">
        The HHI measures what truly makes a heritage hotel exceptional.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="pillar in pillars"
        :key="pillar.name"
        class="glass rounded-xl p-6 border-heritage-border flex flex-col gap-4 hover:border-heritage-gold/30 transition-colors duration-300"
      >
        <div class="flex items-start justify-between">
          <span class="text-3xl">{{ pillar.icon }}</span>
          <span class="text-heritage-gold font-heading text-xl font-bold">{{ pillar.weight }}</span>
        </div>

        <div>
          <h3 class="font-heading text-lg font-semibold text-heritage-text mb-2">
            {{ pillar.name }}
          </h3>
          <p class="text-heritage-text-secondary text-sm leading-relaxed">{{ pillar.desc }}</p>
        </div>

        <ul class="flex flex-col gap-1.5 mt-auto">
          <li
            v-for="sub in pillar.subs"
            :key="sub"
            class="text-xs text-heritage-text-secondary flex items-center gap-2"
          >
            <span class="w-1 h-1 rounded-full bg-heritage-gold shrink-0" />
            {{ sub }}
          </li>
        </ul>
      </div>
    </div>

    <div class="text-center mt-10">
      <RouterLink
        to="/methodology"
        class="inline-flex items-center gap-2 text-heritage-text-secondary hover:text-heritage-gold text-sm transition-colors duration-200"
      >
        Read full methodology →
      </RouterLink>
    </div>
  </section>

  <SectionDivider />

  <!-- Countries Grid Section -->
  <section class="max-w-7xl mx-auto px-4 py-16">
    <div class="text-center mb-12">
      <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-3">Explore by Destination</p>
      <h2 class="font-heading text-3xl md:text-4xl font-bold text-heritage-text">
        Nine Nations, One Index
      </h2>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <RouterLink
        v-for="country in COUNTRIES"
        :key="country.code"
        :to="`/rankings?country=${country.code}`"
        class="glass rounded-xl p-5 text-center flex flex-col items-center gap-2 border-heritage-border hover:border-heritage-gold/40 hover:-translate-y-0.5 transition-all duration-200 group"
      >
        <span class="text-3xl sm:text-4xl">{{ country.flag }}</span>
        <span class="text-xs font-medium text-heritage-text group-hover:text-heritage-gold transition-colors duration-200 leading-tight">
          {{ country.name }}
        </span>
        <span
          v-if="countryHotelCount(country.code) > 0"
          class="text-[10px] text-heritage-text-secondary"
        >
          {{ countryHotelCount(country.code) }} hotel{{ countryHotelCount(country.code) !== 1 ? 's' : '' }}
        </span>
        <span v-else class="text-[10px] text-heritage-text-secondary/50 italic">
          Coming soon
        </span>
      </RouterLink>
    </div>

    <div class="text-center mt-8">
      <a
        href="mailto:hello@heritasian.com?subject=Hotel%20Suggestion"
        class="text-heritage-text-secondary hover:text-heritage-gold text-xs transition-colors duration-200"
      >
        Know a heritage hotel we should evaluate? Let us know →
      </a>
    </div>
  </section>

  <SectionDivider />

  <!-- About Section -->
  <AboutSection />
</template>
