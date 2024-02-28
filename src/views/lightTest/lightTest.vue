<template>
  <div id="threejs" class="container"></div>
</template>

<script setup lang="ts">
import { text } from 'stream/consumers'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, ref, nextTick, onUnmounted } from 'vue'

// console.log(THREE);

// 目标：了解three.js最基本的内容

// 1、创建场景
const scene = new THREE.Scene()

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
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
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeGeometry2 = new THREE.BoxGeometry(1, 1, 1)
const cubeGeometry3 = new THREE.BoxGeometry(1, 1, 1)
// 设置材质贴图
const texture = new THREE.TextureLoader().load('@/assets/img/landscape.jpg')
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.repeat.set(4, 4)
// 漫反射材质
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xff3300,
})
const cubeMaterial2 = new THREE.MeshLambertMaterial({
  color: 0xffff00,
})
const cubeMaterial3 = new THREE.MeshLambertMaterial({
  color: 0x11ff00,
})

// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2)
const cube3 = new THREE.Mesh(cubeGeometry3, cubeMaterial3)

// 设置几何体位置
cube.position.set(1, 0, 0)
cube2.position.set(0, 1, 0)
cube3.position.set(0, 0, 1)

// 将几何体添加到场景中
scene.add(cube)
scene.add(cube2)
scene.add(cube3)

// 设置点光源
// 参数1：0xffffff是纯白光,表示光源颜色
// 参数2：1.0,表示光照强度，可以根据需要调整
// 参数3：光照距离
// 参数4：光源衰减，为0时不衰减
const pointLight = new THREE.PointLight(0xffffff, 10, 0, 0)
// pointLight.position.set(20, 20, 20)
// pointLight.position.set(20, 20, 20)
pointLight.position.set(100, 60, 50)
// 改变点光源位置，使用OrbitControls辅助观察
// pointLight.position.set(-400, -200, -300)
// scene.add(pointLight)

// 引入点光源辅助观察对象
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 10)
// scene.add(pointLightHelper)

// 设置环境光
// const ambient = new THREE.AmbientLight(0xffffff, 1)
// scene.add(ambient)

// 设置平行光
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(80, 100, 100)
directionalLight.target = cube
scene.add(directionalLight)

// 平行光光源可视化辅助观察对象
const dirLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  5,
  0xff0000
)
scene.add(dirLightHelper)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 是否执行抗锯齿。默认为false
  logarithmicDepthBuffer: true, // 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。
})
const render = () => {
  renderer.render(scene, camera)
}
onMounted(() => {
  // 将webgl渲染的canvas内容添加到body
  const threeContainer = document.getElementById('threejs')
  nextTick(() => {
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight - 60)
    threeContainer!.appendChild(renderer.domElement)
    render()
  })
})
// 退出页面释放资源
const relaseResource = () => {
  // 渲染器销毁
  renderer.dispose()
  // Material销毁
  cubeMaterial.dispose()
  cubeMaterial2.dispose()
  cubeMaterial3.dispose()
  // Geometry销毁
  cubeGeometry.dispose()
  cubeGeometry2.dispose()
  cubeGeometry3.dispose()
}
onUnmounted(() => {
  relaseResource()
})
// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera)
const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', () => {
  renderer.render(scene, camera)
})
window.addEventListener('resize', () => {
  // 修改相机配置
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新投影矩阵
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight - 60)
})
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
