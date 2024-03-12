<template></template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 导入模型
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
const loader = new GLTFLoader()

// 创建射线投射器
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'
const stats0 = new Stats()

// 摄像机角度
let angle = 0
// 容器
let threeContainer: any
// 设置定时器id
let animationId: any
//选中的物体
let selectedObject: any = null
stats0.showPanel(0)
import { onMounted, ref, nextTick, onUnmounted } from 'vue'
import orbitControls from '@/views/orbitControls/orbitControls.vue'

// 1、创建场景
const scene = new THREE.Scene()

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight - 60),
  0.1,
  1000
)
// 导入模型
// 注意导入的模型一定要放在public文件夹下
loader.load(
  '/model/Car.glb',
  function (gltf) {
    console.log('模型层级结构：', gltf.scene)
    scene.add(gltf.scene)
    const obj = gltf.scene.getObjectByName('NormalCar1_BackWheels_Cube011')
    obj.children.forEach(function (mesh) {
      mesh.material.color.set(0xffff00)
    })
  },
  undefined,
  function (error) {
    console.error(error)
  }
)
// 设置相机位置
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)
scene.add(camera)

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150)
scene.add(axesHelper)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 是否执行抗锯齿。默认为false
  logarithmicDepthBuffer: true, // 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。
})

const directionalLight = new THREE.DirectionalLight(0xffffff, 9)
scene.add(directionalLight)

const addStatsDom = () => {
  // 设置 Stats 的位置
  stats0.dom.style.position = 'fixed'
  stats0.dom.style.left = '0px'
  stats0.dom.style.top = '60px'

  document.body.appendChild(stats0.dom)
}
const removeStatsDom = () => {
  document.body.removeChild(stats0.dom)
}
const domInit = () => {
  threeContainer = document.createElement('div')
  document.body.appendChild(threeContainer)
}
onMounted(() => {
  nextTick(() => {
    domInit()
    window.addEventListener('mousemove', (event) => {
      // 计算鼠标位置
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / (window.innerHeight - 60)) * 2 + 1
      // console.log(mouse.x, mouse.y)
    })
    window.addEventListener('resize', () => {
      // 修改相机配置
      camera.aspect = window.innerWidth / (window.innerHeight - 60)
      // 更新投影矩阵
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight - 60)
    })
    console.log('children', scene.children)

    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight - 60)
    threeContainer!.appendChild(renderer.domElement)
    addStatsDom()
    render()
  })
})
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

// 使用渲染器，通过相机将场景渲染进来
// 使用了循环渲染事件，就不用再通过事件change执行了
// renderer.render(scene, camera)
const controls = new OrbitControls(camera, renderer.domElement)

const selectObjHightLight = () => {
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(scene.children, true)
  if (intersects !== undefined) {
    if (intersects.length > 0) {
      const newSelectedObject = intersects[0].object

      if (newSelectedObject !== selectedObject) {
        // 取消之前模块的高亮
        if (selectedObject) {
          selectedObject.material.color.set(0x000000)
        }

        // 设置当前模块高亮
        selectedObject = newSelectedObject
        selectedObject.material.color.set(0xff0000)
      }
    } else {
      // 鼠标未与任何模块相交时取消高亮
      if (selectedObject) {
        selectedObject.material.color.set(0x000000)
        selectedObject = null
      }
    }
  }
}
// 渲染函数
// 循环渲染事件
const render = () => {
  // const spt = clock.getDelta() * 1000
  // console.log('两帧渲染间隔:' + spt + 'ms')
  // console.log('FPS:', 1000 / spt)
  selectObjHightLight()
  stats0.update()
  renderer.render(scene, camera)
  animationId = requestAnimationFrame(render)
}
controls.addEventListener('change', () => {
  renderer.render(scene, camera)
})
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
