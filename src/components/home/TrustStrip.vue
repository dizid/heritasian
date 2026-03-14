<script setup lang="ts">
const signals = [
  { icon: '🛡️', label: 'Independent Ratings', desc: 'No hotel pays for inclusion or ranking' },
  { icon: '📊', label: '9 Scoring Dimensions', desc: 'Rigorous multi-pillar evaluation' },
  { icon: '🔍', label: '5 Data Sources', desc: 'Google, TripAdvisor, Booking & more' },
  { icon: '🔄', label: 'Updated Quarterly', desc: 'Living index, not a static list' },
]
</script>

<template>
  <section class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex gap-4 overflow-x-auto pb-2 md:pb-0 md:grid md:grid-cols-4 md:overflow-visible snap-x snap-mandatory">
      <div
        v-for="signal in signals"
        :key="signal.label"
        class="glass-light rounded-xl p-5 min-w-[200px] md:min-w-0 snap-start flex flex-col gap-2 border-heritage-border"
      >
        <div class="flex items-center gap-3">
          <span class="text-xl">{{ signal.icon }}</span>
          <span class="text-sm font-semibold text-heritage-text">{{ signal.label }}</span>
        </div>
        <p class="text-xs text-heritage-text-secondary leading-relaxed">{{ signal.desc }}</p>
      </div>
    </div>
  </section>
</template>
