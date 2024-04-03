<template>
    bufferGeometry
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted } from 'vue';

let geometry
let vertices
let scene
let camera
let axesHelper
let attribue

const init = () => {
    geometry = new THREE.BufferGeometry()
    //类型化数组创建顶点数据
    vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        50, 0, 0, //顶点2坐标
        0, 100, 0, //顶点3坐标
        0, 0, 10, //顶点4坐标
        0, 0, 100, //顶点5坐标
        50, 0, 10, //顶点6坐标
    ])
    // 创建属性缓冲区对象
    //3个为一组，表示一个顶点的xyz坐标
    attribue = new THREE.BufferAttribute(vertices, 3)
    scene = new THREE.Scene()
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
}
onMounted(() => {

})
</script>

<style></style>