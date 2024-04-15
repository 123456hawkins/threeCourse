<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
import * as dat from 'dat.gui'
const gui = new dat.GUI()

let line: any, sphere: any, cube: any
let scene: any
let camera: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any, basicMaterial: any, LamebertMateiral: any, PhongMaterial: any
let sphere1: any, sphere2: any, sphere3: any
let container: any
let axis: any
let mesh: any
let standardMaterial: any
const materialObj = {
    color: 0x11ff00,
    metalness: 1,
    roughness: 0.2
}
const initGui = () => {
    gui.domElement.style.position = 'fixed'
    gui.domElement.style.right = '0px'
    gui.domElement.style.top = '60px'
    const standardMaterialFolder = gui.addFolder('standardMaterial')
    standardMaterialFolder.addColor(materialObj, 'color').onChange((value: any) => {
        standardMaterial.color.set(value)
        renderer.render(scene, camera)
    })
    // 添加 roughness 控制器
    standardMaterialFolder.add(materialObj, 'metalness', 0, 1).onChange((value: any) => {
        standardMaterial.metalness = value
        renderer.render(scene, camera)
    })
    // 添加 roughness 控制器
    standardMaterialFolder.add(materialObj, 'roughness', 0, 1).onChange((value: any) => {
        standardMaterial.roughness = value
        renderer.render(scene, camera)
    })
}
const initMaterial = () => {
    standardMaterial = new THREE.MeshStandardMaterial({
        color: 0x11ff00,
        metalness: 1,
        roughness: 0.2,
    })
}
const initSpere = () => {
    sphere = new THREE.SphereGeometry(60, 25, 25)
    cube = new THREE.BoxGeometry(100, 100, 100)
}
const initLight = () => {
    const color = 0xFFFFFF;
    const intensity = 10;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(100, 100, 100);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);
}


const init = () => {

    threeContainer = document.createElement('div')
    document.querySelector("#allContainer")!.appendChild(threeContainer)

    scene = new THREE.Scene()
    //面模型 
    // wireframe: true可以看到geometry的面几何结构
    initSpere()
    initMaterial()

    initGui()

    initLight()
    mesh = new THREE.Mesh(sphere, standardMaterial)

    container = new THREE.Group()
    container.add(mesh)
    container.position.set(50, 50, 50)
    scene.add(container)

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        1000
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
    mesh.rotateY(0.01)
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