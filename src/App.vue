<script setup lang="ts">
import { useHead } from '@unhead/vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { SITE_URL } from '@/seo/constants'

// Site-wide Organization structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Heritasian',
        url: SITE_URL,
        logo: `${SITE_URL}/favicon.svg`,
        description: "The definitive guide to Southeast Asia's heritage hotels.",
      }),
    },
  ],
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>
