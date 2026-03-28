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
    <!-- Skip to content for keyboard users (WCAG 2.1 AA) -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-4 focus:py-2 focus:bg-heritage-gold focus:text-heritage-dark focus:rounded-lg focus:font-semibold focus:text-sm"
    >
      Skip to content
    </a>
    <AppHeader />
    <main id="main-content" class="flex-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>
