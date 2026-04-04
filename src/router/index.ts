import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/rankings',
    name: 'rankings',
    component: () => import('@/views/RankingsView.vue'),
  },
  {
    path: '/hotels',
    name: 'hotels',
    component: () => import('@/views/HotelsView.vue'),
  },
  {
    path: '/hotel/:slug',
    name: 'hotel',
    component: () => import('@/views/HotelView.vue'),
  },
  {
    path: '/methodology',
    name: 'methodology',
    component: () => import('@/views/MethodologyView.vue'),
  },
]

// Create the client-side router — called from entry-client.ts only, not at module scope
// (createWebHistory references `window` which doesn't exist during SSR)
export function createClientRouter() {
  return createRouter({
    history: createWebHistory(),
    scrollBehavior(_to, _from, savedPosition) {
      return savedPosition || { top: 0 }
    },
    routes,
  })
}
