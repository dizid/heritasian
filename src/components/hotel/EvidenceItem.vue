<script setup lang="ts">
defineProps<{
  excerpt: string | null
  notes: string | null
  sourceUrl: string | null
}>()

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
</script>

<template>
  <div class="glass-light rounded-lg p-3 flex flex-col gap-1.5">
    <p v-if="excerpt" class="text-xs italic text-heritage-text-secondary leading-relaxed">
      "{{ excerpt }}"
    </p>
    <p v-if="notes" class="text-xs text-heritage-text-secondary/70 leading-relaxed">
      {{ notes }}
    </p>
    <a
      v-if="sourceUrl"
      :href="sourceUrl"
      target="_blank"
      rel="noopener"
      class="inline-flex items-center gap-1 text-heritage-gold text-xs hover:text-heritage-gold-light transition-colors w-fit"
    >
      <span>{{ extractDomain(sourceUrl) }}</span>
      <span class="text-[10px]">&#x2197;</span>
    </a>
  </div>
</template>
