<template>
  <div class="container">
    <div id="info"> </div>
    <div id="computerRoom"> </div>
  </div>
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

    // 绘制地板
    this.createFloor()
    // 绘制墙壁
    this.createWall()
    // 绘制墙壁
    this.createCabinet()

    this.render()

    // 鼠标键盘控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    window.addEventListener('click', this.onClick, false)
    window.addEventListener('resize', this.onWindowResize, false)
  },
  destroyed() {
    window.removeEventListener('click', this.onClick, false)
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
        10000
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
     * 绘制地板，并贴图
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
          // 设置阵列模式   默认ClampToEdgeWrapping  RepeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          const repeatWidthNum = 4
          const repeatHeightNum = 7

          // uv两个方向纹理重复数量
          texture.repeat.set(repeatWidthNum, repeatHeightNum)
          // 绘制地板
          const boxGeo = new THREE.BoxBufferGeometry(
            texture.image.width * repeatWidthNum, // X轴上面的宽度
            4, // Y轴上面的高度
            texture.image.height * repeatHeightNum // Z轴上面的深度
          )
          const boxMesh = new THREE.Mesh(boxGeo, boxTextureMaterial)
          boxMesh.name = '地板'
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
     * 绘制墙壁
     */
    createWall() {
      const material = new THREE.MeshBasicMaterial({ color: 0xafc0ca })

      const geometryAB = new THREE.BoxBufferGeometry(1, 200, 128 * 7)

      const wallMeshBefore = new THREE.Mesh(geometryAB, material)
      wallMeshBefore.position.set((128 * 4) / 2, 100, 0)
      wallMeshBefore.name = '墙壁Before'
      this.scene.add(wallMeshBefore)

      const wallMeshAfter = new THREE.Mesh(geometryAB, material)
      wallMeshAfter.position.set(-(128 * 4) / 2, 100, 0)
      wallMeshAfter.name = '墙壁After'
      this.scene.add(wallMeshAfter)

      const geometryLR = new THREE.BoxBufferGeometry(1, 200, 128 * 4)

      const wallMeshLeft = new THREE.Mesh(geometryLR, material)
      wallMeshLeft.position.set(0, 100, (128 * 7) / 2)
      wallMeshLeft.rotation.y += 1.5 * Math.PI
      wallMeshLeft.name = '墙壁Left'
      this.scene.add(wallMeshLeft)

      const wallMeshRight = new THREE.Mesh(geometryLR, material)
      wallMeshRight.position.set(0, 100, -(128 * 7) / 2)
      wallMeshRight.rotation.y += 1.5 * Math.PI
      wallMeshRight.name = '墙壁Right'
      this.scene.add(wallMeshRight)
    },
    /**
     * 绘制机柜
     */
    createCabinet() {
      const materialCabinet = new THREE.MeshPhongMaterial({ color: 0x42474c })

      const geometryAB = new THREE.BoxBufferGeometry(60, 300, 30)
      const wallMeshBefore = new THREE.Mesh(geometryAB, materialCabinet)
      wallMeshBefore.name = '墙壁Before'
      const wallMeshAfter = new THREE.Mesh(geometryAB, materialCabinet)
      wallMeshAfter.name = '墙壁After'

      const geometryLR = new THREE.BoxBufferGeometry(30, 300, 30)
      const wallMeshLeft = new THREE.Mesh(geometryLR, materialCabinet)
      wallMeshLeft.name = '墙壁Left'
      const wallMeshRight = new THREE.Mesh(geometryLR, materialCabinet)
      wallMeshRight.name = '墙壁Right'

      const cabientGroup = new THREE.Group()
      cabientGroup.add(wallMeshBefore)
      cabientGroup.add(wallMeshAfter)
      cabientGroup.add(wallMeshLeft)
      cabientGroup.add(wallMeshRight)

      cabientGroup.position.set(100, 0, 200)
      cabientGroup.name = '机柜'
      this.scene.add(cabientGroup)
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
     * 点击事件
     */
    onClick(event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      // var intersects = getIntersects(event)
      event.preventDefault()
      console.log('event.clientX:' + event.clientX)
      console.log('event.clientY:' + event.clientY)
      let x = 0
      let y = 0
      if (event.changedTouches) {
        x = event.changedTouches[0].pageX
        y = event.changedTouches[0].pageY
      } else {
        x = event.clientX
        y = event.clientY
      }
      // 声明 raycaster 和 mouse 变量
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      mouse.x = (x / (window.innerWidth + 210)) * 2 - 1
      mouse.y = -(y / window.innerHeight) * 2 + 1

      // 通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, this.camera)

      // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
      const intersects = raycaster.intersectObjects(this.scene.children)

      const infoDom = document.getElementById('info')
      if (intersects.length === 0) {
        infoDom.style.display = 'none' // 隐藏说明性标签
        return
      }
      // 获取选中最近的 Mesh 对象
      const selectObject = intersects[0].object
      console.info('当前点击的物体', selectObject)

      infoDom.style.display = 'block' // 显示说明性标签
      // 修改标签的位置
      infoDom.style.left = x + 'px'
      infoDom.style.top = y + 'px'
      infoDom.innerHTML = selectObject.name // 显示模型信息

      if (selectObject.name.startsWith('机柜')) {
        infoDom.innerHTML = selectObject.name + '详细信息' // 显示机柜详细信息
        this.camera.fov = 50
        this.camera.updateProjectionMatrix()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
}
#info {
  display: none;
  position: absolute;
  padding: 10px;
  background: rgba(255, 255, 255, 0.6);
  line-height: 1;
  border-radius: 5px;
}
</style>
