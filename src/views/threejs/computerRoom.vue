<template>
  <div id="computerRoom"> </div>
</template>
<script>
import * as THREE from 'three'
// const ThreeBSP = require('three-js-csg')(THREE)

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
export default {
  name: 'MeetingRoom',
  data() {
    return {
      roomDom: null, // canvas容器
      windowWidth: 0, // 窗口宽度
      windowHeight: 0, // 窗口高度
      scene: null,
      camera: null,
      renderer: null,
      textureLoader: null,
      controls: null
    }
  },
  mounted() {
    this.roomDom = document.getElementById('computerRoom')
    this.windowWidth = document.body.clientWidth - 210
    this.windowHeight = window.innerHeight
    this.createScene()
    this.createCamera()
    this.createRenderer()
    this.appendDom()
    this.initLight()

    // 添加坐标轴，辅助判断位置
    const axes = new THREE.AxesHelper(1000)
    this.scene.add(axes)

    // 创建纹理加载器
    this.textureLoader = new THREE.TextureLoader()

    // 创建地板
    this.createFloor()
    // 创建墙壁
    this.createWall()

    this.render()

    // 鼠标键盘控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener('resize', this.onWindowResize, false)
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize, false)
  },
  methods: {
    /**
     * 创建场景,并设置场景的相关参数
     */
    createScene() {
      this.scene = new THREE.Scene()
    },
    /**
     * 创建相机,并设置相机的相关参数
     */
    createCamera() {
      this.camera = new THREE.PerspectiveCamera(
        100,
        this.windowWidth / this.windowHeight,
        0.1,
        1000
      )
      this.camera.name = 'mainCamera'
      // 设置摄像机位置
      this.camera.position.set(550, 550, 0)
      // 指向场景中心
      this.camera.lookAt(this.scene.position)
    },
    /**
     * 创建渲染器,并设置渲染器的相关参数
     */
    createRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      // 设置颜色和透明度
      this.renderer.setClearAlpha(0.5)
      this.renderer.setClearColor(0x080b30, 1)
      // 设置渲染器大小
      this.renderer.setSize(this.windowWidth, this.windowHeight - 60)
      // 兼容高清屏幕
      this.renderer.setPixelRatio(window.devicePixelRatio)
    },

    /**
     * 将渲染器的DOM元素(this.renderer.domElement)添加到roomDom元素中
     */
    appendDom() {
      this.roomDom.appendChild(this.renderer.domElement)
    },

    /**
     * 初始化光源,并设置其相关参数
     */
    initLight() {
      const light = new THREE.DirectionalLight(0x606060) // 平行光是沿着特定方向发射的光
      light.position.set(1, 0.75, 0.5).normalize()
      this.scene.add(light) // 将光源添加到场景中

      const ambient = new THREE.AmbientLight(0x999999) //  环境光
      this.scene.add(ambient)
    },
    /**
     * 用相机(camera)渲染一个场景(scene)
     */
    render() {
      this.renderer.render(this.scene, this.camera)
      // 实时渲染
      requestAnimationFrame(this.render)
    },
    /**
     * 窗口变化的自适应
     */
    onWindowResize() {
      const width = window.innerWidth
      const height = window.innerHeight
      this.camera.aspect = width / height
      // 更新摄像机投影矩阵。如果相机的一些属性发生了变化，必须被调用。
      this.camera.updateProjectionMatrix()

      // 重置渲染器输出画布canvas尺寸
      this.renderer.setSize(width, height - 60)
    },
    /**
     * 创建地板，并贴图
     */
    createFloor() {
      // 创建材质并贴上纹理
      this.textureLoader.load(
        '/source/textures/floor/floorMy.png',
        // onLoad回调
        (texture) => {
          const boxTextureMaterial = new THREE.MeshStandardMaterial({
            map: texture, // 颜色贴图
            metalness: 0.0, // 材质与金属的相似度
            roughness: 0.7, // 材质的粗糙程度
            side: THREE.DoubleSide // 定义将要渲染哪一面：正面(THREE.BackSide)，背面(THREE.FrontSide)或两者(THREE.DoubleSide)
          })
          // 设置阵列模式   默认ClampToEdgeWrapping  repeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
          texture.wrapS = texture.wrapT = THREE.repeatWrapping
          const repeatWidthNum = 4
          const repeatHeightNum = 7

          // uv两个方向纹理重复数量
          texture.repeat.set(repeatWidthNum, repeatHeightNum)
          // 创建地板
          const boxGeo = new THREE.BoxBufferGeometry(
            texture.image.width * repeatWidthNum, // X轴上面的宽度
            4, // Y轴上面的高度
            texture.image.height * repeatHeightNum // Z轴上面的深度
          )
          const boxMesh = new THREE.Mesh(boxGeo, boxTextureMaterial)
          boxMesh.position.set(0, 0, 0)
          this.scene.add(boxMesh)
        },

        // 目前暂不支持onProgress的回调
        undefined,

        // onError回调
        (err) => {
          console.error('An error happened in textureLoader.', err)
        }
      )
    },
    /**
     * 创建墙壁
     */
    createWall() {
      const material = new THREE.MeshBasicMaterial({ color: 0xa8aaaf })

      const geometryAfter = new THREE.BoxBufferGeometry(1, 200, 128 * 7)
      const wallMeshAfter = new THREE.Mesh(geometryAfter, material)
      wallMeshAfter.position.set(-(128 * 4) / 2, 100, 0)
      this.scene.add(wallMeshAfter)

      const geometryLeft = new THREE.BoxBufferGeometry(128 * 4, 200, 1)
      const wallMeshLeft = new THREE.Mesh(geometryLeft, material)
      wallMeshLeft.position.set(0, 100, (128 * 7) / 2)
      this.scene.add(wallMeshLeft)

      const geometryRight = new THREE.BoxBufferGeometry(128 * 4, 200, 1)
      const wallMeshRight = new THREE.Mesh(geometryRight, material)
      wallMeshRight.position.set(0, 100, -(128 * 7) / 2)
      this.scene.add(wallMeshRight)
    }
  }
}
</script>
<style lang="scss" scoped></style>
