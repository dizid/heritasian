<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const mobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', to: '/' },
  { name: 'Hotels', to: '/hotels' },
  { name: 'Rankings', to: '/rankings' },
  { name: 'Methodology', to: '/methodology' },
]

function toggleMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMenu() {
  mobileMenuOpen.value = false
}

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 glass border-b border-heritage-border">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex items-center justify-between h-16 md:h-18">
        <!-- Logo -->
        <RouterLink
          to="/"
          class="flex items-center gap-2 shrink-0"
          @click="closeMenu"
        >
          <span
            class="text-gold-gradient font-heading text-xl md:text-2xl font-bold tracking-[0.15em] uppercase"
          >
            Heritasian
          </span>
        </RouterLink>

        <!-- Desktop nav -->
        <nav class="hidden md:flex items-center gap-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="relative text-sm font-medium tracking-wide transition-colors duration-200"
            :class="isActive(link.to)
              ? 'text-heritage-gold'
              : 'text-heritage-text-secondary hover:text-heritage-text'"
          >
            {{ link.name }}
            <!-- Active indicator -->
            <span
              v-if="isActive(link.to)"
              class="absolute -bottom-1 left-0 right-0 h-px bg-heritage-gold"
            />
          </RouterLink>
        </nav>

        <!-- Mobile hamburger -->
        <button
          class="md:hidden flex flex-col justify-center items-center w-11 h-11 gap-1.5"
          :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="mobileMenuOpen"
          aria-controls="mobile-nav"
          @click="toggleMenu"
        >
          <span
            class="block w-6 h-px bg-heritage-text transition-all duration-300"
            :class="mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''"
          />
          <span
            class="block w-6 h-px bg-heritage-text transition-all duration-300"
            :class="mobileMenuOpen ? 'opacity-0' : ''"
          />
          <span
            class="block w-6 h-px bg-heritage-text transition-all duration-300"
            :class="mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''"
          />
        </button>
      </div>
    </div>

    <!-- Mobile dropdown menu -->
    <Transition name="fade">
      <div
        v-if="mobileMenuOpen"
        id="mobile-nav"
        class="md:hidden glass border-t border-heritage-border"
      >
        <nav class="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobile navigation">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="px-4 py-3 rounded-lg text-sm font-medium tracking-wide transition-colors duration-200"
            :class="isActive(link.to)
              ? 'text-heritage-gold bg-heritage-gold-dim'
              : 'text-heritage-text-secondary hover:text-heritage-text hover:bg-heritage-surface-light'"
            @click="closeMenu"
          >
            {{ link.name }}
          </RouterLink>
        </nav>
      </div>
    </Transition>
  </header>
</template>
