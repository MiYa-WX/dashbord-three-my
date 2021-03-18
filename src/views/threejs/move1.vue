<template>
  <div class="dashboard-container">
    <div id="container"></div>
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'Dashboard',
  data() {
    return {}
  },
  mounted() {
    this.scene
    this.renderer
    // canvas容器
    this.container
    this.control
    // 相机
    this.splineCamera
    // 移动的相机模型
    this.cameraEye

    this.parent
    this.tubeGeometry
    // 配置参数
    this.params = {
      scale: 1,
      extrusionSegments: 500,
      radiusSegments: 12,
      closed: true,
      animationView: true,
      lookAhead: true
    }

    this.direction = new THREE.Vector3()
    this.binormal = new THREE.Vector3()
    this.normal = new THREE.Vector3()
    this.position = new THREE.Vector3()
    this.lookAt = new THREE.Vector3()
    this.init()
    this.animate()
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize)
  },

  methods: {
    init() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xf0f0f0)

      this.container = document.getElementById('container')

      // light
      const light = new THREE.DirectionalLight(0xffffff)
      light.position.set(0, 0, 1)
      this.scene.add(light)
      // tube
      this.parent = new THREE.Object3D()
      this.scene.add(this.parent)

      this.splineCamera = new THREE.PerspectiveCamera(
        84,
        window.innerWidth / window.innerHeight,
        0.01,
        1000
      )
      this.parent.add(this.splineCamera)

      /**
       * 创建网格模型
       */
      const geometry = new THREE.BoxGeometry(50, 40, 30) // 创建一个立方体几何对象Geometry
      // 材质对象Material
      const material = new THREE.MeshLambertMaterial({
        color: 0xffffff
      })
      const mesh1 = new THREE.Mesh(geometry, material) // 网格模型对象Mesh
      // mesh1.position.set(10, 0, 50)
      this.scene.add(mesh1) // 网格模型添加到场景中

      this.addTube()

      // debug camera
      this.cameraEye = new THREE.Mesh(
        new THREE.SphereGeometry(5),
        new THREE.MeshBasicMaterial({ color: 0xff00ff })
      )
      this.parent.add(this.cameraEye)

      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.container.appendChild(this.renderer.domElement)
      window.addEventListener('resize', this.onWindowResize, false)
    },
    onWindowResize() {
      const width = window.innerWidth
      const height = window.innerHeight

      this.renderer.setSize(width, height)
    },

    animate() {
      requestAnimationFrame(this.animate)
      this.render()
    },
    render() {
      // animate camera along spline
      const time = Date.now()
      const looptime = 20 * 1000
      const t = (time % looptime) / looptime

      this.tubeGeometry.parameters.path.getPointAt(t, this.position)
      this.position.multiplyScalar(this.params.scale) // 将该向量与所传入的标量s进行相乘

      // interpolation
      const segments = this.tubeGeometry.tangents.length
      const pickt = t * segments
      const pick = Math.floor(pickt)
      const pickNext = (pick + 1) % segments

      this.binormal.subVectors(
        this.tubeGeometry.binormals[pickNext],
        this.tubeGeometry.binormals[pick]
      )
      this.binormal
        .multiplyScalar(pickt - pick)
        .add(this.tubeGeometry.binormals[pick])

      this.tubeGeometry.parameters.path.getTangentAt(t, this.direction)
      const offset = 5

      this.normal.copy(this.binormal).cross(this.direction)

      // we move on a offset on its binormal

      this.position.add(this.normal.clone().multiplyScalar(offset))

      this.splineCamera.position.copy(this.position)
      this.cameraEye.position.copy(this.position)

      // using arclength for stablization in look ahead
      this.tubeGeometry.parameters.path.getPointAt(
        (t + 30 / this.tubeGeometry.parameters.path.getLength()) % 1,
        this.lookAt
      )
      // 注释这句代码后，镜头朝向了原点位置
      this.lookAt.multiplyScalar(this.params.scale) // 将该向量与所传入的标量s进行相乘

      // camera orientation 2 - up orientation via normal
      if (!this.params.lookAhead) {
        this.lookAt.copy(this.position).add(this.direction)
      }
      // 在轨迹线上移动的摄像头朝向
      this.splineCamera.matrix.lookAt(
        this.splineCamera.position,
        this.lookAt,
        this.normal
      )
      // 表示对象局部旋转的Quaternion（四元数）
      this.splineCamera.quaternion.setFromRotationMatrix(
        this.splineCamera.matrix
      )

      this.renderer.render(this.scene, this.splineCamera)
    },
    addTube() {
      // 管道轨迹路径
      const sampleClosedSpline = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -40, -40),
        new THREE.Vector3(0, 40, -40),
        new THREE.Vector3(0, 140, -40),
        new THREE.Vector3(0, 40, 40),
        new THREE.Vector3(0, -40, 40)
      ])

      sampleClosedSpline.curveType = 'catmullrom'
      sampleClosedSpline.closed = this.params.closed
      // sampleClosedSpline.tension = 0
      this.tubeGeometry = new THREE.TubeGeometry(
        sampleClosedSpline,
        this.params.extrusionSegments,
        0.1,
        this.params.radiusSegments,
        this.params.closed
      )
      // 3D shape
      const material = new THREE.MeshLambertMaterial({ color: 0xff00ff })
      const mesh = new THREE.Mesh(this.tubeGeometry, material)

      mesh.scale.set(this.params.scale, this.params.scale, this.params.scale)
      this.parent.add(mesh)
    }
  }
}
</script>
