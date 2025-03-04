import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Part0TableOfContents',
      component: () => import('@/views/Part0TableOfContents.vue'),
    },
    {
      path: '/part1-programs-and-machines',
      name: 'Part1ProgramsAndMachines',
      component: () => import('@/views/Part1ProgramsAndMachines.vue'),
    },
  ],
})

export default router
