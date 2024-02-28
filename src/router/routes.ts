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
  },
  {
    path: '/arrayCube',
    name: 'arrayCube',
    component: () => import('../views/arrayCube/arrayCube.vue'),
    meta: {
      name: "arrayCube",
      hidden: false
    }
  },
  {
    path: '/commonGeo',
    name: 'commonGeo',
    component: () => import('../views/commonGeo/commonGeo.vue'),
    meta: {
      name: "commonGeo",
      hidden: false
    }
  },

]