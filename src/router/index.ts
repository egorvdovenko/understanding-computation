import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/part1-programs-and-machines',
      name: 'Part1ProgramsAndMachines',
      component: () => import('@/views/Part1ProgramsAndMachines.vue'),
    },
  ],
})

export default router
