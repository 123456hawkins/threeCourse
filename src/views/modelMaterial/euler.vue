<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';

import { ArrowHelper } from 'three/src/Three.js';

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
let axis: any
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
    sphere.position.set(0, 0, 0)
    scene.add(sphere)
    // const vertexNormalsHelper = new VertexNormalsHelper(sphere, 10, 0xff0000);
    // scene.add(vertexNormalsHelper)
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        1000
    )
    camera.position.set(60, 60, 60)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    // 自定义axis的方向
    // 创建一个表示方向的向量
    axis = new THREE.Vector3(10, 10, 10);
    axis.normalize(); // 向量归一化

    // 创建一个箭头帮助器对象
    // 必须要normalize才能使用arrowHelper
    const arrowHelper = new THREE.ArrowHelper(axis, new THREE.Vector3(0, 0, 0), 200, 0xff0000); // 参数分别为：方向向量、箭头起点、箭头长度、箭头颜色
    // 将箭头帮助器添加到场景中
    scene.add(arrowHelper);


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

    sphere.translateOnAxis(axis, 0.01)
    sphere.rotateOnAxis(axis, Math.PI / 31.4)
    // sphere.rotation.y += 0.01;

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