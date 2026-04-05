<script setup lang="ts">
import { RouterLink } from 'vue-router'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-heritage-border bg-heritage-surface mt-20">
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <!-- Brand -->
        <div class="flex flex-col items-center md:items-start gap-1">
          <span class="text-gold-gradient font-heading text-lg font-bold tracking-[0.15em] uppercase">
            Heritasian
          </span>
          <p class="text-heritage-text-secondary text-xs text-center md:text-left">
            The Definitive Guide to Southeast Asia's Heritage Hotels
          </p>
        </div>

        <!-- Links -->
        <nav class="flex items-center gap-6">
          <RouterLink
            to="/"
            class="text-heritage-text-secondary hover:text-heritage-gold text-xs transition-colors duration-200"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/hotels"
            class="text-heritage-text-secondary hover:text-heritage-gold text-xs transition-colors duration-200"
          >
            Hotels
          </RouterLink>
          <RouterLink
            to="/rankings"
            class="text-heritage-text-secondary hover:text-heritage-gold text-xs transition-colors duration-200"
          >
            Rankings
          </RouterLink>
          <RouterLink
            to="/methodology"
            class="text-heritage-text-secondary hover:text-heritage-gold text-xs transition-colors duration-200"
          >
            Methodology
          </RouterLink>
        </nav>
      </div>

      <!-- Copyright -->
      <div class="mt-8 pt-6 border-t border-heritage-border text-center">
        <p class="text-heritage-text-secondary text-xs">
          &copy; {{ year }} Heritasian. Independently rated and curated.
        </p>
      </div>
    </div>
  </footer>
</template>
