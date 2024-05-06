<template></template>
<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
// 导入模型
// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

// 边缘高亮组件
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

// 导入css2d标志的依赖
import {
  CSS2DRenderer,
  CSS2DObject,
} from 'three/addons/renderers/CSS2DRenderer.js'
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js'
let stats0: any

const loader = new GLTFLoader()


// 创建射线投射器
let raycaster: any
let selectedObjects: any = []
let pointer = { x: 0, y: 0 }
let camera: any,
  scene: any,
  renderer: any,
  axesHelper: any,
  mesh: any,
  ambientLight,
  controls: any

// 高亮显示模型专用
let composer: any, renderPass: any, outlinePass: any, effectFXAA: any
// 容器
let threeContainer: any
// 设置定时器id
let animationId: any
// 2dlabel专用
let labelRenderer: any
let popupLabel: any
import { onMounted, nextTick, onUnmounted } from 'vue'

const addStatsDom = () => {
  stats0 = new Stats()
  // 设置 Stats 的位置
  stats0.dom.style.position = 'fixed'
  stats0.dom.style.left = '0px'
  stats0.dom.style.top = '60px'
  document.querySelector("#app")!!.appendChild(stats0.dom)
}
const removeStatsDom = () => {
  document.querySelector("#app")!!.removeChild(stats0.dom)
}
const onWindowResize = () => {
  console.log('resize');


  const width = window.innerWidth
  const height = window.innerHeight - 61

  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
  composer.setSize(width, height)
  effectFXAA.uniforms['resolution'].value.set(1 / width, 1 / height)
  renderer.render(scene, camera)
  labelRenderer.setSize(width, height)
  labelRenderer.render(scene, camera)
}
const addSelectedObject = (object: any) => {
  selectedObjects = []
  selectedObjects.push(object)
}
const checkIntersection = () => {
  raycaster.setFromCamera(pointer, camera)

  const intersects = raycaster.intersectObject(scene, true)

  if (intersects.length > 0) {
    const selectedObject = intersects[0].object
    updatePopupLabel(selectedObject)
    showPopupLabel()
    addSelectedObject(selectedObject)
    outlinePass.selectedObjects = selectedObjects
  } else {
    hidePopupLabel()
    outlinePass.selectedObjects = []
  }
}
const onPointerMove = (event: any) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1
  pointer.y = -((event.clientY - 61) / (window.innerHeight - 61)) * 2 + 1
  checkIntersection()
}

const importModel = () => {
  // 导入模型
  // 注意导入的模型一定要放在public文件夹下
  loader.load(
    '/model/server1.glb',
    function (gltf) {
      console.log('模型层级结构：', gltf.scene)
      mesh = gltf.scene
      mesh.position.set(0, 5, 0)
      mesh.scale.set(5, 5, 5)
      scene.add(mesh)
    },
    undefined,
    function (error) {
      console.error(error)
    }
  )
}
const importOriginModel = () => {
  const geometry = new THREE.BoxGeometry()
  for (let i = 0; i < 2000; i++) {
    const object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    )

    object.position.x = Math.random() * 40 - 20
    object.position.y = Math.random() * 40 - 20
    object.position.z = Math.random() * 40 - 20

    object.rotation.x = Math.random() * 2 * Math.PI
    object.rotation.y = Math.random() * 2 * Math.PI
    object.rotation.z = Math.random() * 2 * Math.PI

    object.scale.x = Math.random() + 0.5
    object.scale.y = Math.random() + 0.5
    object.scale.z = Math.random() + 0.5

    scene.add(object)
  }
}
// 高亮外框初始化
const outlineInit = () => {
  composer = new EffectComposer(renderer)
  renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)
  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight - 61),
    scene,
    camera
  )
  outlinePass.visibleEdgeColor.set(0xfa0000)
  outlinePass.edgeThickness = Number(4);
  outlinePass.edgeGlow = Number(1);
  outlinePass.edgeStrength = Number(10);
  composer.addPass(outlinePass)
  const outputPass = new OutputPass()
  composer.addPass(outputPass)
  effectFXAA = new ShaderPass(FXAAShader)
  effectFXAA.uniforms['resolution'].value.set(
    1 / window.innerWidth,
    1 / (window.innerHeight - 61)
  )
  composer.addPass(effectFXAA)
}
const labelInit = () => {
  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(window.innerWidth, window.innerHeight - 61)
  labelRenderer.domElement.style.position = 'absolute'
  labelRenderer.domElement.style.top = '0px'
  labelRenderer.domElement.style.pointerEvents = 'none'
  document.querySelector("#app")!.appendChild(labelRenderer.domElement)
}
const createPopupLabel = () => {
  const element = document.createElement('div')
  element.className = 'selected'
  popupLabel = new CSS2DObject(element)
  scene.add(popupLabel)
}

const updatePopupLabel = (object: any) => {
  console.log('obj', popupLabel)

  const boundingBox = new THREE.Box3().setFromObject(object)
  const center = boundingBox.getCenter(new THREE.Vector3())
  const screenPosition = center.project(camera)
  const widthHalf = window.innerWidth / 2
  const heightHalf = (window.innerHeight - 61) / 2
  const x = (screenPosition.x * widthHalf + widthHalf) / window.devicePixelRatio
  const y = -(screenPosition.y * heightHalf) + heightHalf
  popupLabel.position.set(x, y, 0)
  popupLabel.element.textContent = object.name
}

const showPopupLabel = () => {
  popupLabel.element.style.display = 'block'
}

const hidePopupLabel = () => {
  popupLabel.element.style.display = 'none'
}
const init = () => {


  // 获取页面dom元素
  threeContainer = document.createElement('div')
  document.querySelector("#app")!!.appendChild(threeContainer)

  // 1、创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xc0c0c0)
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / (window.innerHeight - 61),
    0.1,
    7000
  )
  // AxesHelper：辅助观察的坐标系
  axesHelper = new THREE.AxesHelper(150)
  scene.add(axesHelper)

  // 导入平行光
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // 设置相机位置
  camera.position.set(3000, 3000, 3000)
  camera.lookAt(0, 0, 0)
  scene.add(camera)

  importModel()

  raycaster = new THREE.Raycaster()
  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 是否执行抗锯齿。默认为false
    logarithmicDepthBuffer: true, // 是否使用对数深度缓存。如果要在单个场景中处理巨大的比例差异，就有必要使用。
  })
  // 设置渲染的尺寸大小
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight - 61)
  threeContainer!.appendChild(renderer.domElement)

  // 使用渲染器，通过相机将场景渲染进来
  controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', () => {
    renderer.render(scene, camera)
  })

  addStatsDom()
  outlineInit()
  document.addEventListener('click', onPointerMove)
  window.addEventListener('resize', onWindowResize)
}
onMounted(() => {
  nextTick(() => {
    init()
    labelInit()
    createPopupLabel()
    animate()

  })
})

// 渲染函数
// 循环渲染事件
const animate = () => {
  animationId = requestAnimationFrame(animate)
  stats0.update()
  composer.render()
}
// 退出页面释放资源
const relaseResource = () => {
  // requsetAnimationFrame销毁
  cancelAnimationFrame(animationId)
  removeStatsDom()
  // 渲染器销毁
  renderer.dispose()
  document.removeEventListener("click", onPointerMove)
  window.removeEventListener("resize", onWindowResize)
  document.querySelector("#app")!.removeChild(threeContainer)
}
onUnmounted(() => {
  relaseResource()
})
</script>
<style scoped lang="scss">
.selected {
  position: absolute;
  background-color: rgba($color: #fff, $alpha: 0.3);
  color: #000;
  padding: 5px;
  border-radius: 5px;
  pointer-events: none;
  border: 2px solid #000;
}
</style>
