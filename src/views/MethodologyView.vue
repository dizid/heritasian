<script setup lang="ts">
import { TIER_CONFIG } from '@/types'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Our Methodology',
  description: 'How the Heritage Hotel Index (HHI) works: a transparent, weighted scoring system across 9 dimensions measuring heritage authenticity, guest experience, and operational excellence.',
  path: '/methodology',
})

const pillars = [
  {
    name: 'Heritage & Authenticity',
    weight: '40%',
    weightNum: 40,
    color: '#c9a96e',
    icon: '🏛️',
    description:
      'The foundation of the HHI. A heritage hotel must first and foremost be demonstrably rooted in history — through its structure, its story, and its connection to local culture.',
    subScores: [
      {
        name: 'Historical Significance',
        weight: '15%',
        desc: 'Age of the property, historical events associated with it, former occupants of note, and recognition by national or international heritage registers.',
      },
      {
        name: 'Architectural Integrity',
        weight: '15%',
        desc: 'Degree to which original architectural features are preserved, quality of restoration work, and how faithfully the building reflects its original period.',
      },
      {
        name: 'Cultural Immersion',
        weight: '10%',
        desc: 'Integration of local culture, cuisine, arts, and customs into the guest experience — not as performance, but as authentic expression.',
      },
    ],
  },
  {
    name: 'Guest Experience',
    weight: '35%',
    weightNum: 35,
    color: '#a8b4a0',
    icon: '✨',
    description:
      'Heritage alone does not make a great hotel. The guest experience pillar ensures that historical credentials are matched by genuine hospitality, storytelling, and modern quality.',
    subScores: [
      {
        name: 'Authentic Experience Score',
        weight: '15%',
        desc: 'How effectively the property communicates its history to guests: guided tours, in-room materials, dining concepts tied to the building\'s past, and curated itineraries.',
      },
      {
        name: 'Reputation Score',
        weight: '12%',
        desc: 'Aggregated guest ratings from Google, TripAdvisor, and Booking.com, weighted for review volume and recency.',
      },
      {
        name: 'Service Quality',
        weight: '8%',
        desc: 'Staff knowledge of the property\'s history, attentiveness, and the degree to which service reflects local hospitality traditions.',
      },
    ],
  },
  {
    name: 'Operational Excellence',
    weight: '25%',
    weightNum: 25,
    color: '#8b9fc5',
    icon: '⚙️',
    description:
      'A heritage hotel must balance preservation with practicality. This pillar assesses how well properties maintain their buildings while delivering modern comforts at fair value.',
    subScores: [
      {
        name: 'Conservation Commitment',
        weight: '10%',
        desc: 'Evidence of ongoing investment in preservation — partnerships with heritage bodies, materials used in restoration, and long-term maintenance plans.',
      },
      {
        name: 'Modern Comforts',
        weight: '8%',
        desc: 'Quality of bedding, climate control, connectivity, and amenities — assessed without penalising properties for the constraints of historic buildings.',
      },
      {
        name: 'Value Positioning',
        weight: '7%',
        desc: 'Whether pricing is appropriate relative to the quality of heritage, experience, and service delivered.',
      },
    ],
  },
]

const tiers = Object.entries(TIER_CONFIG).map(([key, val]) => ({
  key,
  ...val,
}))

const dataSources = [
  { name: 'Google Reviews', icon: '⭐', desc: 'Aggregated guest ratings and review analysis' },
  { name: 'TripAdvisor', icon: '🦉', desc: 'Traveller opinions and property rankings' },
  { name: 'Booking.com', icon: '🏨', desc: 'Guest scores and accommodation data' },
  { name: 'Heritage Registries', icon: '📜', desc: 'UNESCO, national and local heritage lists' },
  { name: 'Expert Assessment', icon: '🔍', desc: 'On-site evaluation and editorial research' },
]
</script>

<template>
  <div class="min-h-screen pt-20">
    <!-- Hero -->
    <div class="relative overflow-hidden py-20">
      <div
        class="absolute inset-0 opacity-5"
        style="background: radial-gradient(ellipse at 50% 0%, #c9a96e, transparent 60%)"
      />
      <div class="relative max-w-4xl mx-auto px-4 text-center">
        <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-4">The Framework</p>
        <h1 class="font-heading text-4xl md:text-5xl font-bold text-heritage-text mb-6">
          Our Methodology
        </h1>
        <p class="text-heritage-text-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          The Heritage Hotel Index (HHI) was created to address a gap in travel media: no rigorous,
          transparent ranking existed for historically significant hotels across Southeast Asia.
          We built one.
        </p>
      </div>
    </div>

    <div class="max-w-5xl mx-auto px-4 pb-20">
      <!-- Why section -->
      <div class="glass rounded-2xl p-8 border-heritage-border mb-16">
        <h2 class="font-heading text-2xl font-bold text-heritage-text mb-4">Why the HHI Exists</h2>
        <div class="flex flex-col gap-3 text-heritage-text-secondary text-sm leading-relaxed">
          <p>
            Southeast Asia is home to some of the world's most storied hotels — former colonial
            residences, palatial manor houses, ancient trading posts reimagined as places of rest.
            Yet rankings on major travel platforms treat a 200-year-old Penang shophouse the same as
            a modern boutique hotel.
          </p>
          <p>
            The HHI applies a structured, weighted scoring system that specifically rewards historical
            depth, architectural authenticity, and cultural integrity — while still demanding
            genuine guest satisfaction and responsible stewardship of heritage buildings.
          </p>
        </div>
      </div>

      <!-- Pillars -->
      <div class="mb-16">
        <div class="text-center mb-10">
          <h2 class="font-heading text-3xl font-bold text-heritage-text">The Three Pillars</h2>
          <p class="text-heritage-text-secondary text-sm mt-2">
            Each hotel is scored across 9 sub-dimensions grouped into 3 weighted pillars.
          </p>
        </div>

        <div class="flex flex-col gap-10">
          <div
            v-for="pillar in pillars"
            :key="pillar.name"
            class="glass rounded-2xl overflow-hidden border-heritage-border"
          >
            <!-- Pillar header -->
            <div
              class="px-6 py-5 flex items-center justify-between"
              :style="{ borderLeft: `4px solid ${pillar.color}` }"
            >
              <div class="flex items-center gap-3">
                <span class="text-2xl">{{ pillar.icon }}</span>
                <div>
                  <h3 class="font-heading text-xl font-bold text-heritage-text">{{ pillar.name }}</h3>
                  <p class="text-xs text-heritage-text-secondary mt-0.5">{{ pillar.description }}</p>
                </div>
              </div>
              <div class="shrink-0 text-right">
                <span
                  class="font-heading text-3xl font-bold"
                  :style="{ color: pillar.color }"
                >
                  {{ pillar.weight }}
                </span>
                <p class="text-xs text-heritage-text-secondary">of total score</p>
              </div>
            </div>

            <!-- Sub-scores -->
            <div class="divide-y divide-heritage-border">
              <div
                v-for="sub in pillar.subScores"
                :key="sub.name"
                class="px-6 py-4 flex flex-col sm:flex-row sm:items-start gap-2"
              >
                <div class="flex items-center gap-2 shrink-0 sm:w-64">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0"
                    :style="{ backgroundColor: pillar.color }"
                  />
                  <span class="text-sm font-medium text-heritage-text">{{ sub.name }}</span>
                  <span
                    class="text-xs font-semibold ml-auto sm:ml-0"
                    :style="{ color: pillar.color }"
                  >
                    {{ sub.weight }}
                  </span>
                </div>
                <p class="text-xs text-heritage-text-secondary leading-relaxed sm:flex-1">
                  {{ sub.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tier definitions -->
      <div class="mb-16">
        <div class="text-center mb-8">
          <h2 class="font-heading text-3xl font-bold text-heritage-text">Tier Definitions</h2>
          <p class="text-heritage-text-secondary text-sm mt-2">
            HHI scores translate into four tiers, each representing a distinct level of heritage distinction.
          </p>
        </div>

        <div class="glass rounded-2xl overflow-hidden border-heritage-border">
          <div class="divide-y divide-heritage-border">
            <div
              v-for="tier in tiers"
              :key="tier.key"
              class="flex items-center gap-4 px-6 py-5"
            >
              <div
                class="w-3 h-3 rounded-full shrink-0"
                :style="{ backgroundColor: tier.color }"
              />
              <div class="flex-1">
                <span class="text-sm font-semibold" :style="{ color: tier.color }">
                  {{ tier.label }}
                </span>
                <span class="text-xs text-heritage-text-secondary ml-2">
                  Score: {{ tier.min }}–{{ tier.max }}
                </span>
              </div>
              <div class="text-right">
                <div
                  class="h-1.5 rounded-full bg-heritage-surface-light overflow-hidden"
                  style="width: 120px"
                >
                  <div
                    class="h-full rounded-full"
                    :style="{
                      width: `${tier.max}%`,
                      backgroundColor: tier.color,
                      opacity: 0.7,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data sources -->
      <div class="mb-16">
        <div class="text-center mb-8">
          <h2 class="font-heading text-3xl font-bold text-heritage-text">Data Sources</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="source in dataSources"
            :key="source.name"
            class="glass-light rounded-xl p-5 border border-heritage-border flex items-start gap-3"
          >
            <span class="text-2xl shrink-0">{{ source.icon }}</span>
            <div>
              <p class="text-sm font-semibold text-heritage-text">{{ source.name }}</p>
              <p class="text-xs text-heritage-text-secondary mt-1">{{ source.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Transparency note -->
      <div
        class="glass rounded-2xl p-8 border-heritage-border text-center"
        style="border-color: rgba(201, 169, 110, 0.3)"
      >
        <div class="text-3xl mb-4">🔒</div>
        <h2 class="font-heading text-xl font-bold text-heritage-text mb-3">A Note on Independence</h2>
        <p class="text-heritage-text-secondary text-sm leading-relaxed max-w-2xl mx-auto">
          Heritasian accepts no payment from hotels, hotel groups, or tourism boards in exchange
          for ratings, rankings, or inclusion in the index. All scores are calculated from the
          methodology described above and are updated periodically as new data becomes available.
          We believe transparency is not optional — it is the basis of trust.
        </p>
      </div>
    </div>
  </div>
</template>
