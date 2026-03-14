<script setup lang="ts">
import type { TimelineEvent } from '@/types'

defineProps<{
  events: TimelineEvent[]
}>()
</script>

<template>
  <div class="relative">
    <!-- Vertical gold line -->
    <div
      v-if="events.length > 1"
      class="absolute left-[4.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-heritage-gold/30 via-heritage-gold/20 to-transparent"
    />

    <div class="flex flex-col gap-0">
      <div
        v-for="(event, index) in events"
        :key="index"
        class="flex items-start gap-6 py-4 group"
      >
        <!-- Year -->
        <div class="w-16 shrink-0 text-right">
          <span class="text-xs font-semibold text-heritage-gold tabular-nums tracking-wider">
            {{ event.year }}
          </span>
        </div>

        <!-- Gold dot -->
        <div class="relative flex items-center justify-center z-10 mt-0.5">
          <div
            class="w-3 h-3 rounded-full border-2 border-heritage-gold bg-heritage-dark transition-transform duration-200 group-hover:scale-125"
          />
          <!-- Glow on hover -->
          <div
            class="absolute inset-0 rounded-full bg-heritage-gold/20 scale-0 group-hover:scale-150 transition-transform duration-300"
          />
        </div>

        <!-- Event text -->
        <div class="flex-1 pb-2">
          <p class="text-sm text-heritage-text leading-relaxed">{{ event.event }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
