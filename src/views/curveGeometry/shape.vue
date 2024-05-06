<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
let line: any, sphere: any, geometry: any, geometry2: any, holeGeometry: any, extrudeGeometry: any, holeShape: any, shape: any, shapeGeometry: any
let scene: any
let camera: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any
let container: any
let mesh: any, carMesh: any
let lineMaterial: any
let textureCube: any
let arr: any
let pointMaterial: any, basicMaterial: any, basicMaterial2: any
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

    lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    });
    pointMaterial = new THREE.PointsMaterial({
        color: 0xff00ff,
        size: 10
    })
    basicMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        side: THREE.DoubleSide,
        wireframe: true
    })
    basicMaterial2 = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
    })
}
const initHoleGeometry = () => {
    const pointsArr = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(100, 0),
        new THREE.Vector2(100, 100),
        new THREE.Vector2(0, 100)
    ]
    holeShape = new THREE.Shape(pointsArr)
    const path1 = new THREE.Path()
    const path2 = new THREE.Path()
    const path3 = new THREE.Path()
    path1.absarc(20, 20, 10, 0, 2 * Math.PI)
    path2.absarc(80, 20, 10, 0, 2 * Math.PI)
    path3.moveTo(20, 50)
    path3.lineTo(80, 50)
    path3.lineTo(80, 80)
    path3.lineTo(20, 80)
    holeShape.holes.push(path1, path2, path3)
    holeGeometry = new THREE.ShapeGeometry(holeShape)
}
const initExtrudeGeometry = () => {
    const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(20, 20, 20)
    ])
    extrudeGeometry = new THREE.ExtrudeGeometry(
        holeShape,
        {
            depth: 100,
            extrudePath: curve,
            bevelThickness: 1,
            bevelSize: 1,
            bevelSegments: 20
        }
    )
}
const initShapeGeometry = () => {
    const pointsArr = [
        new THREE.Vector2(-50, -50),
        new THREE.Vector2(-50, 0),
        new THREE.Vector2(0, 50),
        new THREE.Vector2(50, 0),
        new THREE.Vector2(50, -50),
    ];
    // 这一组二维顶点坐标作为Shape的参数构成一个多边形轮廓。
    shape = new THREE.Shape(pointsArr)
    // shape.moveTo(80, 80)
    // shape.lineTo(80, 0)

    // moveTo方法改变currentPoint
    console.log(shape.currentPoint);
    shape.moveTo(0, 0)
    // 圆弧.arc参数的圆心0,0坐标是相对当前.currentPoint而言，而不是坐标原点
    shape.arc(0, -50, 50, 0, Math.PI / 2)
    console.log(shape.currentPoint);
    shape.moveTo(0, 0)
    shape.arc(0, -50, 50, Math.PI / 2, Math.PI)
    shapeGeometry = new THREE.ShapeGeometry(shape)
    shape.moveTo(-50, -50)
    shape.lineTo(50, -50)
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

    initShapeGeometry()
    initHoleGeometry()
    initExtrudeGeometry()

    initTexture()
    initMaterial()

    initLight()


    const shapeMesh = new THREE.Mesh(shapeGeometry, basicMaterial)
    const holeMesh = new THREE.Mesh(holeGeometry, basicMaterial)
    const extrudeMesh = new THREE.Mesh(extrudeGeometry, basicMaterial2)
    // 如果你希望环境贴图影响场景中scene所有Mesh，可以通过Scene的场景环境属性.environment实现,把环境贴图对应纹理对象设置为.environment的属性值即可。
    scene.environment = textureCube
    scene.background = textureCube
    container = new THREE.Group()
    console.log(holeMesh);

    container.add(holeMesh)
    container.add(shapeMesh)
    container.add(extrudeMesh)

    holeMesh.position.set(50, 50, 50)
    extrudeMesh.position.set(50, 50, 100)
    // container.position.set(5, 5, 5)
    scene.add(container)
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