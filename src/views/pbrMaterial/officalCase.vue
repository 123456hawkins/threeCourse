<template>
    <button style="position: absolute;" @click="saveFile">保存渲染的图片</button>
</template>

<script setup lang='ts'>
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { onMounted, nextTick, onUnmounted } from 'vue';
import { FlakesTexture } from 'three/addons/textures/FlakesTexture.js';

let scene: any
let camera: any
let axesHelper: any
let renderer: any
let threeContainer: any
let animationId: any, controls: any
let particleLight: any;
let group: any
const saveFile = () => {
    // 创建一个超链接元素，用来下载保存数据的文件
    const link = document.createElement('a');
    // 通过超链接herf属性，设置要保存到文件中的数据
    const canvas = renderer.domElement; //获取canvas对象
    link.href = canvas.toDataURL("image/png");
    link.download = 'pic.png';//下载文件名
    link.click();//js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
}
// 加载环境贴图
const initTexture = () => {
    // 加载环境贴图
    // 加载周围环境6个方向贴图
    // 上下左右前后6张贴图构成一个立方体空间
    // 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
    // 'py.jpg', 'ny.jpg'：y轴贴图
    // 'pz.jpg', 'nz.jpg'：z轴贴图
    new THREE.CubeTextureLoader().setPath('/texture/park/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'], function (texture) {
        const geometry = new THREE.SphereGeometry(.8, 64, 32)

        const textureLoader = new THREE.TextureLoader()

        const diffuse = textureLoader.load('/texture/carbon/Carbon.png')
        diffuse.colorSpace = THREE.SRGBColorSpace;
        diffuse.wrapS = THREE.RepeatWrapping;
        diffuse.wrapT = THREE.RepeatWrapping;
        diffuse.repeat.x = 10;
        diffuse.repeat.y = 10;

        const normalMap = textureLoader.load('/texture/carbon/Carbon_Normal.png');
        normalMap.wrapS = THREE.RepeatWrapping;
        normalMap.wrapT = THREE.RepeatWrapping;
        normalMap.repeat.x = 10;
        normalMap.repeat.y = 10;

        const normalMap2 = textureLoader.load('/texture/water/Water_1_M_Normal.jpg');

        // FlakesTexture 生成了一种雪花或者类似的纹理
        // CanvasTexture 是一种通过绘制 2D 图形或者图像来创建纹理的方法
        const normalMap3 = new THREE.CanvasTexture(new FlakesTexture());
        normalMap3.wrapS = THREE.RepeatWrapping;
        normalMap3.wrapT = THREE.RepeatWrapping;
        normalMap3.repeat.x = 10;
        normalMap3.repeat.y = 6;
        normalMap3.anisotropy = 16;

        const normalMap4 = textureLoader.load('/texture/golfball.jpg');

        const clearcoatNormalMap = textureLoader.load('/texture/pbr/Scratched_gold_01_1K_Normal.png');

        //car paint
        let material = new THREE.MeshPhysicalMaterial({
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            metalness: 0.9,
            roughness: 0.5,
            color: 0x0000ff,
            normalMap: normalMap3,
            normalScale: new THREE.Vector2(0.15, 0.15)
        })
        let mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = -1
        mesh.position.y = 1
        group.add(mesh)

        // fibers
        material = new THREE.MeshPhysicalMaterial({
            roughness: 0.5,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            map: diffuse,
            normalMap: normalMap
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 1;
        mesh.position.y = 1;
        group.add(mesh);


        // golf

        material = new THREE.MeshPhysicalMaterial({
            metalness: 0.0,
            roughness: 0.1,
            clearcoat: 1.0,
            normalMap: normalMap4,
            clearcoatNormalMap: clearcoatNormalMap,

            // y scale is negated to compensate for normal map handedness.
            clearcoatNormalScale: new THREE.Vector2(2.0, - 2.0)
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = - 1;
        mesh.position.y = - 1;
        group.add(mesh);

        // clearcoat + normalmap

        material = new THREE.MeshPhysicalMaterial({
            clearcoat: 1.0,
            metalness: 1.0,
            color: 0xff0000,
            normalMap: normalMap2,
            normalScale: new THREE.Vector2(0.15, 0.15),
            clearcoatNormalMap: clearcoatNormalMap,

            // y scale is negated to compensate for normal map handedness.
            clearcoatNormalScale: new THREE.Vector2(2.0, - 2.0)
        });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 1;
        mesh.position.y = - 1;
        group.add(mesh);

        scene.background = texture
        // 不用再单独给每个模型设计envMap了
        scene.environment = texture
    })

}

const initLight = () => {
    particleLight = new THREE.Mesh(
        new THREE.SphereGeometry(.05, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    scene.add(particleLight)
    particleLight.add(new THREE.PointLight(0xffffff, 30))
}


const init = () => {

    threeContainer = document.createElement('div')
    document.querySelector("#allContainer")!.appendChild(threeContainer)

    scene = new THREE.Scene()
    group = new THREE.Group()
    scene.add(group)
    //面模型 
    // wireframe: true可以看到geometry的面几何结构
    initTexture()

    initLight()



    camera = new THREE.PerspectiveCamera(27, window.innerWidth / window.innerHeight, 0.25, 50);
    camera.position.z = 10;

    scene.add(camera)




    axesHelper = new THREE.AxesHelper(150)
    scene.add(axesHelper)
    // 初始化渲染器
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 是否执行抗锯齿。默认为false
        logarithmicDepthBuffer: true, // 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。
        //想把canvas画布上内容下载到本地，需要设置为true
        preserveDrawingBuffer: true,
    })
    renderer.setClearAlpha(0.0);
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight - 61)
    threeContainer!.appendChild(renderer.domElement)
    // 使用渲染器，通过相机将场景渲染进来
    controls = new OrbitControls(camera, renderer.domElement)
    controls.minDistance = 3;
    controls.maxDistance = 30;
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
    const timer = Date.now() * 0.00025
    particleLight.position.x = Math.sin(timer * 7) * 3;
    particleLight.position.y = Math.cos(timer * 5) * 4;
    particleLight.position.z = Math.cos(timer * 3) * 3;
    for (let i = 0; i < group.children.length; i++) {
        const child = group.children[i]
        child.rotation.y += .005
    }
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

<style></style>import type { link } from 'fs';
