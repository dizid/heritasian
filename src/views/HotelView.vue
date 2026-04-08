<script setup lang="ts">
import { ref, computed, onMounted, onServerPrefetch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { COUNTRIES } from '@/types'
import { useHotels } from '@/composables/useHotels'
import TierBadge from '@/components/shared/TierBadge.vue'
import HotelScoreBadge from '@/components/hotel/HotelScoreBadge.vue'
import HotelTimeline from '@/components/hotel/HotelTimeline.vue'
import { useHead } from '@unhead/vue'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { getHotelBySlug } = useHotels()

const hotel = ref<Awaited<ReturnType<typeof getHotelBySlug>>>(null)
const loading = ref(true)
const notFound = ref(false)

onServerPrefetch(async () => {
  hotel.value = await getHotelBySlug(slug.value)
  if (!hotel.value) notFound.value = true
  loading.value = false
})

onMounted(async () => {
  try {
    hotel.value = await getHotelBySlug(slug.value)
    if (!hotel.value) notFound.value = true
  } finally {
    loading.value = false
  }
})

const country = computed(() =>
  hotel.value ? COUNTRIES.find(c => c.code === hotel.value!.country) : null
)

// Dynamic SEO meta tags
useSeo(() => {
  if (!hotel.value) {
    return { title: 'Hotel Details', path: `/hotel/${slug.value}` }
  }
  const h = hotel.value
  const countryName = country.value?.name ?? ''
  return {
    title: `${h.name} — ${h.city}, ${countryName}`,
    description: `${h.name} in ${h.city}, ${countryName}. Heritage Hotel Index score: ${h.hhi}/100 (${h.tier}). Built ${h.yearBuilt}. ${h.description.slice(0, 120)}...`,
    path: `/hotel/${h.slug}`,
    ogImage: h.imageUrl,
  }
})

// Hotel structured data (LodgingBusiness)
// Note: No aggregateRating — HHI is a proprietary index score, not user-aggregated reviews.
// Google warns against using aggregateRating for proprietary ratings.
useHead(() => {
  if (!hotel.value) return {}
  const h = hotel.value
  const countryName = country.value?.name ?? ''
  return {
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          name: h.name,
          url: h.websiteUrl,
          image: h.imageUrl,
          description: h.description,
          address: {
            '@type': 'PostalAddress',
            addressLocality: h.city,
            addressCountry: countryName,
          },
          foundingDate: String(h.yearBuilt),
          priceRange: h.priceRange,
        }),
      },
    ],
  }
})

</script>

<template>
  <!-- Loading state -->
  <div v-if="loading" class="min-h-screen pt-20 flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 rounded-full border-2 border-heritage-gold border-t-transparent animate-spin" />
      <p class="text-heritage-text-secondary text-sm">Loading hotel details...</p>
    </div>
  </div>

  <!-- 404 state -->
  <div v-else-if="notFound" class="min-h-screen pt-20 flex items-center justify-center">
    <div class="text-center max-w-md mx-auto px-4">
      <div class="text-5xl mb-6">🏚️</div>
      <h1 class="font-heading text-3xl font-bold text-heritage-text mb-3">Hotel Not Found</h1>
      <p class="text-heritage-text-secondary text-sm mb-8">
        This hotel doesn't exist in our index. It may have been removed or the URL is incorrect.
      </p>
      <RouterLink
        to="/rankings"
        class="inline-flex items-center gap-2 text-heritage-gold border border-heritage-border hover:border-heritage-gold/40 px-6 py-3 rounded-xl text-sm transition-colors duration-200"
      >
        ← Back to Rankings
      </RouterLink>
    </div>
  </div>

  <!-- Hotel content -->
  <div v-else-if="hotel" class="min-h-screen">
    <!-- Hero Banner -->
    <div class="relative h-[55vh] min-h-[380px] overflow-hidden">
      <img
        v-if="hotel.imageUrl"
        :src="hotel.imageUrl"
        :alt="hotel.name"
        class="w-full h-full object-cover"
        @error="(e: Event) => (e.target as HTMLImageElement).style.display = 'none'"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-heritage-surface-light via-heritage-dark/80 to-heritage-dark" />
      <!-- Gradient overlays -->
      <div class="absolute inset-0 bg-gradient-to-t from-heritage-dark via-heritage-dark/50 to-heritage-dark/20" />
      <div class="absolute inset-0 bg-gradient-to-r from-heritage-dark/40 to-transparent" />

      <!-- Hero content -->
      <div class="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-10">
        <RouterLink
          to="/rankings"
          class="inline-flex items-center gap-1.5 text-heritage-text-secondary hover:text-heritage-gold text-xs mb-4 transition-colors duration-200"
        >
          ← Back to Rankings
        </RouterLink>
        <h1 class="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-heritage-text mb-2 leading-tight">
          {{ hotel.name }}
        </h1>
        <p
          v-if="hotel.tagline"
          class="font-heading italic text-heritage-gold/90 text-base sm:text-lg md:text-xl leading-snug mb-3 max-w-2xl"
        >
          {{ hotel.tagline }}
        </p>
        <div class="flex flex-wrap items-center gap-3 text-sm text-heritage-text-secondary">
          <span v-if="country">{{ country.flag }} {{ hotel.city }}, {{ country.name }}</span>
          <span class="text-heritage-border">·</span>
          <span>Est. {{ hotel.yearBuilt }}</span>
          <span class="text-heritage-border">·</span>
          <span>{{ hotel.architecturalStyle }}</span>
          <span class="text-heritage-border">·</span>
          <span>{{ hotel.priceRange }}</span>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-7xl mx-auto px-4 py-10">
      <!-- Score section -->
      <div class="glass rounded-2xl p-6 md:p-8 border-heritage-border mb-10">
        <div class="flex flex-col items-center gap-4">
          <HotelScoreBadge :score="hotel.hhi" :tier="hotel.tier" size="lg" />
          <TierBadge :tier="hotel.tier" size="md" />
        </div>
      </div>

      <!-- Description + highlights -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <!-- Description -->
        <div class="lg:col-span-2">
          <h2 class="font-heading text-2xl font-bold text-heritage-text mb-4">About the Property</h2>
          <p class="text-heritage-text-secondary leading-relaxed text-sm md:text-base">
            {{ hotel.description }}
          </p>

          <!-- Original purpose -->
          <div class="mt-6 flex items-start gap-3 glass-light rounded-xl p-4">
            <span class="text-2xl shrink-0">🏛️</span>
            <div>
              <p class="text-xs text-heritage-text-secondary uppercase tracking-widest mb-1">Original Purpose</p>
              <p class="text-heritage-text text-sm">{{ hotel.originalPurpose }}</p>
            </div>
          </div>
        </div>

        <!-- Highlights -->
        <div>
          <h2 class="font-heading text-2xl font-bold text-heritage-text mb-4">Highlights</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="highlight in hotel.highlights"
              :key="highlight"
              class="glass-light px-3 py-1.5 rounded-full text-xs text-heritage-text-secondary border border-heritage-border"
            >
              {{ highlight }}
            </span>
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="mb-10" v-if="hotel.timeline && hotel.timeline.length > 0">
        <h2 class="font-heading text-2xl font-bold text-heritage-text mb-6">History Timeline</h2>
        <div class="glass rounded-xl p-6 border-heritage-border">
          <HotelTimeline :events="hotel.timeline" />
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center py-10">
        <a
          :href="hotel.websiteUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-heritage-dark transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-heritage-gold/20"
          style="background: linear-gradient(135deg, #dcc599 0%, #c9a96e 50%, #b8944f 100%)"
        >
          Visit Official Website
          <span class="text-sm">↗</span>
        </a>
      </div>
    </div>
  </div>
</template>
