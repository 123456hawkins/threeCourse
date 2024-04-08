<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
let line: any, sphere: any, cube: any, circle: any, geometry: any
let scene: any
let camera: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any, basicMaterial: any, LambertMaterial: any, PhongMaterial: any
let container: any
let axis: any
let mesh: any
const initMaterial = () => {
    const texLoader = new THREE.TextureLoader()
    const texture = texLoader.load('/texture/marble.jpg')
    // 设置阵列模式
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // uv两个方向纹理重复数量
    texture.repeat.set(6, 6);//注意选择合适的阵列数量
    LambertMaterial = new THREE.MeshLambertMaterial({ map: texture })
}
const intiPlane = () => {
    geometry = new THREE.PlaneGeometry(200, 200);
}
const initLight = () => {
    const color = 0xFFFFFF;
    const intensity = 10;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(3000, 3000, 3000);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);
}


const init = () => {

    threeContainer = document.createElement('div')
    document.querySelector("#allContainer")!.appendChild(threeContainer)

    scene = new THREE.Scene()
    intiPlane()
    initMaterial()



    initLight()
    mesh = new THREE.Mesh(geometry, LambertMaterial)
    container = new THREE.Group()
    container.add(mesh)
    container.position.set(50, 50, 50)
    scene.add(container)

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        10000
    )
    camera.position.set(350, 350, 350)
    camera.lookAt(0, 0, 0)
    scene.add(camera)

    // 自定义axis的方向
    // 创建一个表示方向的向量
    axis = new THREE.Vector3(10, 10, 10);
    axis.normalize(); // 向量归一化


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
    mesh.rotateX(0.01)
    renderer.render(scene, camera)
}
const relaseResource = () => {
    // requsetAnimationFrame销毁
    cancelAnimationFrame(animationId)
    // 渲染器销毁
    if (renderer) {

        renderer.dispose()
    }
    document.querySelector("#allContainer")!.removeChild(threeContainer)
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