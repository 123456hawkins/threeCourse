<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';

import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
let geometry: any, line: any
let vertices: any
let scene: any
let camera: any
let axesHelper: any
let attribue: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any, material: any
let sphere: any
const init = () => {

    threeContainer = document.createElement('div')
    document.querySelector("#app")!.appendChild(threeContainer)
    geometry = new THREE.SphereGeometry(15, 32, 16);
    geometry.computeVertexNormals()
    scene = new THREE.Scene()
    //面模型 
    // wireframe: true可以看到geometry的面几何结构
    material = new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true });
    sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(5, 5, 5)
    scene.add(sphere)
    const vertexNormalsHelper = new VertexNormalsHelper(sphere, 10, 0xff0000);
    scene.add(vertexNormalsHelper)
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        1000
    )
    camera.position.set(60, 60, 60)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    axesHelper = new THREE.AxesHelper(150)
    scene.add(axesHelper)
    // 初始化渲染器
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 是否执行抗锯齿。默认为false
        logarithmicDepthBuffer: true, // 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。
    })
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight - 61)
    threeContainer!.appendChild(renderer.domElement)
    // 使用渲染器，通过相机将场景渲染进来
    controls = new OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', () => {
        renderer.render(scene, camera)
    })
    window.addEventListener('resize', onWindowResize)
}
const onWindowResize = () => {
    const width = window.innerWidth
    const height = window.innerHeight - 61
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    renderer.render(scene, camera)
}
const animate = () => {
    animationId = requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
const relaseResource = () => {
    // requsetAnimationFrame销毁
    cancelAnimationFrame(animationId)
    // 渲染器销毁
    renderer.dispose()
    document.querySelector("#app")!.removeChild(threeContainer)
}
onMounted(() => {
    nextTick(() => {
        init()
        animate()
    })
})
onUnmounted(() => {
    relaseResource()
})
</script>

<style></style>