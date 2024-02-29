<template>
  <div id="threejs" class="container"></div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 引入gui
import * as dat from 'dat.gui'
const gui = new dat.GUI()
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'
const stats0 = new Stats()
const stats1 = new Stats()
const stats2 = new Stats()

// 设置定时器id
let animationId
stats0.showPanel(0)
stats1.showPanel(1)
stats2.showPanel(2)
import { onMounted, ref, nextTick, onUnmounted } from 'vue'

// 1、创建场景
const scene = new THREE.Scene()

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / (window.innerHeight - 60),
  0.1,
  1000
)

// 设置相机位置
camera.position.set(10, 10, 10)
camera.lookAt(0, 0, 0)
scene.add(camera)

// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150)
scene.add(axesHelper)

// 添加物体
// 创建几何体
let sphereGeometry = new THREE.SphereGeometry(1, 32, 16)
const cubeGeometry2 = new THREE.CapsuleGeometry(1, 1, 4, 8)
const cubeGeometry3 = new THREE.TetrahedronGeometry(1, 5)

// 漫反射材质
const cubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xff3300,
  metalness: 1,
  roughness: 0.3,
})
// 高光材质
const cubeMaterial2 = new THREE.MeshStandardMaterial({
  color: 0x0b56eb,
  metalness: 1, // 控制金属感
  roughness: 0.4, // 控制光滑度
})
const cubeMaterial3 = new THREE.MeshStandardMaterial({
  color: 0x11ff00,
  metalness: 1,
  roughness: 0.2,
})

// 根据几何体和材质创建物体
const sphere = new THREE.Mesh(sphereGeometry, cubeMaterial)
const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2)
const cube3 = new THREE.Mesh(cubeGeometry3, cubeMaterial3)

// 设置几何体位置
sphere.position.set(3, 0, 0)
cube2.position.set(0, 3, 0)
cube3.position.set(0, 0, 3)

// 用于gui操作
const sphereObj = {
  x: 3,
  y: 0,
  z: 0,
  radius: 1,
  widthSegments: 32,
  heightSegments: 16,
  phiStart: 0,
  phiLength: Math.PI * 2,
  thetaStart: 0,
  thetaLength: Math.PI,
}

// 将几何体添加到场景中
scene.add(sphere)
scene.add(cube2)
scene.add(cube3)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 是否执行抗锯齿。默认为false
  logarithmicDepthBuffer: true, // 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。
})

const pointLight = new THREE.PointLight(0xffffff, 10, 0, 0)
pointLight.position.set(30, 30, 30)
const pointLightObj = {
  x: 30,
  y: 30,
  z: 30,
  color: new THREE.Color(0xffffff),
  intensity: 10,
  distance: 0,
  decay: 0,
}
scene.add(pointLight)

// 模拟辅助光线对象
const sphereSize = 3
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize)
scene.add(pointLightHelper)

const updatePointLightLocation = () => {
  pointLight.position.set(pointLightObj.x, pointLightObj.y, pointLightObj.z)
}
const updateSphereLocation = () => {
  sphere.position.set(sphereObj.x, sphereObj.y, sphereObj.z)
}
const updateSphereShape = () => {
  sphereGeometry.dispose()
  sphereGeometry = new THREE.SphereGeometry(
    sphereObj.radius,
    sphereObj.widthSegments,
    sphereObj.heightSegments,
    sphereObj.phiStart,
    sphereObj.phiLength,
    sphereObj.thetaStart,
    sphereObj.thetaLength
  )
  sphere.geometry = sphereGeometry
}
// 渲染函数
// 循环渲染事件
const render = () => {
  stats0.update()
  stats1.update()
  stats2.update()
  sphere.rotateY(0.01)
  cube2.rotateX(0.02)
  cube3.rotateZ(0.03)
  renderer.render(scene, camera)
  animationId = requestAnimationFrame(render)
}
const addStatsDom = () => {
  // 设置 Stats 的位置
  stats0.dom.style.position = 'fixed'
  stats0.dom.style.left = '0px'
  stats0.dom.style.top = '60px'

  stats1.dom.style.position = 'fixed'
  stats1.dom.style.left = '80px' // Adjust this value as needed
  stats1.dom.style.top = '60px'

  stats2.dom.style.position = 'fixed'
  stats2.dom.style.left = '160px' // Adjust this value as needed
  stats2.dom.style.top = '60px'

  document.body.appendChild(stats0.dom)
  document.body.appendChild(stats1.dom)
  document.body.appendChild(stats2.dom)
}
const removeStatsDom = () => {
  document.body.removeChild(stats0.dom)
  document.body.removeChild(stats1.dom)
  document.body.removeChild(stats2.dom)
}
const InitGui = () => {
  gui.domElement.style.position = 'fixed'
  gui.domElement.style.right = '0px'
  gui.domElement.style.top = '60px'

  const sphereFolder = gui.addFolder('redSphere')
  // 遍历生成
  // for (const property in sphereObj) {
  //   if (Object.prototype.hasOwnProperty.call(sphereObj, property)) {
  //     // 添加GUI控件
  //     sphereFolder.add(sphereObj, property, 0, 10).onChange(() => {
  //       updateSphereLocation()
  //     })
  //   }
  // }
  sphereFolder.add(sphereObj, 'x', 0, 10).onChange(() => {
    updateSphereLocation()
  })
  sphereFolder.add(sphereObj, 'y', 0, 10).onChange(() => {
    updateSphereLocation()
  })
  sphereFolder.add(sphereObj, 'z', 0, 10).onChange(() => {
    updateSphereLocation()
  })
  sphereFolder.add(sphereObj, 'radius', 0, 10).onChange((value) => {
    sphereObj.radius = value
    updateSphereShape()
  })
  sphereFolder
    .add(sphereObj, 'widthSegments', 0, 32)
    .step(1)
    .onChange((value) => {
      sphereObj.widthSegments = value
      updateSphereShape()
    })
  sphereFolder
    .add(sphereObj, 'heightSegments', 0, 16)
    .step(1)
    .onChange((value) => {
      sphereObj.heightSegments = value
      updateSphereShape()
    })
  sphereFolder.add(sphereObj, 'phiStart', 0, Math.PI * 2).onChange((value) => {
    sphereObj.phiStart = value
    updateSphereShape()
  })
  sphereFolder.add(sphereObj, 'phiLength', 0, Math.PI * 2).onChange((value) => {
    sphereObj.phiLength = value
    updateSphereShape()
  })
  sphereFolder.add(sphereObj, 'thetaStart', 0, Math.PI).onChange((value) => {
    sphereObj.thetaStart = value
    updateSphereShape()
  })
  sphereFolder.add(sphereObj, 'thetaLength', 0, Math.PI).onChange((value) => {
    sphereObj.thetaLength = value
    updateSphereShape()
  })

  const lightFolder = gui.addFolder('pointLight')
  lightFolder.add(pointLightObj, 'x', -80, 80).onChange(() => {
    updatePointLightLocation()
  })
  lightFolder.add(pointLightObj, 'y', -80, 80).onChange(() => {
    updatePointLightLocation()
  })
  lightFolder.add(pointLightObj, 'z', -80, 80).onChange(() => {
    updatePointLightLocation()
  })
  lightFolder.addColor(pointLightObj, 'color').onChange((value) => {
    pointLight.color = value
  })
  lightFolder
    .add(pointLightObj, 'intensity', 0, 40)
    .step(0.1)
    .onChange((value) => {
      pointLight.intensity = value
    })
  lightFolder.add(pointLightObj, 'distance', 0, 1).onChange((value) => {
    pointLight.distance = value
  })
  lightFolder
    .add(pointLightObj, 'decay', 0, 2)
    .step(0.1)
    .onChange((value) => {
      pointLight.decay = value
    })
}
onMounted(() => {
  // 将webgl渲染的canvas内容添加到body
  const threeContainer = document.getElementById('threejs')
  nextTick(() => {
    // 设置渲染的尺寸大小
    renderer.setSize(window.innerWidth, window.innerHeight - 60)
    threeContainer!.appendChild(renderer.domElement)
    InitGui()
    addStatsDom()
    render()
  })
})
// 退出页面释放资源
const relaseResource = () => {
  // requsetAnimationFrame销毁
  cancelAnimationFrame(animationId)
  removeStatsDom()
  // pointLight销毁
  pointLight.dispose()
  pointLightHelper.dispose()
  // GUI销毁
  gui.destroy()
  // 渲染器销毁
  renderer.dispose()
  // Material销毁
  cubeMaterial.dispose()
  cubeMaterial2.dispose()
  cubeMaterial3.dispose()
  // Geometry销毁
  sphereGeometry.dispose()
  cubeGeometry2.dispose()
  cubeGeometry3.dispose()
}
onUnmounted(() => {
  relaseResource()
})
window.addEventListener('resize', () => {
  // 修改相机配置
  camera.aspect = window.innerWidth / (window.innerHeight - 60)
  // 更新投影矩阵
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight - 60)
})
// 使用渲染器，通过相机将场景渲染进来
// 使用了循环渲染事件，就不用再通过事件change执行了
// renderer.render(scene, camera)
const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', () => {
  renderer.render(scene, camera)
})
</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
}
</style>
