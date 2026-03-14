<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-20">
    <div class="text-center mb-10">
      <p class="text-heritage-gold text-xs uppercase tracking-[0.3em] mb-3">Our Mission</p>
      <h2 class="font-heading text-3xl md:text-4xl font-bold text-heritage-text">
        Why We Built This
      </h2>
    </div>

    <div class="border-l-2 border-heritage-gold/40 pl-6 md:pl-8 space-y-4">
      <p class="text-heritage-text-secondary text-sm md:text-base leading-relaxed">
        Major travel platforms treat a 200-year-old colonial mansion the same as a hotel built last year.
        A five-star rating tells you about thread count and room service — not whether the building survived
        a revolution, or whether its restoration honours the original architecture.
      </p>
      <p class="text-heritage-text-secondary text-sm md:text-base leading-relaxed">
        The Heritasian Heritage Index exists to fill that gap. We apply a weighted scoring system that rewards
        historical depth, architectural authenticity, and cultural integrity — while still demanding genuine
        guest satisfaction and responsible heritage stewardship.
      </p>
      <p class="text-heritage-text-secondary text-sm md:text-base leading-relaxed">
        We accept no payment from hotels, hotel groups, or tourism boards in exchange for ratings, rankings,
        or inclusion in the index. Every score is calculated from our published methodology.
      </p>
    </div>

    <div class="text-center mt-10">
      <RouterLink
        to="/methodology"
        class="inline-flex items-center gap-2 text-heritage-gold hover:text-heritage-gold-light text-sm font-medium tracking-wide transition-colors duration-200 border border-heritage-border hover:border-heritage-gold/40 px-6 py-3 rounded-xl"
      >
        Read our full methodology →
      </RouterLink>
    </div>
  </section>
</template>
