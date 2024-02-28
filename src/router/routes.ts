export const routeList = [
  {
    path: '/',
    name: 'home',
    redirect: '/orbitControls',
    meta: {
      name: "home",
      hidden: true
    }
  },
  {
    path: '/orbitControls',
    name: 'orbitControls',
    component: () => import('../views/orbitControls/orbitControls.vue'),
    meta: {
      name: "home",
      hidden: false
    }
  },

  {
    path: '/lightTest',
    name: 'lightTest',
    component: () => import('../views/lightTest/lightTest.vue'),
    meta: {
      name: "home",
      hidden: false
    }
  }

]