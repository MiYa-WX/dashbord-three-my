<template>
  <div class="dashboard-container">
    <div id="threeTest"> </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'

import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js'

const ACTION_NONE = 0
const curveHandles = []
export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  mounted() {
    this.camera
    this.scene
    this.renderer

    this.control
    this.flow
    this.action = ACTION_NONE

    this.init()
    this.animate()
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    init() {
      this.scene = new THREE.Scene()

      this.camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth / window.innerHeight,
        1,
        1000
      )
      this.camera.position.set(2, 2, 4)
      this.camera.lookAt(this.scene.position)

      const initialPoints = [
        // { x: 1, y: 0, z: -1 },
        // { x: 1, y: 0, z: 1 },
        // { x: -1, y: 0, z: 1 },
        // { x: -1, y: 0, z: -1 }

        { x: 2, y: 0, z: 1 },
        { x: -3, y: 0, z: 1 }
      ]

      for (const handlePos of initialPoints) {
        const handle = new THREE.Vector3(handlePos.x, handlePos.y, handlePos.z)
        curveHandles.push(handle)
      }

      const curve = new THREE.CatmullRomCurve3(
        curveHandles.map((handle) => handle)
      )
      curve.curveType = 'centripetal'
      curve.closed = true

      const points = curve.getPoints(50)
      const line = new THREE.LineLoop(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0x00ff00 })
      )

      this.scene.add(line)

      const light = new THREE.DirectionalLight(0xffaa33)
      light.position.set(-10, 10, 10)
      light.intensity = 1.0
      this.scene.add(light)

      const light2 = new THREE.AmbientLight(0x003973)
      light2.intensity = 1.0
      this.scene.add(light2)

      const geometryP = new THREE.SphereGeometry(0.1, 32, 32)
      const materialP = new THREE.MeshBasicMaterial({
        color: 0x409eff
      })
      const circleP = new THREE.Mesh(geometryP, materialP)
      this.flow = new Flow(circleP)
      this.flow.updateCurve(0, curve)
      this.scene.add(this.flow.object3D)
      //

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      const container = document.getElementById('threeTest') // 获取DOM元素threeTest
      container.appendChild(this.renderer.domElement)

      this.control = new TransformControls(
        this.camera,
        this.renderer.domElement
      )
      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize() {
      const width = window.innerWidth
      const height = window.innerHeight

      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(width, height)
    },

    animate() {
      requestAnimationFrame(this.animate)

      if (this.flow) {
        this.flow.moveAlongCurve(0.001)
      }
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>
<style lang="scss" scoped>
#selection {
  position: fixed;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  top: 0;
  z-index: 999;
  > div {
    height: 128px;
    width: 128px;
    border: 1px solid white;
  }
}
</style>
