import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { top: 0 }
  },
  routes: [
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
      path: '/hotel/:slug',
      name: 'hotel',
      component: () => import('@/views/HotelView.vue'),
    },
    {
      path: '/methodology',
      name: 'methodology',
      component: () => import('@/views/MethodologyView.vue'),
    },
  ],
})

export default router
