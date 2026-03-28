<script setup lang="ts">
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import type { HHIScores } from '@/types'
import { getPillarScore } from '@/types'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const isSSR = import.meta.env.SSR

const props = defineProps<{
  scores: HHIScores
}>()

const pillar = computed(() => getPillarScore(props.scores))

const chartData = computed(() => ({
  labels: ['Heritage &\nAuthenticity', 'Guest\nExperience', 'Operational\nExcellence'],
  datasets: [
    {
      label: 'HHI Pillars',
      data: [pillar.value.ha, pillar.value.ge, pillar.value.oe],
      backgroundColor: 'rgba(201, 169, 110, 0.15)',
      borderColor: '#c9a96e',
      borderWidth: 2,
      pointBackgroundColor: '#c9a96e',
      pointBorderColor: '#dcc599',
      pointHoverBackgroundColor: '#dcc599',
      pointRadius: 5,
      pointHoverRadius: 7,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(26, 23, 20, 0.9)',
      borderColor: 'rgba(201, 169, 110, 0.3)',
      borderWidth: 1,
      titleColor: '#c9a96e',
      bodyColor: '#f0ebe3',
      padding: 12,
      callbacks: {
        label: (ctx: { parsed: { r: number } }) => ` Score: ${ctx.parsed.r}`,
      },
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      backgroundColor: 'rgba(26, 23, 20, 0.5)',
      angleLines: {
        color: 'rgba(201, 169, 110, 0.1)',
      },
      grid: {
        color: 'rgba(201, 169, 110, 0.08)',
      },
      pointLabels: {
        color: '#a89e90',
        font: { size: 11, family: 'Inter' },
      },
      ticks: {
        color: '#a89e90',
        backdropColor: 'transparent',
        stepSize: 25,
        font: { size: 9 },
      },
    },
  },
}))
</script>

<template>
  <div class="w-full max-w-xs mx-auto">
    <!-- Chart.js requires Canvas API — skip during SSR -->
    <Radar v-if="!isSSR" :data="chartData" :options="chartOptions" />
    <div v-else class="h-48 bg-heritage-surface rounded animate-pulse" />
  </div>
</template>
