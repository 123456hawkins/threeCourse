<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

let scene: any
let camera: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any
let container: any
let lineMaterial: any, pointMaterial: any, meshMaterial: any
let textureCube: any, mesh: any
const loader = new GLTFLoader()
// 加载环境贴图
const initTexture = () => {
    // 加载环境贴图
    // 加载周围环境6个方向贴图
    // 上下左右前后6张贴图构成一个立方体空间
    // 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
    // 'py.jpg', 'ny.jpg'：y轴贴图
    // 'pz.jpg', 'nz.jpg'：z轴贴图
    textureCube = new THREE.CubeTextureLoader().setPath('/texture/park/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
    // 纹理和渲染器颜色空间一致
    // textureCube.encoding = THREE.sRGBEncoding;
}
const initMaterial = () => {
    // 点渲染模式
    pointMaterial = new THREE.PointsMaterial({
        // color: 0x333333,//使用顶点颜色数据，color属性可以不用设置
        vertexColors: true,//默认false，设置为true表示使用顶点颜色渲染
        size: 20.0, //点对象像素尺寸
    });
    lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true })
    meshMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide })
}

const importModel = () => {
    loader.load('/model/server1.glb', function (gltf) {
        console.log('gltf', gltf.scene.children[5]);
        mesh = gltf.scene.children[3]
        mesh.position.set(0, 5, 0)
        mesh.scale.set(5, 5, 5)
        scene.add(mesh)
        // mesh.scale.set(0.1, 0.1, 0.1)
        mesh.scale.set(50, 50, 50)

        // // 顶点数据
        const att = mesh.geometry.attributes;
        console.log('att', att);
        // // 顶点位置数据
        const pos = mesh.geometry.attributes.position;
        console.log('pos', pos);
        console.log('顶点数量：', pos.count);
        // 获取第一个顶点的x轴位置
        const x = pos.getX(0)
        console.log('x位置', x);
        // 设置第一个顶点的X轴位置
        pos.setX(23, 2)
        pos.setY(23, 2)
        pos.setZ(23, 2)
    })

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



    initTexture()
    importModel()
    initMaterial()

    initLight()
    // 如果你希望环境贴图影响场景中scene所有Mesh，可以通过Scene的场景环境属性.environment实现,把环境贴图对应纹理对象设置为.environment的属性值即可。
    scene.environment = textureCube
    scene.background = textureCube
    // camera = new THREE.PerspectiveCamera(
    //     75,
    //     window.innerWidth / (window.innerHeight - 60),
    //     1,
    //     1000
    // )
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 61),
        0.1,
        7000
    )
    camera.position.set(300, 300, 300)
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