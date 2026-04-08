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
        desc: 'Editorial review of public guest-rating signals, primarily Google Reviews. Automated aggregation via the Google Places API lands in our v2 release. TripAdvisor and Booking.com are not publicly available for reuse and are not cited as sources.',
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
  { name: 'ICOMOS Nara Framework', icon: '📖', desc: 'The 1994 international standard for cultural heritage authenticity — every HHI sub-metric is mapped to one of Nara\'s six authenticity dimensions.' },
  { name: 'Heritage Registries', icon: '📜', desc: 'UNESCO World Heritage list plus national and regional heritage registers.' },
  { name: 'Expert Assessment', icon: '🔍', desc: 'On-site evaluation and editorial research, with every score citing the specific source used.' },
  { name: 'Google Reviews', icon: '⭐', desc: 'Editorial review today, Google Places API aggregation planned for v2.' },
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

      <!-- ICOMOS Nara anchor -->
      <div class="glass rounded-2xl p-8 border-heritage-border mb-16">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-2xl">📖</span>
          <h2 class="font-heading text-2xl font-bold text-heritage-text">
            Anchored in the ICOMOS Nara Framework
          </h2>
        </div>
        <div class="flex flex-col gap-3 text-heritage-text-secondary text-sm leading-relaxed">
          <p>
            The HHI is not an invented framework. Our nine sub-metrics operationalise the six
            authenticity dimensions defined in the
            <a
              href="https://www.icomos.org/en/charters-and-texts/179-articles-en-francais/ressources/charters-and-standards/386-the-nara-document-on-authenticity-1994"
              target="_blank"
              rel="noopener"
              class="text-heritage-gold underline"
            >
              ICOMOS Nara Document on Authenticity (1994)
            </a>,
            the foundational international standard for assessing cultural heritage authenticity
            and the reference framework used by UNESCO for World Heritage evaluation.
          </p>
          <p>
            The six Nara dimensions map directly onto the HHI sub-scores:
          </p>
          <ul class="flex flex-col gap-1.5 pl-2 mt-1">
            <li>
              <span class="text-heritage-gold">›</span>
              <strong class="text-heritage-text">Form &amp; design</strong> +
              <strong class="text-heritage-text">materials &amp; substance</strong>
              → Architectural Integrity
            </li>
            <li>
              <span class="text-heritage-gold">›</span>
              <strong class="text-heritage-text">Location &amp; setting</strong>
              → Historical Significance
            </li>
            <li>
              <span class="text-heritage-gold">›</span>
              <strong class="text-heritage-text">Traditions &amp; techniques</strong>
              → Cultural Immersion
            </li>
            <li>
              <span class="text-heritage-gold">›</span>
              <strong class="text-heritage-text">Spirit &amp; feeling</strong>
              → Authentic Experience
            </li>
            <li>
              <span class="text-heritage-gold">›</span>
              <strong class="text-heritage-text">Use &amp; function</strong>
              → Conservation Commitment
            </li>
          </ul>
          <p class="mt-2">
            This mapping means every HHI score can be traced back to an established, internationally
            recognised framework — not an opaque editorial judgment. It is also the reason the HHI
            applies identically to a 1887 Penang shophouse, a Lisbon convent, and a Moroccan riad:
            the Nara Document was explicitly written to be culturally neutral.
          </p>
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
