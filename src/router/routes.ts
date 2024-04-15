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
          {
            path: "/bufferGeometry/verticsIndex",
            name: "verticsIndex",
            component: () => import("@/views/BufferGeometry/verticsIndex.vue"),
            meta: {
              title: "顶点索引",
              hidden: false,
            },
          },
          {
            path: "/bufferGeometry/vertexNormal",
            name: "vertexNormal",
            component: () => import("@/views/BufferGeometry/vertexNormal.vue"),
            meta: {
              title: "顶点法线",
              hidden: false,
            },
          },
          {
            path: "/bufferGeometry/geometryVertices",
            name: "geometryVertices",
            component: () =>
              import("@/views/BufferGeometry/geometryVertices.vue"),
            meta: {
              title: "几何体顶点",
              hidden: false,
            },
          },
          {
            path: "/bufferGeometry/transform",
            name: "transform",
            component: () => import("@/views/BufferGeometry/transform.vue"),
            meta: {
              title: "物体变换",
              hidden: false,
            },
          },
        ],
      },
      {
        path: "/modelMaterial",
        name: "modelMaterial",
        meta: {
          title: "模型对象,材质",
          hidden: false,
        },
        redirect: "/modelMaterial/euler",
        children: [
          {
            path: "/modelMaterial/euler",
            name: "euler",
            component: () => import("@/views/modelMaterial/euler.vue"),
            meta: {
              title: "欧拉Euler与角度属性.rotation",
              hidden: false,
            },
          },
          {
            path: "/modelMaterial/material",
            name: "material",
            component: () => import("@/views/modelMaterial/material.vue"),
            meta: {
              title: "material",
              hidden: false,
            },
          },
        ],
      },
      {
        path: "/hierarchicalModel",
        name: "hierarchicalModel",
        meta: {
          title: "层级模型",
          hidden: false,
        },
        redirect: "/hierarchicalModel/group",
        children: [
          {
            path: "/hierarchicalModel/group",
            name: "group",
            meta: {
              title: "group",
              hidden: false,
            },
            component: () => import("@/views/hierarchicalModel/group.vue"),
          },
          {
            path: "/hierarchicalModel/group2",
            name: "group2",
            meta: {
              title: "group2",
              hidden: false,
            },
            component: () => import("@/views/hierarchicalModel/group2.vue"),
          },
          {
            path: "/hierarchicalModel/coordinates",
            name: "coordinates",
            meta: {
              title: "coordinates",
              hidden: false,
            },
            component: () =>
              import("@/views/hierarchicalModel/coordinates.vue"),
          },
        ],
      },
      {
        path: "/textureMap",
        name: "textureMap",
        meta: {
          title: "顶点uv坐标和纹理贴图",
          hidden: false,
        },
        redirect: "/textureMap/earth",
        children: [
          {
            path: "/textureMap/earth",
            name: "earth",
            meta: {
              title: "earth",
              hidden: false,
            },
            component: () => import("@/views/textureMap/earth.vue"),
          },
          {
            path: "/textureMap/uvCoordinates",
            name: "uvCoordinates",
            meta: {
              title: "uv坐标",
              hidden: false,
            },
            component: () => import("@/views/textureMap/uvCoordinates.vue"),
          },
          {
            path: "/textureMap/textureArray",
            name: "textureArray",
            meta: {
              title: "texture阵列",
              hidden: false,
            },
            component: () => import("@/views/textureMap/textureArray.vue"),
          },
          {
            path: "/textureMap/transparentTexture",
            name: "transparentTexture",
            meta: {
              title: "透明texture",
              hidden: false,
            },
            component: () =>
              import("@/views/textureMap/transparentTexture.vue"),
          },
        ],
      },
      {
        path: "/pbrMaterial",
        name: "pbrMaterial",
        meta: {
          title: "pbr材质和纹理贴图",
          hidden: false,
        },
        redirect: "/pbrMaterial/pbr",
        children: [
          {
            path: "/pbrMaterial",
            name: "pbrMaterial",
            meta: {
              title: "pbr材质和纹理贴图",
              hidden: false,
            },
            component: () => import("@/views/pbrMaterial/pbr.vue"),
          },
          {
            path: "/pbrMaterial/envMap",
            name: "envMap",
            meta: {
              title: "环境贴图",
              hidden: false,
            },
            component: () => import("@/views/pbrMaterial/envMap.vue"),
          },
          {
            path: "/pbrMaterial/physicsMaterial",
            name: "physicsMaterial",
            meta: {
              title: "physics材质",
              hidden: false,
            },
            component: () => import("@/views/pbrMaterial/physicsMaterial.vue"),
          },
          {
            path: "/pbrMaterial/officalCase",
            name: "officalCase",
            meta: {
              title: "官网例子",
              hidden: false,
            },
            component: () => import("@/views/pbrMaterial/officalCase.vue"),
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
