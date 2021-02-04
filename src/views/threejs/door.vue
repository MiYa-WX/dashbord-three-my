<template>
  <div ref="box" id="box">
    <div class="btn" @click="handle">开门</div>
  </div>
</template>

<script>
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { Clock, Vector3 } from 'three'
var renderer,
  camera,
  scene,
  controls,
  stats,
  clock,
  ambientLight,
  directionalLight,
  globalID,
  flag = true,
  group = new THREE.Group(),
  doorGroup = new THREE.Group()
var tween1
var tween2
function onUpdate() {
  const rotate = this._object.rotate
  doorGroup.rotation.y = (Math.PI / 3) * rotate
}
export default {
  name: 'Test',
  methods: {
    initThree() {
      stats = new Stats()
      stats.setMode(0)
      stats.domElement.style.position = 'absolute'
      stats.domElement.style.left = '0px'
      stats.domElement.style.top = '0px'
      this.$refs.box.appendChild(stats.domElement)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000)
      this.$refs.box.appendChild(renderer.domElement)

      camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      )
      camera.position.set(20, 100, 200)

      controls = new OrbitControls(camera, renderer.domElement)
      controls.target = new THREE.Vector3(0, 70, 0)
      camera.lookAt(new THREE.Vector3(0, 70, 0))
      clock = new THREE.Clock()

      scene = new THREE.Scene()

      var helper = new THREE.AxesHelper(200)
      scene.add(helper)

      ambientLight = new THREE.AmbientLight(0xbbbbbb)
      scene.add(ambientLight)

      directionalLight = new THREE.DirectionalLight(0x666666)
      directionalLight.position.set(10, -50, 300)
      scene.add(directionalLight)

      this.initDoor()
    },
    initDoor() {
      var plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
      var planeHelper = new THREE.PlaneHelper(plane, 400, 0xffffff)
      scene.add(planeHelper)

      var geometry = new THREE.Geometry()
      var vertices = [
        new THREE.Vector3(-30, 70, 4),
        new THREE.Vector3(30, 70, 4),
        new THREE.Vector3(30, -70, 4),
        new THREE.Vector3(-30, -70, 4),
        new THREE.Vector3(-30, 70, -4),
        new THREE.Vector3(30, 70, -4),
        new THREE.Vector3(30, -70, -4),
        new THREE.Vector3(-30, -70, -4),
        new THREE.Vector3(-27, 67, 4),
        new THREE.Vector3(27, 67, 4),
        new THREE.Vector3(27, -67, 4),
        new THREE.Vector3(-27, -67, 4),
        new THREE.Vector3(-27, 67, -4),
        new THREE.Vector3(27, 67, -4),
        new THREE.Vector3(27, -67, -4),
        new THREE.Vector3(-27, -67, -4)
      ]
      var faces = [
        new THREE.Face3(0, 8, 9),
        new THREE.Face3(0, 9, 1),
        new THREE.Face3(1, 9, 10),
        new THREE.Face3(1, 10, 2),
        new THREE.Face3(2, 10, 11),
        new THREE.Face3(2, 11, 3),
        new THREE.Face3(3, 11, 8),
        new THREE.Face3(3, 8, 0),
        new THREE.Face3(4, 5, 13),
        new THREE.Face3(4, 13, 12),
        new THREE.Face3(5, 6, 14),
        new THREE.Face3(5, 14, 13),
        new THREE.Face3(6, 7, 15),
        new THREE.Face3(6, 15, 14),
        new THREE.Face3(7, 4, 12),
        new THREE.Face3(7, 12, 15),
        new THREE.Face3(0, 1, 5),
        new THREE.Face3(0, 5, 4),
        new THREE.Face3(2, 3, 7),
        new THREE.Face3(2, 7, 6),
        new THREE.Face3(1, 2, 6),
        new THREE.Face3(1, 6, 5),
        new THREE.Face3(0, 4, 7),
        new THREE.Face3(0, 7, 3),
        new THREE.Face3(9, 8, 12),
        new THREE.Face3(9, 12, 13),
        new THREE.Face3(14, 15, 11),
        new THREE.Face3(14, 11, 10),
        new THREE.Face3(13, 14, 10),
        new THREE.Face3(13, 10, 9),
        new THREE.Face3(12, 8, 11),
        new THREE.Face3(12, 11, 15)
      ]
      geometry.vertices = vertices
      geometry.faces = faces
      geometry.computeFaceNormals()
      var material = new THREE.MeshPhongMaterial({
        color: 0x330000,
        shininess: 40
      })
      var mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = -27
      mesh.position.y = 70

      group.add(mesh)

      var doorGeom = new THREE.BoxGeometry(54, 134, 6)
      var texture = new THREE.TextureLoader().load(
        '/source/textures/door/door.jpg'
      )
      var doorMate = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        shininess: 200,
        specular: 0x090909,
        map: texture
      })
      var doorMesh = new THREE.Mesh(doorGeom, doorMate)
      doorMesh.position.x = -27
      doorMesh.position.y = 70
      doorGroup.add(doorMesh)
      group.add(doorGroup)

      group.position.x = 27
      scene.add(group)

      this.render()
      this.initTween()
      document.getElementById('loading').style.display = 'none'
    },
    initTween() {
      var config = { rotate: 0 }
      tween1 = new TWEEN.Tween(config).to({ rotate: 1 }, 1000)
      tween2 = new TWEEN.Tween(config).to({ rotate: 0 }, 1000)
      tween1.easing(TWEEN.Easing.Quadratic.InOut)
      tween2.easing(TWEEN.Easing.Quadratic.InOut)
      tween1.onUpdate(onUpdate)
      tween2.onUpdate(onUpdate)
    },
    handle() {
      if (flag) {
        tween1.start()
      } else {
        tween2.start()
      }
      flag = !flag
    },
    render() {
      stats.update()
      TWEEN.update()
      controls.update(clock.getDelta())
      renderer.render(scene, camera)
      this.globalID = requestAnimationFrame(this.render)
    }
  },
  mounted() {
    this.initThree()
    window.onresize = () => {
      camera.aspect = this.$refs.box.clientWidth / this.$refs.box.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(this.$refs.box.clientWidth, this.$refs.box.clientHeight)
    }
  },
  beforeDestroy() {
    renderer.forceContextLoss()
    renderer = null
    scene = null
    controls = null
    clock = null
    stats = null
    renderer = null
    camera = null
    ambientLight = null
    directionalLight = null
    cancelAnimationFrame(this.globalID)
  }
}
</script>

<style lang="scss" scope>
#box {
  position: relative;
  .btn {
    position: absolute;
    bottom: 50px;
    left: 50%;
    color: #ffffff;
    padding: 6px 20px;
    text-align: center;
    display: inline-block;
    border: 1px solid #ffffff;
    cursor: pointer;
    margin-left: -34px;
  }
}
</style>
