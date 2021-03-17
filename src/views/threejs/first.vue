<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script>
import * as Three from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
export default {
  name: 'ThreeTest',
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      controls: null,
      intersections: null,
      objects: [],
      clock: ''
    }
  },
  mounted() {
    this.init()
    this.render()
  },
  methods: {
    init: function() {
      this.initScene() // 场景对象
      this.initCamera() // 相机
      this.initWebGLRenderer() // 渲染器
      this.initAxisHelper() // 辅助坐标
      this.render()
      this.createControls() // 控件对象
      this.Box()
      this.initControls()
    },
    // 鼠标控制移动相机视角*****下面initControls复制代码就可以实现控制相机
    initControls() {
      const controls = new PointerLockControls(this.camera, document.body)
      var container = document.getElementById('container')
      container.addEventListener('click', function() {
        controls.lock()
      })
      this.scene.add(controls.getObject())
    },
    // 创建场景对象Scene
    initScene() {
      this.scene = new Three.Scene()
    },
    // 相机
    initCamera() {
      this.container = document.getElementById('container')
      this.camera = new Three.PerspectiveCamera(
        60,
        this.container.clientWidth / this.container.clientHeight,
        1,
        1000
      )
      this.camera.position.set(292, 109, 268) // 设置相机位置
      this.camera.lookAt(this.scene.position) // 设置相机方向(指向的场景对象)
    },
    Box() {
      // 正方形
      const geometry = new Three.BoxGeometry(50, 50, 50)
      const material = new Three.MeshNormalMaterial()
      this.mesh = new Three.Mesh(geometry, material)
      this.scene.add(this.mesh)
    },
    // 地板
    plane() {
      var planeGeometry = new Three.PlaneGeometry(600, 600)
      // 平面使用颜色为0xcccccc的基本材质
      var planeMaterial = new Three.MeshBasicMaterial({ color: 0xcccccc })
      var plane = new Three.Mesh(planeGeometry, planeMaterial)
      // 设置屏幕的位置和旋转角度
      plane.rotation.x = -0.5 * Math.PI
      plane.position.x = 0
      plane.position.y = 0
      plane.position.z = 0
      // 将平面添加场景中
      this.scene.add(plane)
    },
    // 创建渲染器对象
    initWebGLRenderer() {
      this.renderer = new Three.WebGLRenderer({ antialias: true })
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight) // 设置渲染区域尺寸
      this.renderer.setClearColor(0xb9d3ff, 1) // 设置背景颜色
      this.container.appendChild(this.renderer.domElement) // body元素中插入canvas对象
    },
    // 辅助三维坐标系AxisHelper
    initAxisHelper() {
      this.axisHelper = new Three.AxisHelper(250)
      this.scene.add(this.axisHelper)
    },
    render: function() {
      // this.mesh.rotation.x+=0.01
      requestAnimationFrame(this.render) // 请求再次执行渲染函数render
      this.renderer.render(this.scene, this.camera) // 执行渲染操作
    },
    // 创建控件对象
    createControls() {
      // this.controls = new OrbitControls(this.camera,this.renderer.domElement)
    }
  }
}
</script>
<style scoped>
#container {
  height: 400px;
}
</style>
