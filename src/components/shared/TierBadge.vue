<script setup lang="ts">
import type { Tier } from '@/types'
import { TIER_CONFIG } from '@/types'

const props = withDefaults(defineProps<{
  tier: Tier
  size?: 'sm' | 'md' | 'lg'
}>(), {
  size: 'md',
})

const config = TIER_CONFIG[props.tier]

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1.5',
  md: 'px-3 py-1 text-xs gap-2',
  lg: 'px-4 py-1.5 text-sm gap-2',
}

const dotSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
}
</script>

<template>
  <span
    class="glass-light inline-flex items-center rounded-full font-medium tracking-wide"
    :class="sizeClasses[size]"
  >
    <!-- Colored dot -->
    <span
      class="rounded-full shrink-0"
      :class="dotSizes[size]"
      :style="{ backgroundColor: config.color }"
    />
    <!-- Label -->
    <span :style="{ color: config.color }">{{ config.label }}</span>
  </span>
</template>
