<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
let geometry: any, curve: any, geometry2: any
let scene: any
let camera: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any
let container: any
let lineMaterial: any, pointMaterial: any, meshMaterial: any
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

const initGeometry = () => {
    geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        50, 0, 0, //顶点2坐标
        0, 50, 0, //顶点3坐标
    ])
    // 顶点位置
    geometry.attributes.position = new THREE.BufferAttribute(vertices, 3)
    const colors = new Float32Array([
        1, 0, 0, //顶点1颜色
        0, 0, 1, //顶点2颜色
        0, 1, 0, //顶点3颜色
    ]);
    geometry.attributes.color = new THREE.BufferAttribute(colors, 3)

    // 渐变曲线
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-50, 20, 90),
        new THREE.Vector3(-10, 40, 40),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(60, -60, 0),
        new THREE.Vector3(70, 0, 80)
    ]);
    const pointsArr = curve.getSpacedPoints(100)

    geometry2 = new THREE.BufferGeometry()
    geometry2.setFromPoints(pointsArr)
    const pos = geometry2.attributes.position
    const count = pos.count//顶点数量
    const colorsArr = []
    const c1 = new THREE.Color(0X00FFFF)
    const c2 = new THREE.Color(0xffff00)
    for (let i = 0; i < count; i++) {
        const percent = i / count;
        // colorsArr.push(percent, 0, 1 - percent)//蓝色到红色渐变
        const c = c1.clone().lerp(c2, percent);//颜色插值计算
        colorsArr.push(c.r, c.g, c.b)
    }
    const colors2 = new Float32Array(colorsArr)
    geometry2.attributes.color = new THREE.BufferAttribute(colors2, 3)

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

    initGeometry()

    initTexture()
    initMaterial()

    initLight()
    const points = new THREE.Points(geometry, pointMaterial)
    const line = new THREE.Line(geometry, lineMaterial)
    const mesh = new THREE.Mesh(geometry, meshMaterial)
    const curve = new THREE.Line(geometry2, lineMaterial)
    // 如果你希望环境贴图影响场景中scene所有Mesh，可以通过Scene的场景环境属性.environment实现,把环境贴图对应纹理对象设置为.environment的属性值即可。
    scene.environment = textureCube
    scene.background = textureCube
    container = new THREE.Group()
    // container.position.set(5, 5, 5)
    scene.add(container)
    container.add(points)
    container.add(line)
    container.add(mesh)
    container.add(curve)
    line.position.set(20, 20, 0)
    mesh.position.set(40, 40, 0)
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        500
    )
    camera.position.set(0, 0, 200)
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