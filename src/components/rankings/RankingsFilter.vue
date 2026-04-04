<script setup lang="ts">
import { computed } from 'vue'
import { COUNTRIES, TIER_CONFIG } from '@/types'
import type { CountryCode, Tier, PriceRange } from '@/types'

export interface FilterState {
  country: CountryCode | ''
  tier: Tier | ''
  priceRange: PriceRange | ''
  sort: string
  order: 'asc' | 'desc'
}

const props = defineProps<{
  modelValue: FilterState
}>()

const emit = defineEmits<{
  'update:filters': [filters: FilterState]
  'update:modelValue': [filters: FilterState]
}>()

function update(key: keyof FilterState, value: string) {
  const updated = { ...props.modelValue, [key]: value }
  emit('update:filters', updated)
  emit('update:modelValue', updated)
}

function toggleOrder() {
  const updated = {
    ...props.modelValue,
    order: props.modelValue.order === 'desc' ? 'asc' : 'desc' as 'asc' | 'desc',
  }
  emit('update:filters', updated)
  emit('update:modelValue', updated)
}

function clearFilters() {
  const cleared: FilterState = {
    country: '',
    tier: '',
    priceRange: '',
    sort: 'hhi',
    order: 'desc',
  }
  emit('update:filters', cleared)
  emit('update:modelValue', cleared)
}

const hasActiveFilters = computed(() =>
  props.modelValue.country !== '' ||
  props.modelValue.tier !== '' ||
  props.modelValue.priceRange !== '' ||
  props.modelValue.sort !== 'hhi' ||
  props.modelValue.order !== 'desc'
)

const sortOptions = [
  { value: 'hhi', label: 'Overall HHI' },
  { value: 'ha', label: 'Heritage & Authenticity' },
  { value: 'ge', label: 'Guest Experience' },
  { value: 'oe', label: 'Operational Excellence' },
  { value: 'year', label: 'Year Built' },
  { value: 'name', label: 'Name' },
]

const priceOptions: Array<{ value: PriceRange; label: string }> = [
  { value: '$', label: '$ — Budget' },
  { value: '$$', label: '$$ — Moderate' },
  { value: '$$$', label: '$$$ — Upscale' },
  { value: '$$$$', label: '$$$$ — Luxury' },
]

const selectClass =
  'w-full glass-light rounded-lg px-3 py-2 text-sm text-heritage-text bg-heritage-surface border border-heritage-border focus:outline-none focus:border-heritage-gold transition-colors duration-200 cursor-pointer appearance-none pr-8'
</script>

<template>
  <div class="glass rounded-xl p-3 sm:p-4 border-heritage-border">
    <div class="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 items-end">
      <!-- Country -->
      <div class="relative">
        <label for="filter-country" class="block text-[10px] text-heritage-text-secondary uppercase tracking-widest mb-1">
          Country
        </label>
        <select
          id="filter-country"
          :value="modelValue.country"
          :class="selectClass"
          @change="update('country', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All Countries</option>
          <option
            v-for="c in COUNTRIES"
            :key="c.code"
            :value="c.code"
          >
            {{ c.flag }} {{ c.name }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-2.5 bottom-2.5 text-heritage-text-secondary text-xs">▾</span>
      </div>

      <!-- Tier -->
      <div class="relative">
        <label for="filter-tier" class="block text-[10px] text-heritage-text-secondary uppercase tracking-widest mb-1">
          Tier
        </label>
        <select
          id="filter-tier"
          :value="modelValue.tier"
          :class="selectClass"
          @change="update('tier', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All Tiers</option>
          <option
            v-for="(cfg, key) in TIER_CONFIG"
            :key="key"
            :value="key"
          >
            {{ cfg.label }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-2.5 bottom-2.5 text-heritage-text-secondary text-xs">▾</span>
      </div>

      <!-- Price Range -->
      <div class="relative">
        <label for="filter-price" class="block text-[10px] text-heritage-text-secondary uppercase tracking-widest mb-1">
          Price
        </label>
        <select
          id="filter-price"
          :value="modelValue.priceRange"
          :class="selectClass"
          @change="update('priceRange', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Any Price</option>
          <option
            v-for="p in priceOptions"
            :key="p.value"
            :value="p.value"
          >
            {{ p.label }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-2.5 bottom-2.5 text-heritage-text-secondary text-xs">▾</span>
      </div>

      <!-- Sort -->
      <div class="relative">
        <label for="filter-sort" class="block text-[10px] text-heritage-text-secondary uppercase tracking-widest mb-1">
          Sort By
        </label>
        <select
          id="filter-sort"
          :value="modelValue.sort"
          :class="selectClass"
          @change="update('sort', ($event.target as HTMLSelectElement).value)"
        >
          <option
            v-for="opt in sortOptions"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-2.5 bottom-2.5 text-heritage-text-secondary text-xs">▾</span>
      </div>

      <!-- Order toggle -->
      <div class="col-span-1">
        <span class="block text-[10px] text-heritage-text-secondary uppercase tracking-widest mb-1" aria-hidden="true">
          Order
        </span>
        <button
          class="glass-light rounded-lg px-4 py-2 text-sm font-medium text-heritage-text border border-heritage-border hover:border-heritage-gold/40 transition-colors duration-200 flex items-center gap-2"
          @click="toggleOrder"
        >
          <span>{{ modelValue.order === 'desc' ? 'Descending' : 'Ascending' }}</span>
          <span class="text-xs text-heritage-gold">{{ modelValue.order === 'desc' ? '↓' : '↑' }}</span>
        </button>
      </div>

      <!-- Clear filters -->
      <button
        v-if="hasActiveFilters"
        class="col-span-1 sm:ml-auto px-4 py-2 text-xs text-heritage-text-secondary hover:text-heritage-gold border border-heritage-border hover:border-heritage-gold/30 rounded-lg transition-colors duration-200"
        @click="clearFilters"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>
