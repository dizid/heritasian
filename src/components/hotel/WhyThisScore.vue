<script setup lang="ts">
import type { Hotel, ScoreDimension } from '@/types'
import { DIMENSION_MAP, PILLAR_META } from '@/lib/scoring'
import ScoreBar from '@/components/shared/ScoreBar.vue'
import EvidenceItem from '@/components/hotel/EvidenceItem.vue'

const props = defineProps<{ hotel: Hotel }>()

// Group dimensions by pillar
const pillars = (['ha', 'ge', 'oe'] as const).map(pillarKey => {
  const meta = PILLAR_META[pillarKey]
  const dimensions = (Object.entries(DIMENSION_MAP) as [ScoreDimension, typeof DIMENSION_MAP[ScoreDimension]][])
    .filter(([, d]) => d.pillar === pillarKey)
    .map(([key, d]) => ({
      key,
      label: d.label,
      weight: d.weight,
      score: d.getScore(props.hotel.scores),
      evidence: props.hotel.evidence[key] ?? [],
    }))

  return {
    key: pillarKey,
    label: meta.label,
    weight: meta.weight,
    color: meta.color,
    score: props.hotel.pillarScores[pillarKey],
    dimensions,
  }
})
</script>

<template>
  <div class="mb-10">
    <div class="text-center mb-8">
      <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-2">Transparency</p>
      <h2 class="font-heading text-2xl md:text-3xl font-bold text-heritage-text">
        Why This Score
      </h2>
      <p class="text-heritage-text-secondary text-sm mt-2 max-w-lg mx-auto">
        How each of the nine Heritage Hotel Index dimensions was evaluated.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="pillar in pillars"
        :key="pillar.key"
        class="glass rounded-xl overflow-hidden"
        :style="{ borderLeft: `3px solid ${pillar.color}` }"
      >
        <!-- Pillar header -->
        <div class="p-4 pb-3 border-b border-heritage-border">
          <div class="flex items-center justify-between">
            <h3 class="font-heading text-sm font-semibold text-heritage-text">
              {{ pillar.label }}
            </h3>
            <span class="text-xs text-heritage-text-secondary">{{ pillar.weight }}% of HHI</span>
          </div>
          <div class="flex items-baseline gap-2 mt-1">
            <span
              class="font-heading text-lg font-bold tabular-nums"
              :style="{ color: pillar.color }"
            >
              {{ pillar.score.toFixed(1) }}
            </span>
            <span class="text-xs text-heritage-text-secondary">/100</span>
          </div>
        </div>

        <!-- Sub-metric rows -->
        <div class="p-4 flex flex-col gap-5">
          <div v-for="dim in pillar.dimensions" :key="dim.key">
            <!-- Score bar + weight -->
            <div class="flex items-center gap-2">
              <div class="flex-1">
                <ScoreBar :label="dim.label" :score="dim.score" :color="pillar.color" />
              </div>
              <span class="text-[10px] text-heritage-text-secondary/60 tabular-nums shrink-0 w-6 text-right">
                {{ dim.weight }}%
              </span>
            </div>

            <!-- Rating rationale (first evidence item that has one) -->
            <p
              v-if="dim.evidence.find(e => e.ratingRationale)"
              class="text-xs text-heritage-text-secondary leading-relaxed mt-2"
            >
              {{ dim.evidence.find(e => e.ratingRationale)!.ratingRationale }}
            </p>

            <!-- Evidence items -->
            <div v-if="dim.evidence.some(e => e.excerpt || e.sourceUrl)" class="mt-2 flex flex-col gap-2">
              <EvidenceItem
                v-for="(ev, i) in dim.evidence.filter(e => e.excerpt || e.sourceUrl)"
                :key="i"
                :excerpt="ev.excerpt"
                :notes="ev.notes"
                :source-url="ev.sourceUrl"
              />
            </div>

            <!-- Empty state -->
            <p
              v-else-if="dim.evidence.length === 0"
              class="text-xs text-heritage-text-secondary/50 italic mt-2"
            >
              Review pending
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
