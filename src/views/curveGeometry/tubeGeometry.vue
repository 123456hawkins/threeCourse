<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
let line: any, sphere: any, geometry: any, geometry2: any, tubeGeometry: any, tubeGeometry2: any
let scene: any
let camera: any, curve: any, lightPoint: any, curvePath: any, pointOnCurve: any, pointsArr: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any
let container: any
let mesh: any, carMesh: any
let lineMaterial: any, basicMaterial: any, innerMaterial: any
let textureCube: any
let arr: any
let pointMaterial: any
let pointIndex = 0; // 时间变量，用于计算曲线上的位置
// 加载环境贴图
const initTexture = () => {
    textureCube = new THREE.CubeTextureLoader().setPath('/texture/park/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'])
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
        color: 0xd51a1a,
        side: THREE.DoubleSide
    })
    innerMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide
    })

}
const initGeometry = () => {

    // 圆弧曲线
    const R = 80//圆弧半径
    const H = 200//直线高度
    // 直线1
    const line1 = new THREE.LineCurve3(new THREE.Vector3(R, -H, 0), new THREE.Vector3(R, 0, 0))
    const line2 = new THREE.LineCurve3(new THREE.Vector3(-R, 0, 0), new THREE.Vector3(-R, -H, 0))
    // 圆弧
    const arcPoints = []
    for (let i = 0; i < 505; i++) {
        const theta = i / 500 * Math.PI;
        const x = Math.cos(theta) * 80;
        const y = Math.sin(theta) * 80;
        const z = 0
        arcPoints.push(new THREE.Vector3(x, y, z))
    }
    const arc = new THREE.CatmullRomCurve3(arcPoints)

    curvePath = new THREE.CurvePath()
    curvePath.add(line1)
    curvePath.add(arc)
    curvePath.add(line2)

    pointsArr = curvePath.getSpacedPoints(1000);
    console.log(pointsArr);

    //管道路径
    tubeGeometry = new THREE.TubeGeometry(curvePath, 200, 5, 80, false)
    tubeGeometry2 = new THREE.TubeGeometry(curvePath, 200, 4.9, 80, false)
    geometry = new THREE.BufferGeometry();
    geometry.setFromPoints(pointsArr)

    geometry2 = new THREE.BufferGeometry()
    geometry2.setFromPoints([new THREE.Vector3(R, -H, 0), new THREE.Vector3(R, 0, 0), new THREE.Vector3(-R, 0, 0), new THREE.Vector3(-R, -H, 0)])


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
    line = new THREE.Line(geometry, lineMaterial)
    const points = new THREE.Points(geometry2, pointMaterial)
    const tube = new THREE.Mesh(tubeGeometry, basicMaterial)
    const innerTube = new THREE.Mesh(tubeGeometry2, innerMaterial)
    lightPoint = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }))
    // 如果你希望环境贴图影响场景中scene所有Mesh，可以通过Scene的场景环境属性.environment实现,把环境贴图对应纹理对象设置为.environment的属性值即可。
    scene.environment = textureCube
    scene.background = textureCube
    container = new THREE.Group()
    container.add(line)
    // container.add(points)
    container.add(tube)
    container.add(innerTube)
    lightPoint.position.set(-50, 20, 90)
    scene.add(lightPoint)
    // container.position.set(5, 5, 5)
    scene.add(container)

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / (window.innerHeight - 60),
        0.1,
        500
    )
    camera.position.set(0, 0, 400)
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
const changeLightPointPosition = () => {
    lightPoint.position.copy(pointsArr[pointIndex])
    pointIndex++;
    if (pointIndex >= 1000) {
        pointIndex = 0; // 重置点索引，让小圆球重新从曲线路径起点开始移动
    }

}
const animate = () => {
    animationId = requestAnimationFrame(animate)
    changeLightPointPosition()
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