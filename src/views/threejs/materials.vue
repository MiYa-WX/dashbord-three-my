<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Threejs loaders_3mf_materials Demo </div>
    <div
      id="threeTest"
      v-loading="loading"
      element-loading-text="模型加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
// 引入轨道控制器组件，可以使得相机围绕目标进行轨道运动
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

// // 引入加载器，用于glTF格式的的模型添加
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js'
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'

export default {
  name: 'Materials',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      selectedObjects: [],
      outlinePass: null,
      composer: null,
      loading: true
    }
  },
  mounted() {
    this.init()
    this.animate()
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
    this.renderer.domElement.removeEventListener('click', this.onClick, false)
  },

  methods: {
    init() {
      this.scene = new THREE.Scene()
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.areaWidth = window.innerWidth - 210
      this.areaHeight = window.innerHeight - 60
      this.camera = new THREE.PerspectiveCamera(
        50,
        this.areaWidth / this.areaHeight,
        0.1,
        10000
      )
      this.camera.position.set(0, 100, 1000)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))

      this.scene.background = new THREE.Color(0xa0a0a0)
      this.scene.add(this.camera)
      const axesHelper = new THREE.AxesHelper(5)
      this.scene.add(axesHelper)
      // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
      // hemiLight.position.set(0, 100, 0)
      // this.scene.add(hemiLight)

      const dirLight = new THREE.DirectionalLight(0xffffff)
      dirLight.position.set(-0, 40, 50)
      dirLight.castShadow = true
      dirLight.shadow.camera.top = 50
      dirLight.shadow.camera.bottom = -25
      dirLight.shadow.camera.left = -25
      dirLight.shadow.camera.right = 25
      dirLight.shadow.camera.near = 0.1
      dirLight.shadow.camera.far = 200
      dirLight.shadow.mapSize.set(1024, 1024)
      this.scene.add(dirLight)

      this.composer = new EffectComposer(this.renderer)
      this.outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera
      )
      this.composer.addPass(this.outlinePass)
      const manager = new THREE.LoadingManager()

      // const loader = new ThreeMFLoader(manager)
      const loader = new TDSLoader(manager)
      // const loader = new FBXLoader(manager)
      // const loader = new OBJLoader(manager)
      // const modelUrl = '/models/3mf/truck.3mf' // ok
      // const modelUrl = '/models/电机.FBX' // ok
      // const modelUrl = '/models/设备.FBX' //
      const modelUrl = '/models/机柜.3DS' // ok
      // const modelUrl = '/models/portalgun.3ds' // ok
      // const modelUrl = '/models/Samba Dancing.fbx' // ok
      // const modelUrl = '/models/摄像头.obj' // ok
      // const modelUrl = '/models/Cerberus.obj'

      loader.load(modelUrl, (object) => {
        console.info('模型数据', object)
        // // 如果有动画
        // if (object.animations.length > 0) {
        //   this.mixer = new THREE.AnimationMixer(object)
        //   const action = this.mixer.clipAction(object.animations[0])
        //   action.play()
        // }
        // object.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)) // z-up conversion
        // this.outlinePass.patternTexture = object

        object.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            child.material.color.setHex(0xeeeeee)
          }
        })

        // object.updateMatrixWorld()
        // // 获得包围盒得min和max
        // const box = new THREE.Box3().setFromObject(object)
        // // 返回包围盒的宽度，高度，和深度
        // const boxSize = box.getSize()
        // // 返回包围盒的中心点
        // const center = box.getCenter(new THREE.Vector3())
        // object.position.x += object.position.x - center.x
        // object.position.y += object.position.y - center.y
        // object.position.z += object.position.z - center.z

        const box = new THREE.Box3().setFromObject(object) // 获取模型的包围盒
        const mdlen = box.max.x - box.min.x // 模型长度
        const mdwid = box.max.z - box.min.z // 模型宽度
        const mdhei = box.max.y - box.min.y // 模型高度
        const x1 = box.min.x + mdlen / 2 // 模型中心点坐标X
        const y1 = box.min.y + mdhei / 2 // 模型中心点坐标Y
        const z1 = box.min.z + mdwid / 2 // 模型中心点坐标Z
        object.position.set(-x1, -y1, -z1) // 将模型进行偏移

        // object.scale.set(1, 1, 1)

        this.scene.add(object)
      })
      manager.onProgress = function(url, itemsLoaded, itemsTotal) {
        this.loading = true

        console.log(
          'Loading file: ' +
            url +
            '.\nLoaded ' +
            itemsLoaded +
            ' of ' +
            itemsTotal +
            ' files.'
        )
      }
      manager.onLoad = () => {
        this.loading = false

        // this.render()
      }

      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.areaWidth, this.areaHeight)
      this.renderer.outputEncoding = THREE.sRGBEncoding
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      const container = document.getElementById('threeTest') // 获取DOM元素threeTest
      container.appendChild(this.renderer.domElement) // body元素中插入canvas对象

      this.controls = new TrackballControls(
        this.camera,
        this.renderer.domElement
      )
      this.controls.addEventListener('change', this.render)
      // this.controls.target.set(0, 10, 0)
      this.controls.rotateSpeed = 2.5
      this.controls.zoomSpeed = 1.0
      this.controls.panSpeed = 1.0

      this.renderer.domElement.addEventListener('click', this.onClick, false)

      window.addEventListener('resize', this.onWindowResize, false)

      // this.render()
    },
    onWindowResize() {
      const widthW = window.innerWidth - 210
      const heightW = window.innerHeight - 60
      this.camera.aspect = widthW / heightW
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(widthW, heightW)
      this.composer.setSize(widthW, heightW)

      this.render()
    },
    render() {
      this.renderer.render(this.scene, this.camera)
    },
    onClick(event) {
      if (event.isPrimary === false) {
        return
      }
      const mouse = new THREE.Vector2()

      mouse.x = (event.clientX / (window.innerWidth - 210)) * 2 - 1
      mouse.y = -(event.clientY / (window.innerHeight - 60)) * 2 + 1
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, this.camera)

      const intersects = raycaster.intersectObject(this.scene, true)

      if (intersects.length > 0) {
        const selectedObject = intersects[0].object

        this.selectedObjects = []
        this.selectedObjects.push(selectedObject)
        // alert('您点击了', this.selectedObjects)
        this.outlinePass.selectedObjects = this.selectedObjects
      } else {
        // outlinePass.selectedObjects = [];
      }
    },
    animate() {
      requestAnimationFrame(this.animate)
      this.controls.update()
      // const delta = new THREE.Clock().getDelta()
      // if (this.mixer) {
      //   this.mixer.update(delta)
      // }

      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
