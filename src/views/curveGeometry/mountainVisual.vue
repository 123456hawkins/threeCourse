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
// 红点遍历顶点动画
// const traverseAnimate=()=>{
//     const material=new THREE.PointsMaterial({color:0xff0000})
//     const points=new THREE.Points()
// }
const importModel = () => {
    loader.load('/model/mountain1.glb', function (gltf) {

        mesh = gltf.scene.children[0].children[0].children[0]
        scene.add(mesh)
        // mesh.rotation.x = Math.PI * 1.5
        // mesh.rotation.z = Math.PI * 1.5
        // mesh.scale.set(0.1, 0.1, 0.1)

        // // // 顶点位置数据
        const pos = mesh.geometry.attributes.position;
        // 创建一个边界框对象，用于存储模型的边界信息
        const boundingBox = new THREE.Box3()
        boundingBox.setFromObject(mesh)
        const size = new THREE.Vector3()
        boundingBox.getSize(size)
        console.log('模型大小', size.x, size.y, size.z);

        const boundingBoxHelper = new THREE.Box3Helper(boundingBox, 0XFFFF00)
        scene.add(boundingBoxHelper)

        // uv坐标
        // const uv = mesh.geometry.attributes.uv
        // const uvAarr = []
        // for (let i = 0; i < uv.count; i++) {
        //     uvAarr.push({ x: uv.getX(i), y: uv.getY(i) })
        // }
        // 计算模型y坐标高度差
        const zArr = []
        for (let i = 0; i < pos.count; i++) {
            zArr.push(pos.getZ(i))
        }

        // console.log('ARRAY', pos.array, pos.array[0]);

        zArr.sort((a, b) => a - b)
        const minZ = zArr[0]
        const maxZ = zArr[pos.count - 1]
        const height = maxZ - minZ

        // 等分模型
        divideModel(size, boundingBox, pos.array)

        computedLerpColor(minZ, height, pos)
        // getSameHeightList(minZ, height, pos)
    })
}
const divideModel = (size: any, boundingBox: any, positions: any) => {

    // 指定要等分的行数和列数
    const numRows = 10; // 行数
    const numCols = 10; // 列数

    // 计算每个部分的大小
    const partSizeX = (boundingBox.max.x - boundingBox.min.x) / numCols;
    const partSizeY = (boundingBox.max.y - boundingBox.min.y) / numRows;

    // 切割原始顶点数据并创建新的几何体
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            // 创建新的几何体
            const geometry = new THREE.BufferGeometry();

            // 计算当前网格的顶点索引范围
            const startIndex = (row * numCols + col) * 3 * 3; // 每个顶点有3个坐标，每个三角形有3个顶点
            const endIndex = startIndex + 3 * 3 * 3; // 一个三角形有3个顶点，每个顶点有3个坐标

            // 切割原始顶点数据
            const slicedPositions = positions.slice(startIndex, endIndex);

            // 将切割后的顶点数据设置到新的几何体中
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(slicedPositions), 3));

            // 创建网格对象并设置位置
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const plane = new THREE.Mesh(geometry, material);

            const posX = boundingBox.min.x + col * partSizeX + partSizeX / 2;
            const posY = boundingBox.min.y + row * partSizeY + partSizeY / 2;
            const posZ = boundingBox.min.z;
            plane.position.set(posX, posY, posZ);

            // 将网格添加到场景中
            scene.add(plane);
        }
    }

}
// marching squares算法实现

// 每个点的数据
interface MesureDate {
    x: number,
    y: number,
    z: number
}
interface IntMesureData {

}
// 返回同一高度list
const getSameHeightList = (minZ: number, height: number, pos: any) => {
    const step = 100
    const sameHeightList: number[][] = []
    for (let i = 0; i < step + 1; i++) {
        sameHeightList.push([])
    }
    // console.log('sameHeightList', sameHeightList);
    for (let i = 0; i < pos.count; i++) {
        const vertexHeight = pos.getZ(i);
        const groupIndex = Math.floor((vertexHeight - minZ) / (height / step))
        sameHeightList[groupIndex].push(i)
    }
    // console.log('sameHeightList', sameHeightList);
    drawSameHeightList(minZ, height, pos, step, sameHeightList)
}
// 绘制等高线
const drawSameHeightList = (minZ: number, height: number, pos: any, step: number, sameHeightList: number[][]) => {
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 })
    if (sameHeightList.length) {
        for (let i = 0; i < sameHeightList.length; i++) {
            const sameHeightIndex = sameHeightList[i][0]
            const vertices = sameHeightList[i].map(index => {
                const x = pos.getX(index)
                const y = pos.getY(index)
                const z = pos.getZ(sameHeightIndex)
                return new THREE.Vector3(x, y, z)
            })
            const curve = new THREE.CatmullRomCurve3(vertices)
            const points = curve.getPoints(vertices.length * 5)

            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const line = new THREE.LineLoop(geometry, lineMaterial)
            scene.add(line)
        }
    }
}

const computedLerpColor = (minZ: number, height: number, pos: any) => {
    const colorsArr = [];
    const lowestColor = new THREE.Color(0x0000ff);
    const hightestColor = new THREE.Color(0xff0000);
    const midColor = new THREE.Color(0xffff00); // 中间颜色，你可以根据需要调整
    for (let i = 0; i < pos.count; i++) {
        const percent = (pos.getZ(i) - minZ) / height;
        let color;
        if (percent < 0.5) {
            color = lowestColor.clone().lerp(midColor, percent * 2);
        } else {
            color = midColor.clone().lerp(hightestColor, (percent - 0.5) * 2);
        }
        colorsArr.push(color.r, color.g, color.b);
    }
    const colors = new Float32Array(colorsArr);
    mesh.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);
    mesh.material = new THREE.MeshBasicMaterial({
        vertexColors: true
        // map: new THREE.TextureLoader().load('/texture/mountainTexture.jpeg')
    });
}
// 计算山体渐变色
// const computedLerpColor = (minZ: number, height: number, pos: any) => {
//     const colorsArr = []
//     const lowestColor = new THREE.Color(0x0000ff)
//     const hightestColor = new THREE.Color(0xffff00)
//     for (let i = 0; i < pos.count; i++) {
//         const percent = (pos.getZ(i) - minZ) / height
//         const color = lowestColor.clone().lerp(hightestColor, percent)
//         colorsArr.push(color.r, color.b, color.b)
//     }
//     const colors = new Float32Array(colorsArr)
//     mesh.geometry.attributes.color = new THREE.BufferAttribute(colors, 3)
//     mesh.material = new THREE.MeshBasicMaterial({
//         vertexColors: true
//     })
// }
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
        10000
    )
    camera.position.set(3000, 3000, 3000)
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