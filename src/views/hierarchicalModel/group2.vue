<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';

import { ArrowHelper } from 'three/src/Three.js';
import { log } from 'console';

let line: any, cube: any
let scene: any
let camera: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any, basicMaterial: any, LamebertMateiral: any, PhongMaterial: any
let sphere1: any, sphere2: any, sphere3: any
let axis: any
let group1: any, group2: any, model: any
const initMaterial = () => {
    basicMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    LamebertMateiral = new THREE.MeshLambertMaterial({ color: 0xf1f3f2 })
    PhongMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
}
const initCube = () => {
    cube = new THREE.BoxGeometry(20, 20, 20)
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
const initGroup = () => {
    group1 = new THREE.Group()
    group1.name = '高层'
    for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(cube, PhongMaterial)
        mesh.position.x = i * 30
        group1.add(mesh)
        mesh.name = i + 1 + '号楼'
    }
    group1.position.z = 50
    group1.position.y = 30

    group2 = new THREE.Group()
    group2.name = '洋房'
    for (let i = 0; i < 5; i++) {
        const mesh = new THREE.Mesh(cube, PhongMaterial)
        mesh.position.x = i * 30
        group2.add(mesh)
        mesh.name = i + 6 + '号楼'
    }
    group2.position.z = 50
    group2.position.y = 0

    model = new THREE.Group()
    model.name = '小区房子'
    model.add(group1)
    model.add(group2)
    model.position.set(0, 0, 0)

}
const init = () => {

    threeContainer = document.createElement('div')
    document.querySelector("#app")!.appendChild(threeContainer)

    scene = new THREE.Scene()
    //面模型 
    // wireframe: true可以看到geometry的面几何结构
    initCube()
    initMaterial()



    initLight()
    initGroup()
    scene.add(model)
    console.log(model);
    // 遍历group
    model.traverse((obj: any) => {
        console.log('所有模型节点', obj.name);
        if (obj.isMesh) {
            console.log('mesh', obj.name);

        }
    })
    // 获取某个具体模型.getObjectByName()
    const nameNode = model.getObjectByName("6号楼")
    console.log(nameNode);

    // nameNode.material.color.set(0xfff000);
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        1000
    )
    camera.position.set(150, 150, 150)
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