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
      name: "orbitControls",
      hidden: false
    }
  },

  {
    path: '/lightTest',
    name: 'lightTest',
    component: () => import('../views/lightTest/lightTest.vue'),
    meta: {
      name: "lightTest",
      hidden: false
    }
  },
  {
    path: '/animation',
    name: 'animation',
    component: () => import('../views/animation/animation.vue'),
    meta: {
      name: "animation",
      hidden: false
    }
  }

]