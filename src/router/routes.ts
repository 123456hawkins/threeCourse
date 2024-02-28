export const routeList = [
  {
    path: '/',
    name: 'home',
    redirect: '/threeJsPage',
    meta: {
      name: "home",
      hidden: true
    }
  },
  {
    path: '/threeJsPage',
    name: 'threeJsPage',
    component: () => import('../views/threeJsPage.vue'),
    meta: {
      name: "home",
      hidden: false
    }
  }

]