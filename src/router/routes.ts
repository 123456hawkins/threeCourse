export const routeList = [
  {
    path: "/",
    name: "/",
    component: () => import("@/layout/index.vue"),
    meta: {
      title: "/",
      hidden: true,
    },
    redirect: "/easyLearn",
    children: [
      {
        path: "/easyLearn",
        name: "easyLearn",
        meta: {
          title: "easyLearn",
          hidden: false,
        },
        redirect: "/easyLearn/orbitControls",
        children: [
          {
            path: "/easyLearn/orbitControls",
            name: "orbitControls",
            component: () => import("../views/orbitControls/orbitControls.vue"),
            meta: {
              title: "orbitControls",
              hidden: false,
            },
          },
          {
            path: "/easyLearn/lightTest",
            name: "lightTest",
            component: () => import("../views/lightTest/lightTest.vue"),
            meta: {
              title: "lightTest",
              hidden: false,
            },
          },
          {
            path: "/easyLearn/animation",
            name: "animation",
            component: () => import("../views/animation/animation.vue"),
            meta: {
              title: "animation",
              hidden: false,
            },
          },
          {
            path: "/easyLearn/arrayCube",
            name: "arrayCube",
            component: () => import("../views/arrayCube/arrayCube.vue"),
            meta: {
              title: "arrayCube",
              hidden: false,
            },
          },
          {
            path: "/easyLearn/commonGeo",
            name: "commonGeo",
            component: () => import("../views/commonGeo/commonGeo.vue"),
            meta: {
              title: "commonGeo",
              hidden: false,
            },
          },
          {
            path: "/easyLearn/phong",
            name: "phong",
            component: () => import("../views/phong/phong.vue"),
            meta: {
              title: "phong",
              hidden: false,
            },
          },
          {
            path: "/easyLearn/gui",
            name: "gui",
            component: () => import("../views/gui/gui.vue"),
            meta: {
              title: "gui",
              hidden: false,
            },
          },
          {
            path: "/easyLearn/importModel",
            name: "importModel",
            component: () => import("@/views/gltf/importModel/index.vue"),
            meta: {
              title: "importModel",
              hidden: false,
            },
          },
        ],
      },
      {
        path: "/bufferGeometry",
        name: "bufferGeometry",
        redirect: "/bufferGeometry/pointData",
        meta: {
          title: "bufferGeometry",
          hidden: false,
        },
        children: [
          {
            path: "/bufferGeometry/pointData",
            name: "pointData",
            component: () => import("@/views/BufferGeometry/index.vue"),
            meta: {
              title: "pointData",
              hidden: false,
            },
          },
        ],
      },
      {
        path: "/outline",
        name: "outline",
        component: () => import("@/views/outline/index.vue"),
        meta: {
          title: "outline",
          hidden: false,
        },
      },
      {
        path: "/3dtag",
        name: "3dtag",
        component: () => import("@/views/3dtag/index.vue"),
        meta: {
          title: "3dtag",
          hidden: false,
        },
      },
    ],
  },
];
