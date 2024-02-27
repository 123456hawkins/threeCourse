import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'threeJsPage',
      component: () => import('../views/threeJsPage.vue')
    },

  ]
})

export default router
