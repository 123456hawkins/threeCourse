<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
import * as dat from 'dat.gui'
const gui = new dat.GUI()
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
let line: any, sphere: any, cube: any
let scene: any
let camera: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any
let container: any
let mesh: any, carMesh: any
let physicalMaterial: any
let textureCube: any
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
    textureCube.encoding = THREE.sRGBEncoding;
}
const materialObj = {
    color: 0xffffff,
    metalness: 1,
    roughness: 0.0,
    envMapIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 1.0,
    reflectivity: 1.0,
    sheen: 1.0,
    ior: 1.0,
    transmission: 1.0
}
const initGui = () => {
    gui.domElement.style.position = 'fixed'
    gui.domElement.style.right = '0px'
    gui.domElement.style.top = '60px'
    const MeshPhysicalMaterialFolder = gui.addFolder('physicalMaterial')
    MeshPhysicalMaterialFolder.addColor(materialObj, 'color').onChange((value: any) => {
        physicalMaterial.color.set(value)
        renderer.render(scene, camera)
    })
    // 添加 roughness 控制器
    MeshPhysicalMaterialFolder.add(materialObj, 'metalness', 0, 1).onChange((value: any) => {
        physicalMaterial.metalness = value
        renderer.render(scene, camera)
    })
    // 添加 roughness 控制器
    MeshPhysicalMaterialFolder.add(materialObj, 'roughness', 0, 1).onChange((value: any) => {
        physicalMaterial.roughness = value
        renderer.render(scene, camera)
    })
    // 添加清漆
    MeshPhysicalMaterialFolder.add(materialObj, 'clearcoat', 0, 1).onChange((value: any) => {
        physicalMaterial.clearcoat = value
        renderer.render(scene, camera)
    })
    // 添加清漆粗糙度
    MeshPhysicalMaterialFolder.add(materialObj, 'clearcoatRoughness', 0, 1).onChange((value: any) => {
        physicalMaterial.clearcoatRoughness = value
        renderer.render(scene, camera)
    })
    // 添加折射率
    MeshPhysicalMaterialFolder.add(materialObj, 'reflectivity', 0, 1).onChange((value: any) => {
        physicalMaterial.reflectivity = value
        renderer.render(scene, camera)
    })
    // 添加光泽
    MeshPhysicalMaterialFolder.add(materialObj, 'sheen', 0, 1).onChange((value: any) => {
        physicalMaterial.sheen = value
        renderer.render(scene, camera)
    })
    // 添加折射率
    MeshPhysicalMaterialFolder.add(materialObj, 'ior', 1.0, 2.333).onChange((value: any) => {
        physicalMaterial.ior = value
        renderer.render(scene, camera)
    })
    // 添加透光率
    MeshPhysicalMaterialFolder.add(materialObj, 'transmission', 0, 1).onChange((value: any) => {
        physicalMaterial.transmission = value
        renderer.render(scene, camera)
    })


}
const initMaterial = () => {
    physicalMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.0,
        envMap: textureCube,//设置环境贴图
        envMapIntensity: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 1.0,
        reflectivity: 1.0,
        sheen: 1.0,
        ior: 1.0,//折射率
        transmission: 1.0//透光率
    })
}
const initSpere = () => {
    sphere = new THREE.SphereGeometry(20, 50, 50)
    cube = new THREE.BoxGeometry(20, 500, 500)
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
    initTexture()
    initMaterial()
    initGui()

    initLight()
    mesh = new THREE.Mesh(sphere, physicalMaterial)

    // 如果你希望环境贴图影响场景中scene所有Mesh，可以通过Scene的场景环境属性.environment实现,把环境贴图对应纹理对象设置为.environment的属性值即可。
    scene.environment = textureCube
    container = new THREE.Group()
    container.add(mesh)
    container.position.set(5, 5, 5)
    scene.add(container)

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        500
    )
    camera.position.set(100, 100, 100)
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