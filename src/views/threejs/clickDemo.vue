<template>
  <!-- https://ithanmang.gitee.io/threejs/home/201807/20180703/02-raycasterDemo.html
       https://www.cnblogs.com/smedas/p/12455403.html
  -->
  <div class="dashboard-container">
    <div id="main"></div>
    <div id="WebGL-output"></div>
    <div id="Stats-output"></div>

    <div id="label"></div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL.js'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js'

// import GUI from 'three/examples/jsm/libs/dat.gui.module.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      scene: null,
      camera: null,
      light: null,
      renderer: null,
      selectObject: null,
      controls: null,
      stats: null
    }
  },
  mounted() {
    this.stats = this.initStats()

    this.init()
    this.animate()
  },
  destroyed() {
    removeEventListener('click', this.onMouseDblclick, false)
    removeEventListener('resize', this.onWindowResize, false)
    removeEventListener('keydown', this.onKeyDown, false)
    document.body.removeChild(this.stats.domElement)
  },
  methods: {
    initScene() {
      this.scene = new THREE.Scene()
    },
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      )
      this.camera.position.set(0, 400, 600)
      this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    },
    initRenderer() {
      // WebGL兼容性检查 WEBGL.isWebGLAvailable()
      const mainDom = document.getElementById('main')
      if (WEBGL.isWebGLAvailable()) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x050505)
        mainDom.appendChild(this.renderer.domElement)
      } else {
        var warning = WEBGL.getWebGLErrorMessage()
        mainDom.appendChild(warning)
      }
    },
    initContent() {
      var helper = new THREE.GridHelper(1200, 50, 0xcd3700, 0x4a4a4a)
      this.scene.add(helper)

      var cubeGeometry = new THREE.BoxGeometry(100, 100, 100)
      var cubeMaterial = new THREE.MeshLambertMaterial({ color: 0x9370db })
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
      cube.position.y = 50
      cube.name = 'cube'
      this.scene.add(cube)

      var sphereGeometry = new THREE.SphereGeometry(50, 50, 50, 50)
      var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x3cb371 })
      var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.position.x = 200
      sphere.position.y = 50
      sphere.name = 'sphere'
      // sphere.position.z = 200;
      this.scene.add(sphere)

      var cylinderGeometry = new THREE.CylinderGeometry(50, 50, 100, 100)
      var cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xcd7054 })
      var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
      cylinder.position.x = -200
      cylinder.position.y = 50
      cylinder.name = 'cylinder'
      // cylinder.position.z = -200;
      this.scene.add(cylinder)
    },
    onMouseDblclick(event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      var intersects = this.getIntersects(event)
      // 获取选中最近的 Mesh 对象
      if (
        intersects.length !== 0 &&
        intersects[0].object instanceof THREE.Mesh
      ) {
        this.selectObject = intersects[0].object
        this.changeMaterial(this.selectObject)
      } else {
        // alert('未选中 Mesh!')
      }
    },
    getIntersects(event) {
      event.preventDefault()
      console.log('event.clientX:' + event.clientX)
      console.log('event.clientY:' + event.clientY)

      // 声明 raycaster 和 mouse 变量
      var raycaster = new THREE.Raycaster()
      var mouse = new THREE.Vector2()

      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      // 410 = 200(每一个几何体的间距)+ 210(左侧菜单宽度)
      mouse.x = ((event.clientX - 210) / window.innerWidth) * 2 - 1
      mouse.y = -((event.clientY - 60) / window.innerHeight) * 2 + 1

      // 通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, this.camera)

      // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
      var intersects = raycaster.intersectObjects(this.scene.children)

      // 返回选中的对象
      return intersects
    },
    // 窗口变动触发的方法
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    },

    // 键盘按下触发的方法
    onKeyDown(event) {
      switch (event.keyCode) {
        case 13:
          this.initCamera()
          this.initControls()
          break
      }
    },

    // 改变对象材质属性
    changeMaterial(object) {
      var material = new THREE.MeshLambertMaterial({
        color: 0xffffff * Math.random(),
        transparent: !object.material.transparent,
        opacity: 0.8
      })
      object.material = material
    },

    // 初始化轨迹球控件
    initControls() {
      this.controls = new TrackballControls(
        this.camera,
        this.renderer.domElement
      )
      // controls.noRotate = true;
      // this.controls.noPan = true
    },

    // 初始化灯光
    initLight() {
      this.light = new THREE.SpotLight(0xffffff)
      this.light.position.set(-300, 600, -400)
      this.light.castShadow = true

      this.scene.add(this.light)
      this.scene.add(new THREE.AmbientLight(0x5c5c5c))
    },

    // 初始化 dat.GUI
    initGui() {
      // // 保存需要修改相关数据的对象
      // gui = new () {
      // }
      // 属性添加到控件
      // new GUI()
    },

    // 初始化性能插件
    initStats() {
      const stats1 = new Stats()
      stats1.domElement.style.position = 'absolute'
      stats1.domElement.style.left = '0px'
      stats1.domElement.style.top = '0px'
      document.body.appendChild(stats1.domElement)
      return stats1
    },

    // 更新div的位置
    renderDiv(object) {
      // 获取窗口的一半高度和宽度
      var halfWidth = window.innerWidth / 2
      var halfHeight = window.innerHeight / 2

      // 逆转相机求出二维坐标
      var vector = object.position.clone().project(this.camera)
      const labelDom = document.getElementById('label')
      // 修改 div 的位置
      labelDom.style.left = vector.x * halfWidth + halfWidth + 'px'
      labelDom.style.top =
        -vector.y * halfHeight + halfHeight - object.position.y + 'px'

      // 显示模型信息
      labelDom.innerHTML = 'name:' + object.name
    },

    // 更新控件
    update() {
      this.stats.update()
      this.controls.update()
      this.controls.handleResize()
    },

    // 初始化
    init() {
      this.initScene()
      this.initCamera()
      this.initRenderer()
      this.initContent()
      this.initLight()
      this.initControls()
      this.initGui()
      addEventListener('click', this.onMouseDblclick, false)
      addEventListener('resize', this.onWindowResize, false)
      addEventListener('keydown', this.onKeyDown, false)
    },

    animate() {
      if (this.selectObject !== undefined && this.selectObject != null) {
        this.renderDiv(this.selectObject)
      }
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
      this.update()
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
}
#label {
  position: absolute;
  padding: 10px;
  background: rgba(255, 255, 255, 0.6);
  line-height: 1;
  border-radius: 5px;
}
</style>
