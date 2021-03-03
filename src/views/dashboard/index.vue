<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Threejs First Demo </div>

    <div id="threeTest"> </div>
  </div>
</template>

<script>
import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)

// 引入轨道控制器组件，可以使得相机围绕目标进行轨道运动
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export default {
  name: 'Dashboard',
  data() {
    return {
      scene: null,
      camera: null,
      mesh: null,
      renderer: null,
      meshSphere: null,
      controls: null
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    init() {
      /**
       * 创建场景对象Scene
       */
      this.scene = new THREE.Scene()

      /**
       * 创建网格模型
       */
      const geometry = new THREE.BoxGeometry(100, 200, 100) // 创建一个立方体几何对象Geometry
      // 材质对象Material
      const material = new THREE.MeshLambertMaterial({
        color: '#0000ff'
      })
      this.mesh = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
      this.scene.add(this.mesh) // 网格模型添加到场景中

      const sphereGeometry = new THREE.SphereGeometry(60, 40, 40) // 创建一个球体几何对象
      const materialSphere = new THREE.MeshLambertMaterial({
        color: '#ff00ff'
      })
      this.meshSphere = new THREE.Mesh(sphereGeometry, materialSphere) // 网格模型对象Mesh
      this.meshSphere.translateX(150)
      this.scene.add(this.meshSphere) // 网格模型添加到场景中

      const coneGeometry = new THREE.ConeBufferGeometry(60, 150, 60) // 创建一个圆锥缓冲几何体对象
      const materialCone = new THREE.MeshBasicMaterial({
        color: '#ffff00'
      })
      this.meshCone = new THREE.Mesh(coneGeometry, materialCone) // 网格模型对象Mesh
      this.meshCone.translateY(220)
      this.scene.add(this.meshCone) // 网格模型添加到场景中

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, 10),
        new THREE.Vector3(-5, 5, 5),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, -5, 5),
        new THREE.Vector3(10, 0, 10)
      ])
      const points = curve.getPoints(50) // 将曲线划分成的段数
      const geometryLine = new THREE.BufferGeometry().setFromPoints(points)
      const materialLine = new THREE.LineBasicMaterial({ color: 0xff0000 })
      // Create the final object to add to the scene
      const curveObject = new THREE.Line(geometryLine, materialLine)
      curveObject.position.set(-200, -50, 0)
      this.scene.add(curveObject)

      const curve1 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, 10),
        new THREE.Vector3(-310, 0, 10)
      ])
      const points1 = curve1.getPoints(50) // 将曲线划分成的段数
      const geometryLine1 = new THREE.BufferGeometry().setFromPoints(points1)
      // Create the final object to add to the scene
      const curveObject1 = new THREE.Line(geometryLine1, materialLine)
      curveObject1.position.set(-250, -150, 0)
      this.scene.add(curveObject1)

      const material3D = new THREE.MeshBasicMaterial({
        color: 0x4488ff,
        transparent: false
      })
      // THREE.CatmullRomCurve3方法可以将一组顶点生成一条平滑的曲线
      const curve11 = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(100, 0, 0)
      ])
      const tubeGeometry = new THREE.TubeGeometry(curve11, 32, 0.5, 32, false)
      // 将模型对象赋值给tubeMesh并添加到场景当中
      const tubeMesh = new THREE.Mesh(tubeGeometry, material3D) // 网格模型对象Mesh
      tubeMesh.position.set(-300, 0, 0)
      this.scene.add(tubeMesh)

      // 将模型对象赋值给tubeMesh并添加到场景当中
      const tubeMesh1 = tubeMesh.clone() // 网格模型对象Mesh
      tubeMesh1.position.set(-300, 10, 0)
      this.scene.add(tubeMesh1)

      /**
       * 测试ThreeBSP: 简易铜钱形状几何体 ok
       */
      // 几何体对象
      const cylinder = new THREE.CylinderGeometry(50, 50, 5, 40) // 圆柱
      const box = new THREE.BoxGeometry(40, 5, 40) // 立方体
      // 材质对象
      const materialTem = new THREE.MeshPhongMaterial({ color: 0x0000ff })
      // 网格模型对象
      const cylinderMesh = new THREE.Mesh(cylinder, materialTem) // 圆柱
      const boxMesh = new THREE.Mesh(box, materialTem) // 立方体
      // 包装成ThreeBSP对象
      const cylinderBSP = new ThreeBSP(cylinderMesh)
      const boxBSP = new ThreeBSP(boxMesh)
      const result = cylinderBSP.subtract(boxBSP)
      // ThreeBSP对象转化为网格模型对象
      const mesh = result.toMesh()
      mesh.position.set(150, 300, 0)
      this.scene.add(mesh) // 网格模型添加到场景中

      /**
       * 光源设置
       */
      // 点光源
      const point = new THREE.PointLight('#ffffff')
      point.position.set(400, 200, 300) // 点光源位置
      this.scene.add(point) // 点光源添加到场景中
      // 环境光
      const ambient = new THREE.AmbientLight('#444444')
      this.scene.add(ambient)
      /**
       * 相机设置
       */
      const width = window.innerWidth // 窗口宽度
      const height = window.innerHeight // 窗口高度
      const k = width / height // 窗口宽高比
      const s = 200 // 三维场景显示范围控制系数，系数越大，显示的范围越大
      // 创建正射投影相机对象
      this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000)
      this.camera.position.set(150, 300, 200) // 设置相机位置
      this.camera.lookAt(this.scene.position) // 设置相机方向(指向的场景对象)

      /**
       * 创建渲染器对象
       */
      this.renderer = new THREE.WebGLRenderer()
      this.renderer.setSize(width, height * 0.8) // 设置渲染区域尺寸
      this.renderer.setClearColor('#b9d3ff', 1) // 设置背景颜色
      const container = document.getElementById('threeTest') // 获取DOM元素threeTest
      container.appendChild(this.renderer.domElement) // threeTest元素中插入canvas对象

      // 创建控制器对象,要在插入canvas对象
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.update()
      this.animationRender()
      window.addEventListener('resize', this.onWindowResize) // 添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
    },
    customSinCurve(scale) {
      THREE.Curve.call(this)

      this.scale = scale === undefined ? 1 : scale
    },
    animationRender() {
      // 执行渲染操作   指定场景、相机作为参数
      this.renderer.render(this.scene, this.camera)
      // this.mesh.rotateX(0.01)
      // this.mesh.rotateY(0.01)
      // /**
      //  * 注意写法this.animationRender()和this.animationRender
      //  * 有()是立即调用，会造成"Maximum call stack size exceeded"
      //  * 没有()是将这个方法交给 requestAnimationFrame 调用
      //  */
      // // requestAnimationFrame(this.animationRender())
      requestAnimationFrame(this.animationRender)
    },
    onWindowResize() {
      const width = window.innerWidth // 窗口宽度
      const height = window.innerHeight // 窗口高度

      this.camera.aspect = width / height
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(width, height * 0.8) // 设置渲染区域尺寸
      // this.labelRenderer.setSize(width, height)
      this.controls.update()
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
