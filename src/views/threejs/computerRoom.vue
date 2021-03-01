<template>
  <div class="container">
    <div v-if="suportWebGL">
      <!-- 操作菜单 -->
      <div id="toolbar" class="toolbar">
        <el-tooltip
          v-for="(item, index) in btnsConfig"
          :key="item.btnId + '_' + index"
          class="btn-item"
          :content="item.btnTitle"
          effect="dark"
          placement="bottom"
        >
          <i
            :class="item.btnIcon"
            @click.stop="menuEvent($event, item.btnId)"
          ></i>
        </el-tooltip>
      </div>
      <!-- 三维场景容器 -->
      <div id="computerRoom"> </div>
      <!-- 服务器详情容器 -->
      <div id="tooltip"> </div>
      <!-- 渲染性能性能监控器 -->
      <div id="stasWrap"> </div>
    </div>
    <div v-else ref="notSuport"> </div>

    <el-dialog
      :title="cameraName + '视频监控'"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleDialogClose"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <video
        class="video-wrapper"
        src="https://vjs.zencdn.net/v/oceans.mp4"
        controls="controls"
        preload="auto"
      >
        your browser does not support the video tag
      </video>
    </el-dialog>
  </div>
</template>
<script>
import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)
import { WEBGL } from 'three/examples/jsm/WebGL.js'
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { objectModel, btnsConfig } from '@/utils/modelData'
import {
  createBox,
  createCylinder,
  createPlane,
  createEmptyBox,
  createFloor,
  createWall,
  createDoor,
  createCabinet
} from '@/utils/createModelObject'

export default {
  name: 'MeetingRoom',
  data() {
    return {
      dialogVisible: false,
      cameraName: '',
      btnsConfig, // 操作按钮配置项
      areaWidth: 0, // 窗口宽度
      areaHeight: 0, // 窗口高度
      isFirstPerson: false, // 是否开启第一人称漫游
      isStats: true // 是否开启性能检测控件
    }
  },
  computed: {
    suportWebGL() {
      // WebGL兼容性检查 WEBGL.isWebGLAvailable()
      return WEBGL.isWebGLAvailable()
    }
  },
  mounted() {
    // WebGL兼容性检查
    if (!this.suportWebGL) {
      const warning = WEBGL.getWebGLErrorMessage()
      this.$refs.notSuport.appendChild(warning)
      return
    }

    /**
     * 初始化三维场景的中全局变量
     * 这些全局变量不能放在data中初始化，会导致运行后的帧率过低，页面卡死
     */
    this.initVariables()
    this.createRenderer()
    this.createCamera()
    this.createScene()
    this.createLight()

    // 一些辅助对象
    this.createHelperObject(true, false)

    // 绘制地板
    createFloor(this)
    // 绘制墙壁
    createWall(this)
    // 绘制门
    createDoor(this)
    // 绘制机柜
    for (let i = 0; i < objectModel.length; i++) {
      const c = objectModel[i].cabinet
      createCabinet(
        this,
        c.size.w,
        c.size.h,
        c.size.d,
        c.position.x,
        c.position.y,
        c.position.z,
        c
      )
    }
    // 绘制监控摄像头模型
    createCylinder(this)

    // // 添加3D模型
    // for (let i = 0; i < objectModel.length; i++) {
    //   const object = objectModel[i]
    //   this.init3DModel(object)
    // }
    if (this.isFirstPerson) {
      this.initFirstPersonControls()
    } else {
      this.initOrbitControls()
    }
    this.render()

    window.addEventListener('resize', this.onWindowResize, false)
  },
  destroyed() {
    this.roomDom.removeEventListener('click', this.onClick, false)
    this.roomDom.removeEventListener('dbclick', this.onClick, false)
    window.removeEventListener('resize', this.onWindowResize, false)
    cancelAnimationFrame(this.myReqAnima)
    clearTimeout(this.clickFlag)

    this.roomDom = null // canvas容器
    this.scene = null // 场景对象
    this.camera = null // 相机对象

    this.resetControls()
    this.stats = null
    this.labelRenderer = null
  },
  methods: {
    handleDialogClose() {
      this.dialogVisible = false
    },
    handleDialogOpen(cameraName) {
      this.dialogVisible = true
      this.cameraName = cameraName
    },
    /**
     * 初始化三维场景的中全局变量
     */
    initVariables() {
      this.clickFlag = null // 鼠标单击
      this.myReqAnima = null // requestAnimationFrame() 开始去执行回调函数的时刻
      this.roomDom = null // 三维场景放置canvas的dom容器
      this.scene = null // 场景
      this.camera = null // 相机
      this.renderer = null // 渲染器
      this.controls = null // 鼠标控制器
      this.stats = null // 性能监控
      this.labelRenderer = null // CSS 3D渲染器
      this.areaWidth = window.innerWidth - 210
      this.areaHeight = window.innerHeight - 60
      this.roomDom = document.getElementById('computerRoom')
      this.stats = this.isStats ? this.initStats() : null
    },
    /**
     * 创建渲染器,并设置渲染器的相关参数
     */
    createRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        logarithmicDepthBuffer: true, // 是否使用对数深度缓存
        alpha: true,
        antialias: true // antialias:是否执行抗锯齿
      })
      // 设置渲染器大小
      this.renderer.setSize(this.areaWidth, this.areaHeight)
      // 兼容高清屏幕
      // this.renderer.setPixelRatio(window.devicePixelRatio)
      // 将渲染器的DOM元素(this.renderer.domElement)添加到roomDom元素中
      this.roomDom.appendChild(this.renderer.domElement)
      // 设置颜色和透明度
      this.renderer.setClearColor(0x1f2d3d, 1)
      this.renderer.shadowMap.enabled = true //
      this.renderer.shadowMapSoft = true

      this.labelRenderer = new CSS2DRenderer()
      this.labelRenderer.setSize(this.areaWidth, this.areaHeight)
      this.labelRenderer.domElement.style.position = 'absolute'
      this.labelRenderer.domElement.style.top = '0px'
      this.roomDom.appendChild(this.labelRenderer.domElement)

      // 绑定事件
      this.roomDom.addEventListener('click', this.onClick, false)
      this.roomDom.addEventListener(
        'dbclick',
        () => {
          clearTimeout(this.clickFlag)
        },
        false
      )
    },
    /**
     * 创建相机,并设置相机的相关参数
     */
    createCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.areaWidth / this.areaHeight,
        1,
        100000
      )
      this.camera.name = 'mainCamera'
      // // 设置摄像机位置
      this.camera.position.set(0, 500, 500)
      // this.camera.position.set(0, 1000, -1800)
      // 相机指向中心位置
      this.camera.lookAt({ x: 0, y: 0, z: 0 })
    },
    /**
     * 创建场景,并设置场景的相关参数
     */
    createScene() {
      this.scene = new THREE.Scene()
    },
    /**
     * 初始化光源,并设置其相关参数
     */
    createLight() {
      const ambient = new THREE.AmbientLight(0xffffff, 0.85) // AmbientLight,影响整个场景的光源
      ambient.position.set(0, 500, 0)
      this.scene.add(ambient)

      /**
       * AmbientLight: 环境光，基础光源，它的颜色会被加载到整个场景和所有对象的当前颜色上。
       * PointLight：点光源，朝着所有方向都发射光线
       * SpotLight ：聚光灯光源：类型台灯，天花板上的吊灯，手电筒等
       * DirectionalLight：方向光，又称无限光，从这个发出的光源可以看做是平行光.
       */
      // const ambientLight = new THREE.AmbientLight(0xcccccc)
      // ambientLight.position.set(0, 0, 0)
      // this.scene.add(ambientLight)
      // const pointLight = new THREE.PointLight(0x555555)
      // pointLight.shadow.camera.near = 1
      // pointLight.shadow.camera.far = 5000
      // pointLight.position.set(0, 350, 0)
      // pointLight.castShadow = true // 表示这个光是可以产生阴影的
      // this.scene.add(pointLight)
    },
    /**
     * 在场景中添加一些辅助对象，有助于理解3D
     * @param isAxes 是否添加坐标轴辅助
     * @param isCamera 是否添加添加相机辅助
     */
    createHelperObject(isAxes, isCamera) {
      if (isAxes) {
        // 添加坐标轴，辅助判断位置
        const axesHelper = new THREE.AxesHelper(1000)
        this.scene.add(axesHelper)
      }
      if (isCamera) {
        // 添加相机辅助，用于模拟相机视锥体的辅助对象
        const cameraHelper = new THREE.CameraHelper(this.camera)
        this.scene.add(cameraHelper)
      }
    },
    /**
     * 根据不同的模型数据，添加相应对象
     * @param object 模型数据，json格式
     */
    init3DModel(object) {
      if (!object.show) {
        return
      }
      /**
       * box: 立方几何体 BoxGeometry
       * cylinder: 圆柱几何体 CylinderGeometry
       * plane: 平面几何体 PlaneGeometry
       * emptyBox: 模型合并 使用ThreeBSP插件
       */
      const objType = object.type
      let obj = null
      switch (objType) {
        case 'box':
          obj = createBox(object)
          this.scene.add(obj)
          break
        case 'cylinder':
          obj = createCylinder(object)
          this.scene.add(obj)
          break
        case 'plane':
          obj = createPlane(object)
          this.scene.add(obj)
          break
        case 'emptyBox':
          obj = createEmptyBox(object)
          this.scene.add(obj)
          break
      }
    },
    initFirstPersonControls() {
      this.controls = new FirstPersonControls(
        this.camera
        // 不能加这个，否则场景不会移动，也不知道为什么
        // this.renderer.domElement
      )

      this.controls.enabled = true
      this.controls.lookVertical = false // 是否可以垂直环顾四周
      this.controls.lookSpeed = 0.02 // 鼠标移动查看的速度
      this.controls.movementSpeed = 100 // 相机移动速度
      this.controls.noFly = false
      this.controls.constrainVertical = false // 约束垂直
      this.controls.verticalMin = 1.0
      this.controls.verticalMax = 2.0
      this.controls.lon = 0 // 进入初始视角x轴的角度
      this.controls.lat = 0 // 初始视角进入后y轴的角度
      this.controls.heightCoef = 0.02 // 确定当y分量接近.heightMax时，相机移动的速度。默认值为1。
      this.clock = new THREE.Clock()
    },
    initOrbitControls() {
      // 鼠标键盘控制
      this.controls = new OrbitControls(
        this.camera,
        this.labelRenderer.domElement
      )
      // 视角最小距离
      this.controls.minDistance = 10
      // 视角最远距离
      this.controls.maxDistance = 1600
      // 最大角度
      this.controls.maxPolarAngle = Math.PI / 1.6
    },
    resetControls() {
      if (this.controls) {
        this.controls.dispose()
      }
      this.clock = null
      this.controls = null
    },
    menuEvent(e, btnId) {
      switch (btnId) {
        case 'btnReset':
          this.handleReset()
          break
        case 'btnStats':
          this.isStats = !this.isStats
          if (this.isStats) {
            this.stats = this.initStats()
          } else {
            const stasWrapDom = document.getElementById('stasWrap')
            stasWrapDom.removeChild(this.stats.domElement)
            this.stats.domElement = null
            this.stats = null
          }
          break
        case 'btnFirstPerson':
          this.handleFirstPerson()
          break

        default:
          break
      }
    },
    handleReset() {
      // 场景复位时，先取消第一人称漫游状态
      if (this.isFirstPerson) {
        this.isFirstPerson = false
        this.resetControls()
        this.initOrbitControls()
      }

      new TWEEN.Tween(this.camera.position)
        .to(
          {
            x: 0,
            y: 500,
            z: 500
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()

      this.camera.updateProjectionMatrix()
      this.controls.reset()
      this.controls.update()
    },
    handleFirstPerson() {
      this.isFirstPerson = !this.isFirstPerson
      this.resetControls()
      if (this.isFirstPerson) {
        this.initFirstPersonControls()
      } else {
        this.initOrbitControls()
      }
      console.info('第一人称巡检', this.controls)
    },
    /**
     * 用相机(camera)渲染一个场景(scene)
     */
    render() {
      TWEEN.update()
      this.isFirstPerson && this.controls.update(this.clock.getDelta())
      this.stats && this.stats.update()

      // 实时渲染
      this.myReqAnima = requestAnimationFrame(this.render)
      this.renderer.render(this.scene, this.camera)
      this.labelRenderer.render(this.scene, this.camera)
    },
    // 初始化性能插件
    initStats() {
      const statsTem = new Stats()
      statsTem.domElement.style.position = 'absolute'
      statsTem.domElement.style.left = 'auto'
      statsTem.domElement.style.right = '110px'
      statsTem.domElement.style.top = '0px'
      const stasWrapDom = document.getElementById('stasWrap')
      stasWrapDom.appendChild(statsTem.domElement)
      return statsTem
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
      // this.controls.handleResize()
      // 重置渲染器输出画布canvas尺寸
      this.renderer.setSize(width, height - 60)
      this.labelRenderer.setSize(width, height - 60)
    },
    /**
     * 点击事件
     */
    onClick(event) {
      clearTimeout(this.clickFlag)
      this.clickFlag = setTimeout(() => {
        event.preventDefault()

        console.log('event.clientX:' + event.clientX)
        console.log('event.clientY:' + event.clientY)
        const x = event.clientX - 210
        const y = event.clientY - 60

        const mouse = new THREE.Vector2()
        // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
        mouse.x = (x / this.areaWidth) * 2 - 1
        mouse.y = -(y / this.areaHeight) * 2 + 1

        const vector = new THREE.Vector3(mouse.x, mouse.y, 1)
        vector.unproject(this.camera)
        const raycaster = new THREE.Raycaster(
          this.camera.position,
          vector.sub(this.camera.position).normalize()
        )

        const intersects = raycaster.intersectObjects(this.scene.children)
        const tooltipDom = document.getElementById('tooltip')
        if (intersects.length === 0) {
          tooltipDom.style.display = 'none' // 隐藏说明性标签
          return
        }
        // 获取选中最近的 Mesh 对象
        const selectObject = intersects[0].object
        console.info('当前点击的物体', selectObject)

        if (!selectObject.name.includes('服务器')) {
          tooltipDom.style.display = 'none' // 隐藏说明性标签

          if (selectObject.name.includes('摄像头')) {
            this.handleDialogOpen(selectObject.name)
          }
        } else {
          if (!selectObject.open) {
            tooltipDom.style.display = 'block' // 显示说明性标签
            // 修改标签的位置
            tooltipDom.style.left = x + 50 + 'px'
            tooltipDom.style.top = y - 30 + 'px'
            tooltipDom.innerHTML =
              selectObject.name +
              '<br/>' +
              '运行' +
              (selectObject.info.deviceStatus ? '异常' : '正常') // 显示详细信息
            if (selectObject.info.deviceStatus) {
              new TWEEN.Tween(this.camera.position)
                .to(
                  {
                    x: (this.camera.position.x + selectObject.position.x) / 2,
                    y: 200,
                    z: (this.camera.position.z + selectObject.position.z) / 2
                  },
                  1000
                )
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()

              // this.camera.updateProjectionMatrix()
            }
          } else {
            tooltipDom.style.display = 'none' // 隐藏说明性标签
          }
        }
        if (selectObject.toggle && typeof selectObject.toggle === 'function') {
          selectObject.toggle(selectObject)
        }
      }, 250)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
}
#stasWrap {
  position: absolute;
  top: 10px;
  left: 200px;
}
#tooltip {
  display: none;
  position: absolute;
  padding: 10px;
  width: 300px;
  text-align: left;
  color: #ffffff;
  border: 1px solid #14171c;
  background: linear-gradient(0deg, #1e202a 0%, #0d1013 100%);
  box-shadow: 0px 2px 21px 0px rgba(33, 34, 39, 0.55);
  border-radius: 4px;
}
::v-deep .label {
  background-color: #e6a23c;
  border-radius: 3px;
  font-size: 4px;
  color: #ffffff;
  width: 100px;
  padding: 5px;
  height: 50px;
  line-height: 1;
  overflow: auto;
}
.toolbar {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #19304c;
  color: #19ffff;
  padding: 5px;
  z-index: 10;
  .btn-item {
    margin: 0 5px;
    font-size: 18px;
    cursor: pointer;
  }
}
.video-wrapper {
  width: 100%;
}
</style>
