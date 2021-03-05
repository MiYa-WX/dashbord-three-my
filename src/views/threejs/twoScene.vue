<template>
  <div class="dashboard-container">
    <div id="threeTest">
      <div id="selection">
        <div></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
// 引入轨道控制器组件，可以使得相机围绕目标进行轨道运动
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const dpr = window.devicePixelRatio

const textureSize = 128 * dpr
const vector = new THREE.Vector2()
export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  mounted() {
    this.camera
    this.scene
    this.renderer
    this.sprite
    this.texture

    this.cameraOrtho
    this.sceneOrtho

    this.init()
    this.animate()
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    init() {
      const width = window.innerWidth
      const height = window.innerHeight

      this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 1000)
      this.camera.position.z = 20

      this.cameraOrtho = new THREE.OrthographicCamera(
        -width / 2,
        width / 2,
        height / 2,
        -height / 2,
        1,
        10
      )
      this.cameraOrtho.position.z = 10

      this.scene = new THREE.Scene()
      this.sceneOrtho = new THREE.Scene()

      const geometry = new THREE.BoxGeometry(100, 200, 100)
      const material = new THREE.MeshLambertMaterial({ color: 0x6083c2 })

      const mesh = new THREE.Mesh(geometry, material)
      this.scene.add(mesh)

      const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4)
      this.scene.add(ambientLight)

      // 设置摄像机位置
      this.camera.position.set(0, 500, 500)
      const pointLight = new THREE.PointLight(0xffffff, 0.8)
      this.camera.add(pointLight)
      this.scene.add(this.camera)

      const data = new Uint8Array(textureSize * textureSize * 3)
      this.texture = new THREE.DataTexture(
        data,
        textureSize,
        textureSize,
        THREE.RGBFormat
      )
      this.texture.minFilter = THREE.NearestFilter
      this.texture.magFilter = THREE.NearestFilter

      //

      const spriteMaterial = new THREE.SpriteMaterial({ map: this.texture })
      this.sprite = new THREE.Sprite(spriteMaterial)
      this.sprite.scale.set(100, 300, 1)
      this.sceneOrtho.add(this.sprite)

      this.updateSpritePosition()

      //

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.autoClear = false
      const container = document.getElementById('threeTest') // 获取DOM元素threeTest
      container.appendChild(this.renderer.domElement)

      //

      // const selection = document.getElementById('selection')
      const controls = new OrbitControls(this.camera, container)
      controls.enablePan = false

      //

      window.addEventListener('resize', this.onWindowResize)
    },
    onWindowResize() {
      const width = window.innerWidth
      const height = window.innerHeight

      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()

      this.cameraOrtho.left = -width / 2
      this.cameraOrtho.right = width / 2
      this.cameraOrtho.top = height / 2
      this.cameraOrtho.bottom = -height / 2
      this.cameraOrtho.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)

      this.updateSpritePosition()
    },

    updateSpritePosition() {
      const halfWidth = window.innerWidth / 2
      const halfHeight = window.innerHeight / 2

      const halfImageWidth = textureSize / 2
      const halfImageHeight = textureSize / 2

      this.sprite.position.set(
        halfWidth - halfImageWidth - 230,
        -halfHeight + halfImageHeight,
        1
      )
    },

    animate() {
      requestAnimationFrame(this.animate)

      // scene rendering

      this.renderer.clear()
      if (this.camera.position.y < 550 && this.camera.position.y > 280) {
        this.camera.position.y -= 1
      }
      this.renderer.render(this.scene, this.camera)
      // calculate start position for copying data

      vector.x = (window.innerWidth * dpr) / 2 - textureSize / 2
      vector.y = (window.innerHeight * dpr) / 2 - textureSize / 2

      // 将当前WebGLFramebuffer中的像素复制到2D纹理中
      this.renderer.copyFramebufferToTexture(vector, this.texture)

      this.renderer.clearDepth()
      this.renderer.render(this.sceneOrtho, this.cameraOrtho)
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
  bottom: 0;
  z-index: 999;
  > div {
    height: 128px;
    width: 128px;
    border: 1px solid white;
  }
}
</style>
