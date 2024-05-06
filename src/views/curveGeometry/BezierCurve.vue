<template>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
let line: any, sphere: any, geometry: any, geometry2: any
let scene: any
let camera: any, curve: any, lightPoint: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any
let container: any
let mesh: any, carMesh: any
let lineMaterial: any
let textureCube: any
let arr: any
let pointMaterial: any
// 初始化参数
const tDelta = 0.005; // 时间增量，控制光点沿着曲线的速度
let t = 0; // 时间变量，用于计算曲线上的位置
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
}
const initGeometry = () => {
    // 二维二次贝塞尔曲线
    // p1、p2、p3表示三个点坐标
    // // p1、p3是曲线起始点，p2是曲线的控制点
    // const p1 = new THREE.Vector2(-80, 0)
    // const p2 = new THREE.Vector2(20, 100);
    // const p3 = new THREE.Vector2(80, 0);

    // const curve = new THREE.QuadraticBezierCurve(p1, p2, p3)
    // const pointsArr = curve.getPoints(100)
    // geometry = new THREE.BufferGeometry()
    // geometry.setFromPoints(pointsArr)
    // // 点可视化
    // geometry2 = new THREE.BufferGeometry()
    // geometry2.setFromPoints([p1, p2, p3])

    // 三维二次贝塞尔曲线
    // 三维向量Vector3创建一组顶点坐标
    // const p1 = new THREE.Vector3(-50, 20, 90)
    // const p2 = new THREE.Vector3(-10, 40, 40)
    // const p3 = new THREE.Vector3(0, 0, 0)
    // // // 三维样条曲线
    // const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3)
    // // //曲线上获取点
    // const pointsArr = curve.getPoints(1000);
    // geometry = new THREE.BufferGeometry();
    // // //读取坐标数据赋值给几何体顶点
    // geometry.setFromPoints(pointsArr);

    // geometry2 = new THREE.BufferGeometry()
    // geometry2.setFromPoints([p1, p2, p3])

    // 二维三次贝塞尔曲线
    // 三维向量Vector3创建一组顶点坐标
    const p1 = new THREE.Vector3(-50, 20, 90)
    const p2 = new THREE.Vector3(-10, 40, 40)
    const p3 = new THREE.Vector3(-50, -50, -50)
    const p4 = new THREE.Vector3(80, 80, 80)
    // // 三维样条曲线
    curve = new THREE.CubicBezierCurve3(p1, p2, p3, p4)
    // //曲线上获取点
    const pointsArr = curve.getPoints(1000);
    geometry = new THREE.BufferGeometry();
    // //读取坐标数据赋值给几何体顶点
    geometry.setFromPoints(pointsArr);

    geometry2 = new THREE.BufferGeometry()
    geometry2.setFromPoints([p1, p2, p3, p4])

    

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
    lightPoint = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }))
    // 如果你希望环境贴图影响场景中scene所有Mesh，可以通过Scene的场景环境属性.environment实现,把环境贴图对应纹理对象设置为.environment的属性值即可。
    scene.environment = textureCube
    scene.background = textureCube
    container = new THREE.Group()
    container.add(line)
    container.add(points)
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
const changeLightPointPosition = () => {
    const pointOnCurve = curve.getPointAt(t)
    lightPoint.position.copy(pointOnCurve)
    t += tDelta;
    if (t > 1) {
        t = 0; // 重置时间，让光点重新从曲线起点开始移动
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