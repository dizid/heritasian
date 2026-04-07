<script setup lang="ts">
import { ref, computed, onMounted, onServerPrefetch } from 'vue'
import { RouterLink } from 'vue-router'
import { COUNTRIES, TIER_CONFIG } from '@/types'
import type { Hotel } from '@/types'
import { useHotels } from '@/composables/useHotels'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Heritage Hotels',
  description: "Full league table of Southeast Asia's heritage hotels with all Heritage Hotel Index scores, pillar breakdowns, and 9 sub-metric ratings.",
  path: '/hotels',
})

const { hotels, loading, fetchHotels } = useHotels()

onServerPrefetch(() => fetchHotels())
onMounted(() => { fetchHotels() })

// Sort state
type SortKey = 'hhi' | 'ha' | 'ge' | 'oe' | 'hs' | 'ai' | 'ci' | 'ae' | 'rs' | 'sq' | 'cc' | 'mc' | 'vp' | 'name' | 'year'
const sortKey = ref<SortKey>('hhi')
const sortDir = ref<'asc' | 'desc'>('desc')

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
  } else {
    sortKey.value = key
    sortDir.value = key === 'name' ? 'asc' : 'desc'
  }
}

// Extract a score value from a hotel by sort key
function getVal(h: Hotel, key: SortKey): number | string {
  const s = h.scores
  const map: Record<string, number | string> = {
    hhi: h.hhi,
    ha: h.pillarScores.ha,
    ge: h.pillarScores.ge,
    oe: h.pillarScores.oe,
    hs: s.heritageAuthenticity.historicalSignificance,
    ai: s.heritageAuthenticity.architecturalIntegrity,
    ci: s.heritageAuthenticity.culturalImmersion,
    ae: s.guestExperience.authenticExperience,
    rs: s.guestExperience.reputationScore,
    sq: s.guestExperience.serviceQuality,
    cc: s.operationalExcellence.conservationCommitment,
    mc: s.operationalExcellence.modernComforts,
    vp: s.operationalExcellence.valuePositioning,
    name: h.name,
    year: h.yearBuilt,
  }
  return map[key]
}

const sortedHotels = computed(() => {
  const list = [...hotels.value]
  list.sort((a, b) => {
    const va = getVal(a, sortKey.value)
    const vb = getVal(b, sortKey.value)
    if (typeof va === 'string') {
      return sortDir.value === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
    }
    return sortDir.value === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
  })
  return list
})

// Score color based on value
function scoreColor(val: number): string {
  if (val >= 90) return '#c9a96e'
  if (val >= 80) return '#dcc599'
  if (val >= 70) return 'var(--color-heritage-text)'
  return 'var(--color-heritage-text-secondary)'
}

// Column definitions
const columns: Array<{ key: SortKey; label: string; title: string; pillar?: string }> = [
  { key: 'hhi', label: 'HHI', title: 'Heritage Hotel Index (overall)' },
  { key: 'ha', label: 'H&A', title: 'Heritage & Authenticity pillar (40%)', pillar: 'Heritage & Authenticity (40%)' },
  { key: 'hs', label: 'HS', title: 'Historical Significance (15%)' },
  { key: 'ai', label: 'AI', title: 'Architectural Integrity (15%)' },
  { key: 'ci', label: 'CI', title: 'Cultural Immersion (10%)' },
  { key: 'ge', label: 'GE', title: 'Guest Experience pillar (35%)', pillar: 'Guest Experience (35%)' },
  { key: 'ae', label: 'AE', title: 'Authentic Experience (15%)' },
  { key: 'rs', label: 'RS', title: 'Reputation Score (12%)' },
  { key: 'sq', label: 'SQ', title: 'Service Quality (8%)' },
  { key: 'oe', label: 'OE', title: 'Operational Excellence pillar (25%)', pillar: 'Operational Excellence (25%)' },
  { key: 'cc', label: 'CC', title: 'Conservation Commitment (10%)' },
  { key: 'mc', label: 'MC', title: 'Modern Comforts (8%)' },
  { key: 'vp', label: 'VP', title: 'Value Positioning (7%)' },
]

// Legend visibility
const showLegend = ref(false)
</script>

<template>
  <div class="min-h-screen pt-20">
    <div class="max-w-[90rem] mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-4">
        <h1 class="font-heading text-2xl md:text-3xl font-bold text-heritage-text mb-1">
          Heritage Hotel League Table
        </h1>
        <p class="text-heritage-text-secondary text-sm">
          {{ hotels.length }} properties &middot; Click any column to sort &middot;
          <button
            class="text-heritage-gold hover:underline"
            @click="showLegend = !showLegend"
          >
            {{ showLegend ? 'Hide' : 'Show' }} legend
          </button>
        </p>
      </div>

      <!-- Legend + Scoring Explanation -->
      <Transition name="fade">
        <div v-if="showLegend" class="glass rounded-xl p-4 mb-4 border-heritage-border text-xs text-heritage-text-secondary">
          <!-- How HHI works -->
          <div class="mb-4 pb-4 border-b border-heritage-border">
            <p class="font-semibold text-heritage-text text-sm mb-2">How the Heritage Hotel Index (HHI) works</p>
            <p class="leading-relaxed mb-2">
              Each hotel is scored 0–100 across <strong>9 dimensions</strong>, grouped into <strong>3 pillars</strong>.
              Each dimension has a weight reflecting its importance. The <strong>HHI</strong> is the weighted sum of all 9 scores —
              a single number that captures heritage significance, guest quality, and operational standards.
            </p>
            <p class="leading-relaxed mb-2">
              <strong>Pillar scores</strong> (H&A, GE, OE) are the weighted average of their sub-dimensions, scaled to 0–100.
              A hotel scoring 90 in Heritage & Authenticity but 60 in Operational Excellence has a strong heritage story
              but room to improve its modern guest services.
            </p>
            <p class="leading-relaxed">
              <strong>Tiers:</strong>
              <span style="color: #c9a96e"> Landmark (85–100)</span> ·
              <span style="color: #b5c1ad"> Distinguished (70–84)</span> ·
              <span style="color: #a3b3d4"> Notable (55–69)</span> ·
              <span style="color: #c9a5a5"> Emerging (40–54)</span>
            </p>
          </div>

          <!-- Column key -->
          <p class="font-semibold text-heritage-text text-sm mb-2">Column key</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p class="font-semibold text-heritage-gold mb-1">Heritage & Authenticity (40%)</p>
              <p><strong>HS</strong> — Historical Significance (15%)</p>
              <p><strong>AI</strong> — Architectural Integrity (15%)</p>
              <p><strong>CI</strong> — Cultural Immersion (10%)</p>
            </div>
            <div>
              <p class="font-semibold text-heritage-gold mb-1">Guest Experience (35%)</p>
              <p><strong>AE</strong> — Authentic Experience (15%)</p>
              <p><strong>RS</strong> — Reputation Score (12%)</p>
              <p><strong>SQ</strong> — Service Quality (8%)</p>
            </div>
            <div>
              <p class="font-semibold text-heritage-gold mb-1">Operational Excellence (25%)</p>
              <p><strong>CC</strong> — Conservation Commitment (10%)</p>
              <p><strong>MC</strong> — Modern Comforts (8%)</p>
              <p><strong>VP</strong> — Value Positioning (7%)</p>
            </div>
          </div>
          <div class="mt-3 pt-3 border-t border-heritage-border flex flex-wrap items-center gap-4">
            <span><span class="inline-block w-3 h-3 rounded-sm mr-1" style="background: #c9a96e" /> 90+ Elite</span>
            <span><span class="inline-block w-3 h-3 rounded-sm mr-1" style="background: #dcc599" /> 80–89 Strong</span>
            <span><span class="inline-block w-3 h-3 rounded-sm mr-1" style="background: var(--color-heritage-text)" /> 70–79 Good</span>
            <span><span class="inline-block w-3 h-3 rounded-sm mr-1" style="background: var(--color-heritage-text-secondary)" /> &lt;70 Developing</span>
            <RouterLink to="/methodology" class="ml-auto text-heritage-gold hover:underline">
              Full methodology &rarr;
            </RouterLink>
          </div>
        </div>
      </Transition>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col gap-1" role="status" aria-label="Loading hotels">
        <div v-for="i in 8" :key="i" class="h-10 rounded animate-pulse bg-heritage-surface-light" aria-hidden="true" />
        <span class="sr-only">Loading hotels...</span>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto rounded-xl glass border-heritage-border">
        <table class="w-full text-xs">
          <!-- Column group headers -->
          <thead>
            <tr class="hidden md:table-row border-b border-heritage-border">
              <th colspan="3" class="px-2 py-1.5" />
              <th colspan="4" class="px-2 py-1.5 text-center text-[10px] font-normal uppercase tracking-widest" style="color: #c9a96e">Heritage &amp; Auth. (40%)</th>
              <th colspan="4" class="px-2 py-1.5 text-center text-[10px] font-normal uppercase tracking-widest" style="color: #b5c1ad">Guest Exp. (35%)</th>
              <th colspan="4" class="px-2 py-1.5 text-center text-[10px] font-normal uppercase tracking-widest" style="color: #a3b3d4">Oper. Exc. (25%)</th>
              <th class="px-2 py-1.5" />
            </tr>
            <!-- Sort headers -->
            <tr class="border-b border-heritage-border">
              <th class="w-8 px-2 py-2 text-left text-[10px] text-heritage-text-secondary uppercase tracking-widest">#</th>
              <th class="px-2 py-2 text-left text-[10px] text-heritage-text-secondary uppercase tracking-widest sticky left-0 bg-heritage-surface z-10 min-w-[140px]">
                <button class="hover:text-heritage-gold" :class="sortKey === 'name' ? 'text-heritage-gold' : ''" @click="toggleSort('name')">
                  Hotel {{ sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : '' }}
                </button>
              </th>
              <th
                v-for="col in columns"
                :key="col.key"
                class="px-2 py-2 text-right text-[10px] uppercase tracking-widest cursor-pointer select-none whitespace-nowrap"
                :class="[
                  sortKey === col.key ? 'text-heritage-gold' : 'text-heritage-text-secondary',
                  col.key === 'ha' || col.key === 'ge' || col.key === 'oe' || col.key === 'hhi' ? 'font-semibold' : 'font-normal',
                  col.key !== 'hhi' ? 'hidden md:table-cell' : ''
                ]"
                :title="col.title"
                @click="toggleSort(col.key)"
              >
                {{ col.label }}
                <span v-if="sortKey === col.key">{{ sortDir === 'asc' ? '↑' : '↓' }}</span>
              </th>
              <th class="hidden md:table-cell px-2 py-2 text-right text-[10px] text-heritage-text-secondary uppercase tracking-widest">Tier</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(hotel, index) in sortedHotels"
              :key="hotel.id"
              class="border-b border-heritage-border/30 hover:bg-heritage-surface-light transition-colors duration-150 cursor-pointer"
              @click="$router.push(`/hotel/${hotel.slug}`)"
            >
              <!-- Rank -->
              <td class="px-2 py-2 tabular-nums font-heading font-bold text-sm"
                :style="{ color: index < 3 ? '#c9a96e' : 'var(--color-heritage-text-secondary)' }">
                {{ index + 1 }}
              </td>

              <!-- Hotel name (sticky on mobile) -->
              <td class="px-2 py-2 sticky left-0 bg-heritage-surface z-10">
                <RouterLink :to="`/hotel/${hotel.slug}`" class="hover:text-heritage-gold transition-colors" @click.stop>
                  <span class="text-sm font-medium text-heritage-text block truncate max-w-[200px]">{{ hotel.name }}</span>
                  <span class="text-[10px] text-heritage-text-secondary block">
                    {{ COUNTRIES.find(c => c.code === hotel.country)?.flag }}
                    {{ hotel.city }} · {{ hotel.yearBuilt }}
                  </span>
                </RouterLink>
              </td>

              <!-- HHI -->
              <td class="px-2 py-2 text-right tabular-nums font-heading font-bold text-sm"
                :style="{ color: TIER_CONFIG[hotel.tier].color }">
                {{ hotel.hhi.toFixed(1) }}
              </td>

              <!-- H&A pillar -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums font-semibold" :style="{ color: scoreColor(hotel.pillarScores.ha) }">
                {{ hotel.pillarScores.ha.toFixed(1) }}
              </td>
              <!-- HS -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.heritageAuthenticity.historicalSignificance) }">
                {{ hotel.scores.heritageAuthenticity.historicalSignificance }}
              </td>
              <!-- AI -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.heritageAuthenticity.architecturalIntegrity) }">
                {{ hotel.scores.heritageAuthenticity.architecturalIntegrity }}
              </td>
              <!-- CI -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.heritageAuthenticity.culturalImmersion) }">
                {{ hotel.scores.heritageAuthenticity.culturalImmersion }}
              </td>

              <!-- GE pillar -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums font-semibold" :style="{ color: scoreColor(hotel.pillarScores.ge) }">
                {{ hotel.pillarScores.ge.toFixed(1) }}
              </td>
              <!-- AE -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.guestExperience.authenticExperience) }">
                {{ hotel.scores.guestExperience.authenticExperience }}
              </td>
              <!-- RS -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.guestExperience.reputationScore) }">
                {{ hotel.scores.guestExperience.reputationScore }}
              </td>
              <!-- SQ -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.guestExperience.serviceQuality) }">
                {{ hotel.scores.guestExperience.serviceQuality }}
              </td>

              <!-- OE pillar -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums font-semibold" :style="{ color: scoreColor(hotel.pillarScores.oe) }">
                {{ hotel.pillarScores.oe.toFixed(1) }}
              </td>
              <!-- CC -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.operationalExcellence.conservationCommitment) }">
                {{ hotel.scores.operationalExcellence.conservationCommitment }}
              </td>
              <!-- MC -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.operationalExcellence.modernComforts) }">
                {{ hotel.scores.operationalExcellence.modernComforts }}
              </td>
              <!-- VP -->
              <td class="hidden md:table-cell px-2 py-2 text-right tabular-nums" :style="{ color: scoreColor(hotel.scores.operationalExcellence.valuePositioning) }">
                {{ hotel.scores.operationalExcellence.valuePositioning }}
              </td>

              <!-- Tier -->
              <td class="hidden md:table-cell px-2 py-2 text-right text-[10px] font-medium uppercase tracking-wide whitespace-nowrap"
                :style="{ color: TIER_CONFIG[hotel.tier].color }">
                {{ hotel.tier }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
