<template></template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 导入模型
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'
let stats0: any

const loader = new GLTFLoader()

// 创建射线投射器
let raycaster: any
let pointer = { x: 0, y: 0 }
let camera: any,
  scene: any,
  renderer: any,
  axesHelper: any,
  mesh: any,
  ambientLight,
  controls: any

// 容器
let threeContainer: any
// 设置定时器id
let animationId: any
//选中的物体
let selectedObject: any = null
let INTERSECTED: any
let meshes: any = []
let cube: any
import { onMounted, ref, nextTick, onUnmounted } from 'vue'
import orbitControls from '@/views/orbitControls/orbitControls.vue'

const addStatsDom = () => {
  stats0 = new Stats()
  // 设置 Stats 的位置
  stats0.dom.style.position = 'fixed'
  stats0.dom.style.left = '0px'
  stats0.dom.style.top = '60px'
  document.body.appendChild(stats0.dom)
}
const removeStatsDom = () => {
  document.body.removeChild(stats0.dom)
}
const onWindowResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.render(scene, camera)
}
const onPointerMove = (event: any) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

const importModel = () => {
  // 导入模型
  // 注意导入的模型一定要放在public文件夹下
  loader.load(
    '/model/SUV.glb',
    function (gltf) {
      console.log('模型层级结构：', gltf.scene)
      mesh = gltf.scene
      collectMeshes(gltf.scene, meshes)
      console.log('meshes', meshes)

      scene.add(mesh)
    },
    undefined,
    function (error) {
      console.error(error)
    }
  )
}
const importOriginModel = () => {
  const geometry = new THREE.BoxGeometry()
  for (let i = 0; i < 2000; i++) {
    const object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    )

    object.position.x = Math.random() * 40 - 20
    object.position.y = Math.random() * 40 - 20
    object.position.z = Math.random() * 40 - 20

    object.rotation.x = Math.random() * 2 * Math.PI
    object.rotation.y = Math.random() * 2 * Math.PI
    object.rotation.z = Math.random() * 2 * Math.PI

    object.scale.x = Math.random() + 0.5
    object.scale.y = Math.random() + 0.5
    object.scale.z = Math.random() + 0.5

    scene.add(object)
  }
}
const init = () => {
  // 获取页面dom元素
  threeContainer = document.createElement('div')
  document.body.appendChild(threeContainer)

  // 1、创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf2f2f1)
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  // AxesHelper：辅助观察的坐标系
  const axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  // 导入平行光
  ambientLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  // 设置相机位置
  camera.position.set(10, 10, 10)
  camera.lookAt(0, 0, 0)
  scene.add(camera)

  // importModel()
  importOriginModel()
  // console.log('scene', scene.children)

  raycaster = new THREE.Raycaster()
  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 是否执行抗锯齿。默认为false
    logarithmicDepthBuffer: true, // 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。
  })
  // 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight)
  threeContainer!.appendChild(renderer.domElement)

  // 使用渲染器，通过相机将场景渲染进来
  controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)
  })

  addStatsDom()

  document.addEventListener('click', onPointerMove)
  window.addEventListener('resize', onWindowResize)
}
onMounted(() => {
  nextTick(() => {
    init()
    animate()
  })
})

const collectMeshes = (object: any, array: any) => {
  if (object instanceof THREE.Mesh) {
    array.push(object)
  } else if (object instanceof THREE.Group) {
    object.children.forEach((child) => collectMeshes(child, array))
  }
}
// 渲染函数
// 循环渲染事件
const animate = () => {
  animationId = requestAnimationFrame(animate)
  stats0.update()
  render()
}
const render = () => {
  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObjects(scene.children, false)

  if (pointer.x !== 0 && pointer.y !== 0) {
    if (intersects.length > 0) {
      if (INTERSECTED !== intersects[0].object) {
        // 取消上一个高亮物体的发光效果
        if (INTERSECTED && INTERSECTED.material.emissive) {
          INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
        }
        // 设置当前高亮物体
        INTERSECTED = intersects[0].object
        if (INTERSECTED.material.emissive) {
          // 存储当前发光颜色
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex()
          // 设置新的发光颜色
          INTERSECTED.material.emissive.setHex(0xff0000)
        }
      }
    } else {
      // 取消上一个高亮物体的发光效果
      if (INTERSECTED && INTERSECTED.material.emissive) {
        INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex)
      }
      INTERSECTED = null
    }
  }

  renderer.render(scene, camera)
}
// 退出页面释放资源
const relaseResource = () => {
  // requsetAnimationFrame销毁
  cancelAnimationFrame(animationId)
  removeStatsDom()
  // 渲染器销毁
  renderer.dispose()
  document.body.removeChild(threeContainer)
}
onUnmounted(() => {
  relaseResource()
})
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
