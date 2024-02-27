export const routeList = [
  {
    path: '/',
    name: 'home',
    redirect: '/threeJsPage'
  },
  {
    path: '/threeJsPage',
    name: 'threeJsPage',
    component: () => import('../views/threeJsPage.vue')
  }

]