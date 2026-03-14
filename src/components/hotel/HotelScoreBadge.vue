<script setup lang="ts">
import { computed } from 'vue'
import type { Tier } from '@/types'
import { TIER_CONFIG } from '@/types'

const props = withDefaults(defineProps<{
  score: number
  tier: Tier
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

const config = computed(() => TIER_CONFIG[props.tier])

const sizeClasses = {
  sm: { outer: 'w-20 h-20', score: 'text-2xl', label: 'text-[9px]', sub: 'text-[8px]' },
  md: { outer: 'w-28 h-28', score: 'text-4xl', label: 'text-[10px]', sub: 'text-[9px]' },
  lg: { outer: 'w-36 h-36', score: 'text-5xl', label: 'text-xs', sub: 'text-[10px]' },
}

const sz = computed(() => sizeClasses[props.size])
</script>

<template>
  <div
    class="glass rounded-full flex flex-col items-center justify-center relative overflow-hidden border-2"
    :class="sz.outer"
    :style="{ borderColor: config.color + '60' }"
  >
    <!-- Subtle background glow -->
    <div
      class="absolute inset-0 rounded-full opacity-10"
      :style="{ background: `radial-gradient(circle at center, ${config.color}, transparent 70%)` }"
    />

    <!-- Score number -->
    <span
      class="font-heading font-bold tabular-nums leading-none z-10"
      :class="sz.score"
      :style="{ color: config.color }"
    >
      {{ score.toFixed(0) }}
    </span>

    <!-- HHI label -->
    <span class="text-heritage-text-secondary uppercase tracking-widest z-10 mt-1" :class="sz.label">
      HHI
    </span>

    <!-- Tier label -->
    <span
      class="uppercase tracking-wider z-10 mt-0.5 opacity-80 text-center px-2 leading-tight"
      :class="sz.sub"
      :style="{ color: config.color }"
    >
      {{ config.label.replace('Heritage ', '') }}
    </span>
  </div>
</template>
