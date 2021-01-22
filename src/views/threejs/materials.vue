<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Threejs loaders_3mf_materials Demo </div>
    <div id="threeTest"> </div>
  </div>
</template>

<script>
import * as THREE from 'three'
// 引入轨道控制器组件，可以使得相机围绕目标进行轨道运动
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// // 引入加载器，用于glTF格式的的模型添加
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js'

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
      composer: null
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
    this.renderer.domElement.removeEventListener('click', this.onClick, false)
  },

  methods: {
    init() {
      this.scene = new THREE.Scene()

      this.camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        1,
        500
      )

      this.renderer = new THREE.WebGLRenderer({ antialias: true })

      this.scene.background = new THREE.Color(0xa0a0a0)
      this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 500)

      this.camera.position.set(-50, 40, 50)
      this.scene.add(this.camera)

      //

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
      hemiLight.position.set(0, 100, 0)
      this.scene.add(hemiLight)

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

      // scene.add( new THREE.CameraHelper( dirLight.shadow.camera ) );

      this.composer = new EffectComposer(this.renderer)
      this.outlinePass = new OutlinePass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        this.scene,
        this.camera
      )
      this.composer.addPass(this.outlinePass)
      const manager = new THREE.LoadingManager()

      const loader = new ThreeMFLoader(manager)
      // loader.setPath('')

      loader.load('/models/3mf/truck.3mf', (object) => {
        object.quaternion.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)) // z-up conversion

        object.traverse((child) => {
          child.castShadow = true
        })
        this.outlinePass.patternTexture = object
        this.scene.add(object)
      })

      //

      manager.onLoad = () => {
        this.render()
      }

      //

      const ground = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1000, 1000),
        new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
      )
      ground.name = '后面的背景墙体'
      ground.rotation.x = -Math.PI / 2
      ground.position.y = 11
      ground.receiveShadow = true
      this.scene.add(ground)

      //

      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.outputEncoding = THREE.sRGBEncoding
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      const container = document.getElementById('threeTest') // 获取DOM元素threeTest
      container.appendChild(this.renderer.domElement) // body元素中插入canvas对象

      //

      const controls = new OrbitControls(this.camera, this.renderer.domElement)
      controls.addEventListener('change', this.render)
      controls.minDistance = 50
      controls.maxDistance = 200
      controls.enablePan = false
      controls.target.set(0, 20, 0)
      controls.update()
      this.renderer.domElement.addEventListener('click', this.onClick, false)

      window.addEventListener('resize', this.onWindowResize, false)

      this.render()
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.composer.setSize(window.innerWidth, window.innerHeight)

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

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
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
