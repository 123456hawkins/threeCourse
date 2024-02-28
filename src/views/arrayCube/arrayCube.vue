import type { disposeEmitNodes } from 'typescript'; import type { ThreeMFLoader
} from 'three/examples/jsm/Addons.js'; import type { ThreeMFLoader } from
'three/examples/jsm/Addons.js'; import type { ThreeMFLoader } from
'three/examples/jsm/Addons.js';
<template>
  <div id="threejs" class="container"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'
const stats0 = new Stats()
const stats1 = new Stats()
const stats2 = new Stats()

stats0.showPanel(0)
stats1.showPanel(1)
stats2.showPanel(2)
import { onMounted, ref, nextTick, onUnmounted } from 'vue'

// 1、创建场景
const scene = new THREE.Scene()

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight - 60),
  0.1,
  1000
)

// 设置相机位置
camera.position.set(60, 60, 60)
camera.lookAt(0, 0, 0)
scene.add(camera)

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150)
scene.add(axesHelper)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial({
  color: 0x00ffff, //设置材质颜色
  transparent: true, //开启透明
  opacity: 0.8, //设置透明度
})

// 设置点光源
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
// 参数3：光照距离
// 参数4：光源衰减，为0时不衰减
const pointLight = new THREE.PointLight(0xffffff, 10, 0, 0)
pointLight.position.set(80, 80, 80)

scene.add(pointLight)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 是否执行抗锯齿。默认为false
  logarithmicDepthBuffer: true, // 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。
})

// 渲染函数
// 循环渲染事件
const render = () => {
  stats0.update()
  stats1.update()
  stats2.update()
  renderer.render(scene, camera)
}
const addCube = (i, j, k) => {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(i * 2, j * 2, k * 2)
  scene.add(mesh)
}

const addCubesWithDelay = (maxI, maxJ, maxK) => {
  let i = 0,
    j = 0,
    k = 0
  const addCubeDelayed = () => {
    addCube(i, j, k)
    render()
    k++
    if (k === maxK) {
      k = 0
      j++
      if (j === maxJ) {
        j = 0
        i++
        if (i === maxI) {
          // 所有循环完成，退出
          return
        }
      }
    }
    // 递归调用，等待下一帧动画前再执行
    requestAnimationFrame(addCubeDelayed)
  }
  // 启动第一帧动画
  addCubeDelayed()
}

const addStatsDom = () => {
  // 设置 Stats 的位置
  stats0.dom.style.position = 'fixed'
  stats0.dom.style.left = '0px'
  stats0.dom.style.top = '60px'

  stats1.dom.style.position = 'fixed'
  stats1.dom.style.left = '80px' // Adjust this value as needed
  stats1.dom.style.top = '60px'

  stats2.dom.style.position = 'fixed'
  stats2.dom.style.left = '160px' // Adjust this value as needed
  stats2.dom.style.top = '60px'

  document.body.appendChild(stats0.dom)
  document.body.appendChild(stats1.dom)
  document.body.appendChild(stats2.dom)
}
const removeStatsDom = () => {
  document.body.removeChild(stats0.dom)
  document.body.removeChild(stats1.dom)
  document.body.removeChild(stats2.dom)
}
onMounted(() => {
  // 将webgl渲染的canvas内容添加到body
  const threeContainer = document.getElementById('threejs')
  nextTick(() => {
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight - 60)
    threeContainer!.appendChild(renderer.domElement)
    addStatsDom()
    // render()
    addCubesWithDelay(10, 10, 10)
  })
})
// 退出页面释放资源
const relaseResource = () => {
  removeStatsDom()
  // 渲染器销毁
  renderer.dispose()
  material.dispose()
  geometry.dispose()
}
onUnmounted(() => {
  relaseResource()
})
window.addEventListener('resize', () => {
  // 修改相机配置
  camera.aspect = window.innerWidth / (window.innerHeight - 60)
  // 更新投影矩阵
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight - 60)
})
// 使用渲染器，通过相机将场景渲染进来
// 使用了循环渲染事件，就不用再通过事件change执行了
const controls = new OrbitControls(camera, renderer.domElement)
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
