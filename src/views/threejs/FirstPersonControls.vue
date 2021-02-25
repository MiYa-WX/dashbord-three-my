<template>
  <div>
    <div id="container"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'

export default {
  name: '',
  data() {
    return {}
  },
  mounted() {
    this.container
    this.stats

    this.camera
    this.controls
    this.scene
    this.renderer

    this.worldWidth = 256
    this.worldDepth = 256
    this.worldHalfWidth = this.worldWidth / 2
    this.worldHalfDepth = this.worldDepth / 2

    this.clock = new THREE.Clock()
    this.init()
    this.animate()
  },
  methods: {
    init() {
      this.container = document.getElementById('container')

      this.camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        20000
      )

      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xbfd1e5)

      var data = this.generateHeight(this.worldWidth, this.worldDepth)

      this.camera.position.y =
        data[this.worldHalfWidth + this.worldHalfDepth * this.worldWidth] * 10 +
        500

      var geometry = new THREE.PlaneBufferGeometry(
        7500,
        7500,
        this.worldWidth - 1,
        this.worldDepth - 1
      )
      geometry.rotateX(-Math.PI / 2)

      var vertices = geometry.attributes.position.array

      for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
        vertices[j + 1] = data[i] * 10
      }

      const texture = new THREE.CanvasTexture(
        this.generateTexture(data, this.worldWidth, this.worldDepth)
      )
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping

      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ map: texture })
      )
      this.scene.add(mesh)

      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.container.appendChild(this.renderer.domElement)

      this.controls = new FirstPersonControls(
        this.camera,
        this.renderer.domElement
      )
      // this.controls.movementSpeed = 2000 // 移动速度
      // this.controls.lookSpeed = 0.05 // 环顾四周的速度
      // // this.controls.lookVertical = true // 是否可以垂直环顾四周
      this.controls.constrainVertical = true // 环顾四周是否垂直受[ .verticalMin，.verticalMax ]限制
      this.controls.verticalMin = 1.0 // 您可以垂直看多远，下限。范围是0到Math.PI弧度
      this.controls.verticalMax = 2.0 // 您可以垂直看多远，上限
      // this.controls.noFly = true
      // this.controls.lon = -150
      // this.controls.lat = 120
      this.controls.enabled = true
      this.controls.lookSpeed = 0.05 // 鼠标移动查看的速度
      this.controls.movementSpeed = 10 // 相机移动速度
      // this.controls.noFly = false
      // this.controls.lon = 0 // 进入初始视角x轴的角度
      // this.controls.lat = 0 // 初始视角进入后y轴的角度

      this.stats = new Stats()
      this.container.appendChild(this.stats.dom)

      //

      window.addEventListener('resize', this.onWindowResize, false)
    },

    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(window.innerWidth, window.innerHeight)

      this.controls.handleResize()
    },

    generateHeight(width, height) {
      var size = width * height
      var data = new Uint8Array(size)
      var perlin = new ImprovedNoise()
      var quality = 1
      var z = Math.random() * 100

      for (var j = 0; j < 4; j++) {
        for (var i = 0; i < size; i++) {
          var x = i % width
          var y = ~~(i / width)
          data[i] += Math.abs(
            perlin.noise(x / quality, y / quality, z) * quality * 1.75
          )
        }

        quality *= 5
      }

      return data
    },

    generateTexture(data, width, height) {
      var canvas, canvasScaled, context, image, imageData, vector3, sun, shade

      vector3 = new THREE.Vector3(0, 0, 0)

      sun = new THREE.Vector3(1, 1, 1)
      sun.normalize()

      canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      context = canvas.getContext('2d')
      context.fillStyle = '#000'
      context.fillRect(0, 0, width, height)

      image = context.getImageData(0, 0, canvas.width, canvas.height)
      imageData = image.data

      for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
        vector3.x = data[j - 2] - data[j + 2]
        vector3.y = 2
        vector3.z = data[j - width * 2] - data[j + width * 2]
        vector3.normalize()

        shade = vector3.dot(sun)

        imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007)
        imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007)
        imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007)
      }

      context.putImageData(image, 0, 0)

      // Scaled 4x

      canvasScaled = document.createElement('canvas')
      canvasScaled.width = width * 4
      canvasScaled.height = height * 4

      context = canvasScaled.getContext('2d')
      context.scale(4, 4)
      context.drawImage(canvas, 0, 0)

      image = context.getImageData(
        0,
        0,
        canvasScaled.width,
        canvasScaled.height
      )
      imageData = image.data

      for (var i = 0, l = imageData.length; i < l; i += 4) {
        var v = ~~(Math.random() * 5)

        imageData[i] += v
        imageData[i + 1] += v
        imageData[i + 2] += v
      }

      context.putImageData(image, 0, 0)

      return canvasScaled
    },

    //

    animate() {
      requestAnimationFrame(this.animate)

      this.render()
      this.stats.update()
    },

    render() {
      this.controls.update(this.clock.getDelta())
      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>
