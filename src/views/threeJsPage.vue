<template>
  <div></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

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

//不受光照影响材质
// const cubeMaterial = new THREE.MeshBasicMaterial({
//   color: 0xff3300,
//   transparent: true, //开启透明
//   opacity: 0.7,
// })
// const cubeMaterial2 = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   transparent: true, //开启透明
//   opacity: 0.7,
// })
// const cubeMaterial3 = new THREE.MeshBasicMaterial({
//   color: 0x11ff00,
//   transparent: true, //开启透明
//   opacity: 0.7,
// })

// 漫反射材质
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff3300 })
const cubeMaterial2 = new THREE.MeshLambertMaterial({ color: 0xffff00 })
const cubeMaterial3 = new THREE.MeshLambertMaterial({ color: 0x11ff00 })

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
pointLight.position.set(20, 20, 20)
scene.add(pointLight)
// 初始化渲染器
const renderer = new THREE.WebGLRenderer()
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement)

// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera)
const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', () => {
  renderer.render(scene, camera)
})
</script>
<style scoped lang="scss"></style>
