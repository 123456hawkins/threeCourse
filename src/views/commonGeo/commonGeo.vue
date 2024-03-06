<template>

</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'
const stats0 = new Stats()
// 设置定时器id
let animationId: any
stats0.showPanel(0)
import { onMounted, ref, nextTick, onUnmounted } from 'vue'

// 1、创建场景
const scene = new THREE.Scene()
// 容器
let threeContainer: any
// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight - 60),
  0.1,
  1000
)

// 设置相机位置
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)
scene.add(camera)

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150)
scene.add(axesHelper)

// 添加物体
// 创建几何体

//BoxGeometry：长方体
const geometry1 = new THREE.BoxGeometry(1, 1, 1)
// SphereGeometry：球体
const geometry2 = new THREE.SphereGeometry(1)
// CylinderGeometry：圆柱
const geometry3 = new THREE.CylinderGeometry(1, 1, 1)
// PlaneGeometry：矩形平面
const geometry4 = new THREE.PlaneGeometry(1, 1)
// CircleGeometry：圆形平面
const geometry5 = new THREE.CircleGeometry(1)

// 漫反射材质
const cubeMaterial1 = new THREE.MeshLambertMaterial({ color: 0xff3300 })
const cubeMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffff00 })
const cubeMaterial3 = new THREE.MeshLambertMaterial({ color: 0x11ff00 })
const cubeMaterial4 = new THREE.MeshLambertMaterial({ color: 0x0b159b })
const cubeMaterial5 = new THREE.MeshLambertMaterial({ color: 0xeb581e })

// 根据几何体和材质创建物体
const cube1 = new THREE.Mesh(geometry1, cubeMaterial1)
const cube2 = new THREE.Mesh(geometry2, cubeMaterial2)
const cube3 = new THREE.Mesh(geometry3, cubeMaterial3)
const cube4 = new THREE.Mesh(geometry4, cubeMaterial4)
const cube5 = new THREE.Mesh(geometry5, cubeMaterial5)

// 设置几何体位置
cube1.position.set(0, 0, 0)
cube2.position.set(5, 0, 0)
cube3.position.set(0, 5, 0)
cube4.position.set(0, 0, 5)
cube5.position.set(5, 5, 5)

// 将几何体添加到场景中
scene.add(cube1)
scene.add(cube2)
scene.add(cube3)
scene.add(cube4)
scene.add(cube5)
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
// const clock = new THREE.Clock()
const render = () => {
  // const spt = clock.getDelta() * 1000
  // console.log('两帧渲染间隔:' + spt + 'ms')
  // console.log('FPS:', 1000 / spt)
  stats0.update()
  renderer.render(scene, camera)
  cube1.rotateY(0.01)
  cube2.rotateX(0.02)
  cube3.rotateZ(0.03)
  cube4.rotateX(0.03)
  cube5.rotateY(0.03)
  animationId = requestAnimationFrame(render)
}
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
  domInit()
  nextTick(() => {
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
  // Material销毁
  cubeMaterial1.dispose()
  cubeMaterial2.dispose()
  cubeMaterial3.dispose()
  cubeMaterial4.dispose()
  cubeMaterial5.dispose()
  // Geometry销毁
  geometry1.dispose()
  geometry2.dispose()
  geometry3.dispose()
  geometry4.dispose()
  geometry5.dispose()
  document.body.removeChild(threeContainer)
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
// renderer.render(scene, camera)
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
