<script setup lang="ts">
import { ref, onMounted } from 'vue'

withDefaults(defineProps<{
  label: string
  score: number
  color?: string
}>(), {
  color: '#c9a96e',
})

// Animate bar fill on mount
const animated = ref(false)
onMounted(() => {
  // Small delay so the transition fires after render
  requestAnimationFrame(() => {
    animated.value = true
  })
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <!-- Label row -->
    <div class="flex items-center justify-between">
      <span class="text-xs text-heritage-text-secondary tracking-wide">{{ label }}</span>
      <span class="text-xs font-semibold tabular-nums" :style="{ color }">
        {{ score.toFixed(1) }}
      </span>
    </div>
    <!-- Track -->
    <div class="h-1.5 rounded-full bg-heritage-surface-light overflow-hidden">
      <!-- Fill -->
      <div
        class="h-full rounded-full score-bar-fill"
        :style="{
          width: animated ? `${score}%` : '0%',
          background: `linear-gradient(90deg, ${color}99, ${color})`,
        }"
      />
    </div>
  </div>
</template>
