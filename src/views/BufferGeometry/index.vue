<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js';
import { onMounted, nextTick, onUnmounted } from 'vue';

let geometry: any, line: any
let vertices: any
let scene: any
let camera: any
let axesHelper: any
let attribue: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any, material: any
const initGeometry = () => {
    geometry = new THREE.BufferGeometry()
    //类型化数组创建顶点数据
    vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        50, 0, 0, //顶点2坐标
        0, 100, 0, //顶点3坐标

        0, 0, 0, //顶点4坐标
        0, 0, 100, //顶点5坐标
        50, 0, 0, //顶点6坐标

        0, 0, 0,
        0, 100, 0,
        0, 0, 100
    ])
    // 创建属性缓冲区对象
    //3个为一组，表示一个顶点的xyz坐标
    attribue = new THREE.BufferAttribute(vertices, 3)
    // 设置几何体attributes属性的位置属性
    geometry.attributes.position = attribue;
}

const init = () => {

    threeContainer = document.createElement('div')
    document.querySelector("#app")!.appendChild(threeContainer)

    initGeometry()
    scene = new THREE.Scene()
    //面模型 
    material = new THREE.MeshBasicMaterial({
        color: 0xff3300, //设置材质颜色
        side: THREE.FrontSide//默认正面可见，DoubleSide双面可见，BackSide背面可见
    })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(5, 5, 5)
    scene.add(mesh)

    // 点模型
    // material = new THREE.PointsMaterial({ color: 0xffff00, size: 5.0 })
    // let point = new THREE.Points(geometry, material)
    // point.position.set(5, 5, 5)
    // scene.add(point)

    // 线模型
    // material = new THREE.LineBasicMaterial({ color: 0xff0 })
    // let line = new THREE.Line(geometry, material)
    // line.position.set(5, 5, 5)
    // scene.add(line)

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