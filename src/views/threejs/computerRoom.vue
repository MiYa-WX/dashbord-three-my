<template>
  <div class="container">
    <div v-if="suportWebGL">
      <!-- 操作菜单 -->
      <div id="toolbar" class="toolbar">
        <el-tooltip
          v-for="(item, index) in btnsConfigFilter"
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
        ref="media"
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
import { Message } from 'element-ui'
import * as THREE from 'three'
import { WEBGL } from 'three/examples/jsm/WebGL.js'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { objectModel, btnsConfig } from '@/views/threejs/utils/modelData'

import {
  createCylinder,
  createFloor,
  createWall,
  createDoor,
  createCabinet,
  createLines,
  // createBox,
  modelBsp
} from '@/views/threejs/utils/createModelObject'

export default {
  name: 'MeetingRoom',
  data() {
    return {
      dialogVisible: false,
      cameraName: '',
      areaWidth: 0, // 窗口宽度
      areaHeight: 0, // 窗口高度
      isFirstPerson: false, // 是否开启第一人称漫游
      isStats: true, // 是否开启性能检测控件
      isShowLines: false, // 是否开启走线管理
      isShowAuto: false, // 是否开启自动路径巡检
      isPathAuto: false, // 是否开启路线巡检
      isShowSmoking: false, // 是否开启模拟烟雾报警
      pos: 0 // 用于控制路径巡检时的坐标偏移量
    }
  },
  computed: {
    suportWebGL() {
      // WebGL兼容性检查 WEBGL.isWebGLAvailable()
      return WEBGL.isWebGLAvailable()
    },
    // 操作按钮配置项,为避免v-for和v-if用在同一个元素上，将btnsConfig过滤后进行绑定
    btnsConfigFilter() {
      return btnsConfig.filter((item) => {
        return item.show
      })
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

    // 添加3D模型
    for (let i = 0; i < objectModel.length; i++) {
      const objectItem = objectModel[i]
      this.init3DModel(objectItem)
    }
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
    this.roomDom.removeEventListener('dbclick', this.dbClick, false)
    window.removeEventListener('resize', this.onWindowResize, false)
    this.renderer.forceContextLoss()
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
    /**
     * 初始化三维场景的中全局变量
     */
    initVariables() {
      this.clickFlag = null // 鼠标单击
      this.myReqAnima = null // requestAnimationFrame() 开始执行回调函数的时刻
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
      this.mouse = new THREE.Vector2()
    },
    /**
     * 创建渲染器,并设置渲染器的相关参数
     */
    createRenderer() {
      this.renderer = new THREE.WebGLRenderer({
        logarithmicDepthBuffer: false, // 是否使用对数深度缓存
        alpha: true,
        antialias: true // antialias:是否执行抗锯齿
      })
      // 设置渲染器大小
      this.renderer.setSize(this.areaWidth, this.areaHeight)
      // 兼容高清屏幕
      this.renderer.setPixelRatio(window.devicePixelRatio)
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
      this.roomDom.addEventListener('dbclick', this.dbClick, false)
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
      // 设置摄像机位置
      this.camera.position.set(0, 900, 1000)
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
     * @param object 原始模型数据，json格式
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
        case 'floor':
          obj = createFloor(object)
          this.scene.add(obj)
          break
        case 'wall':
          for (let i = 0; i < object.wallData.length; i++) {
            const item = object.wallData[i]
            item.style = {
              skinWhole: {
                skinColor: '',
                skinImgUrl: object.style.skinWhole.skinImgUrl
              }
            }
            obj = createWall(item)
            // 墙上是否有门
            if (item.door.isDoor) {
              const geometryDong = new THREE.BoxGeometry(80, 150 - 30, 2)
              const dongMesh = new THREE.Mesh(geometryDong, obj.material)
              // TODO 位置这个地方计算有点误差，虽然现在效果是可以的，但是洞的高度不对
              dongMesh.position.set(
                item.position.x,
                item.position.y - 30 / 2,
                item.position.z
              )
              dongMesh.name = '门洞'
              const objectsCube = []
              objectsCube.push(dongMesh)
              obj = modelBsp(obj, objectsCube, obj.material)
              obj.name = item.name + '门洞'

              // 添加门
              const doorOobj = createDoor(item.door)
              this.scene.add(doorOobj)
            }
            this.scene.add(obj)
          }
          break
        case 'cylinderCamera':
          obj = createCylinder(object)
          this.scene.add(obj)
          break
        case 'cabinet':
          obj = createCabinet(object)
          this.scene.add(obj)
          break
      }
    },
    /**
     * 初始化第一人称控制器
     */
    initFirstPersonControls() {
      this.controls = new FirstPersonControls(this.camera)
      this.controls.enabled = true
      this.controls.lookVertical = false // 是否可以垂直环顾四周
      this.controls.lookSpeed = 0.02 // 鼠标移动查看的速度
      this.controls.movementSpeed = 1000 // 相机移动速度
      this.controls.autoForward = false
      // this.controls.noFly = true
      // this.controls.constrainVertical = true // 约束垂直
      // this.controls.verticalMin = 1.0
      // this.controls.verticalMax = 200.0
      this.controls.lon = 0 // 进入初始视角x轴的角度
      this.controls.lat = 10 // 初始视角进入后y轴的角度
      this.controls.heightCoef = 0.02 // 确定当y分量接近.heightMax时，相机移动的速度。默认值为1。

      this.clock = new THREE.Clock()
    },
    /**
     * 初始化轨道控制器
     */
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
      this.controls.maxPolarAngle = Math.PI / 1.5
    },
    /**
     * 重置控制器
     */
    resetControls() {
      if (this.controls) {
        this.controls.dispose()
      }
      if (this.isFirstPerson && this.clock) {
        this.controls.enabled = false
        this.clock = null
      }
      this.controls = null
    },
    /**
     * 初始化性能插件
     */
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
      const width = window.innerWidth - 210
      const height = window.innerHeight - 60
      this.camera.aspect = width / height
      // 更新摄像机投影矩阵。如果相机的一些属性发生了变化，必须被调用。
      this.camera.updateProjectionMatrix()
      // 重置渲染器输出画布canvas尺寸
      this.renderer.setSize(width, height)
      this.labelRenderer.setSize(width, height)
    },
    /**
     * 打开视频播放对话框
     */
    handleDialogOpen(cameraName) {
      this.dialogVisible = true
      // 弹框上展示摄像机的名字
      this.cameraName = cameraName
      const mediaRef = this.$refs.media
      mediaRef.load()
    },
    /**
     * 关闭视频播放对话框
     */
    handleDialogClose() {
      this.dialogVisible = false
      // 弹框关闭后，暂停播放视频
      const mediaRef = this.$refs.media
      mediaRef.pause()
    },
    /**
     * 右上角按钮点击事件，TODO 待优化
     */
    menuEvent(e, btnId) {
      switch (btnId) {
        // 场景复位
        case 'btnReset':
          this.handleReset()
          break
        // 开启性能检测
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
        // 路线巡检
        case 'btnAuto':
          this.handleAutoPath()
          break
        // 第一人称巡检
        case 'btnFirstPerson':
          this.handleFirstPerson()
          break
        // 机柜自动巡检
        case 'btnCabinet':
          this.handleAutoCheck()
          break
        // 模拟烟雾告警
        case 'btnSmoking':
          this.handleSmoking()
          break
        // 走线管理
        case 'btnConnection':
          this.isShowLines = !this.isShowLines
          if (this.isShowLines) {
            for (let i = 0; i < objectModel.length; i++) {
              const objectItem = objectModel[i]
              if (objectItem.type !== 'line') {
                continue
              }
              for (let i = 0; i < objectItem.linesData.length; i++) {
                const item = objectItem.linesData[i]
                const obj = createLines(item)
                this.scene.add(obj)
              }
            }
          } else {
            for (let i = this.scene.children.length - 1; i >= 0; i--) {
              const element = this.scene.children[i]
              if (element.type === 'Line') {
                element.geometry.dispose() // 删除几何体
                element.material.dispose() // 删除材质
                this.scene.remove(element)
              }
            }
          }
          break
        default:
          break
      }
    },
    /**
     * 场景复位按钮
     */
    handleReset() {
      // 场景复位时，先取消第一人称漫游状态
      if (this.isFirstPerson) {
        this.controls.enabled = false
        this.isFirstPerson = false
      }

      new TWEEN.Tween(this.camera.position)
        .to(
          {
            x: 0,
            y: 900,
            z: 1000
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      this.camera.updateProjectionMatrix()
    },
    /**
     * 创建路线巡检中的模型和轨迹
     */
    walkAuto() {
      const geometryP = new THREE.SphereGeometry(10, 32, 32)
      const materialP = new THREE.MeshBasicMaterial({
        color: 0x409eff
      })
      this.circleP = new THREE.Mesh(geometryP, materialP)
      this.circleP.position.set(0, 10, (128 * 3) / 2 + 20)
      // this.scene.add(this.circleP)

      // const loader = new GLTFLoader()

      // loader.load('/models//RobotExpressive.glb', (gltf) => {
      //   const model = gltf.scene
      //   model.scale.set(10, 10, 10)
      //   model.rotation.y = Math.PI
      //   this.mixer = new THREE.AnimationMixer(model)
      //   const action = this.mixer.clipAction(gltf.animations[10])
      //   action.play()
      //   this.circleP = model
      //   this.scene.add(this.circleP)
      // })

      // 轨迹线
      const path = [
        new THREE.Vector3(0, 65, 600 / 2 - 50 - 20),
        new THREE.Vector3(-10, 65, 180),
        new THREE.Vector3(-150, 65, 180)
      ]

      this.curve = new THREE.CatmullRomCurve3(
        path,
        false // 是否闭合
      )
      const points = this.curve.getPoints(1000)
      // 定义线的基本材料，我们可以使用LineBasicMaterial（实线材料）和LineDashedMaterial（虚线材料）
      const material = new THREE.LineBasicMaterial({
        color: 0xff0000
      })

      /** 设置具有几何顶点的几何（Geometry）或缓冲区几何（BufferGeometry）设置顶点位置，
       * 看名字就知道了，一个是直接将数据保存在js里面的，另一个是保存在WebGL缓冲区内的，而且肯定保存到WebGL缓冲区内的效率更高
       */
      const geometryLine = new THREE.BufferGeometry()
      // 将线条展示出来
      // geometryLine.setFromPoints(points) // 通过点队列设置该 BufferGeometry 的 attribute。

      geometryLine.vertices = path
      // 使用Line方法将线初始化
      const lineObject = new THREE.Line(geometryLine, material)
      lineObject.name = '巡检路径'
      // 将线添加到场景
      this.scene.add(lineObject)
    },
    /**
     * 路线巡检按钮
     */
    handleAutoPath() {
      if (this.isFirstPerson) {
        Message.warning('正在第一人称巡检,请先结束本次巡检！')
        return
      }
      this.isPathAuto = !this.isPathAuto
      if (this.isPathAuto) {
        this.walkAuto()
      } else {
        this.circleP.geometry.dispose()
        this.circleP.material.dispose()

        // this.circleP.traverse((obj) => {
        //   if (obj.type === 'Mesh') {
        //     obj.geometry.dispose()
        //     obj.material.dispose()
        //   }
        // })

        let pathLine = this.scene.getObjectByName('巡检路径')
        pathLine.geometry.dispose()
        pathLine.material.dispose()
        this.scene.remove(this.circleP, pathLine)
        this.circleP = null
        pathLine = null
        this.pos = 0
        this.handleReset()
      }
    },
    /**
     * 第一人称巡检按钮
     */
    handleFirstPerson() {
      if (this.isPathAuto) {
        Message.warning('正在自动巡检,请先结束本次巡检！')
        return
      }
      this.isFirstPerson = !this.isFirstPerson
      this.resetControls()
      if (this.isFirstPerson) {
        this.initFirstPersonControls()
      } else {
        this.initOrbitControls()
        this.handleReset()
      }
    },
    /**
     * 更新精灵位置
     */
    updateSpritePosition() {
      const dpr = window.devicePixelRatio

      const textureSize = 128 * dpr
      const halfWidth = this.areaWidth / 2
      const halfHeight = this.areaHeight / 2

      const halfImageWidth = textureSize / 2
      const halfImageHeight = textureSize / 2
      this.sprite.position.set(
        halfWidth - halfImageWidth,
        -halfHeight + halfImageHeight,
        1
      )
    },
    /**
     * 自动巡检机柜按钮
     */
    handleAutoCheck() {
      this.isShowAuto = !this.isShowAuto
      const curObject = this.scene.getObjectByName('1-2号服务器')
      // const curObjectFront = curObject.getObjectByName('front')

      if (this.isShowAuto) {
        new TWEEN.Tween(this.camera.position)
          .to(
            {
              x:
                (curObject.geometry.parameters.width + curObject.position.x) /
                2,
              y: 90,
              z: 85
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            this.camera.lookAt(curObject.position)

            this.cameraOrtho = null
            this.sceneOrtho = null
            this.cameraOrtho = new THREE.OrthographicCamera(
              -this.areaWidth / 2,
              this.areaWidth / 2,
              this.areaHeight / 2,
              -this.areaHeight / 2,
              1,
              100000
            )
            this.cameraOrtho.position.z = 10

            this.sceneOrtho = new THREE.Scene()
            this.dpr = window.devicePixelRatio
            this.vector = new THREE.Vector2()
            this.textureSize = 128 * this.dpr
            const data = new Uint8Array(this.textureSize * this.textureSize * 3)
            this.texture = new THREE.DataTexture(
              data,
              this.textureSize,
              this.textureSize,
              THREE.RGBFormat
            )
            this.texture.minFilter = THREE.NearestFilter
            this.texture.magFilter = THREE.NearestFilter

            const spriteMaterial = new THREE.SpriteMaterial({
              map: this.texture
            })
            // 精灵是一个总是面朝着摄像机的平面，通常含有使用一个半透明的纹理
            this.sprite = new THREE.Sprite(spriteMaterial)
            this.sprite.scale.set(this.textureSize, this.textureSize, 1)
            this.sceneOrtho.add(this.sprite)
            this.updateSpritePosition()
          })
          .start()
      } else {
        this.handleReset()
      }
    },
    /**
     * 模拟烟雾报警
     */
    handleSmoking() {
      this.isShowSmoking = !this.isShowSmoking
    },
    /**
     * 用相机(camera)渲染一个场景(scene)
     */
    render() {
      TWEEN.update()
      this.stats && this.stats.update()
      if (this.isFirstPerson) {
        this.controls.update(this.clock.getDelta())
      } else {
        // 这里要在这里更新轨道控制器，是重置控制器相机角度的关键
        this.controls.update()
      }
      if (this.isPathAuto && this.circleP) {
        this.updateAuto()
      }
      this.renderer.autoClear = false
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
      this.labelRenderer.render(this.scene, this.camera)
      this.isShowAuto && this.renderAuto()

      // 实时渲染
      this.myReqAnima = requestAnimationFrame(this.render)
    },
    /**
     * 路线巡检动画
     */
    updateAuto() {
      if (this.pos < 1) {
        // const points = this.curve.getPointAt(this.pos)
        // this.circleP.position.copy(points) // 模型移动

        const point = this.curve.getPoint(this.pos)
        // 模型的偏移量
        const offsetAngle = Math.PI
        // 创建一个4维矩阵
        const mtx = new THREE.Matrix4()
        mtx.lookAt(this.circleP.position.clone(), point, this.circleP.up)
        mtx.multiply(
          new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(0, offsetAngle, 0)
          )
        )
        // 计算出需要进行旋转的四元数值
        const toRot = new THREE.Quaternion().setFromRotationMatrix(mtx)
        // 根据以上值调整角度
        this.circleP.quaternion.slerp(toRot, 0.2)
        this.circleP.position.set(point.x, point.y, point.z)

        // todo 摄像头模型的视角获取
        // this.controls.target = new THREE.Vector3(point.x, point.y, point.z)
        this.camera.quaternion.slerp(toRot, 0.5)
        this.camera.position.set(point.x, point.y, point.z) // + 80
        // 在轨迹线上移动的摄像头朝向
        this.camera.lookAt(point.x, point.y, point.z)
        this.pos += 0.001
      } else {
        // 回到最初的位置就不要动啦
        if (this.pos > 1) {
          return
        } else {
          this.pos = 0
        }
      }
    },
    /**
     * 机柜自动巡检动画
     */
    renderAuto() {
      const time = Date.now() * 0.0005
      const d = 20
      this.camera.position.y = 100 + Math.cos(time) * d
      this.vector.x = (this.areaWidth * this.dpr) / 2 - this.textureSize / 2
      this.vector.y = (this.areaHeight * this.dpr) / 2 - this.textureSize / 2

      // 将当前WebGLFramebuffer中的像素复制到2D纹理中
      this.renderer.copyFramebufferToTexture(this.vector, this.texture)

      this.renderer.clearDepth()
      this.renderer.render(this.sceneOrtho, this.cameraOrtho)
    },
    /**
     * 点击事件
     */
    onClick(event) {
      clearTimeout(this.clickFlag)
      this.clickFlag = setTimeout(() => {
        event.preventDefault()
        const x = event.clientX
        const y = event.clientY
        // 返回元素的大小及其相对于视口的位置
        const roomRect = this.roomDom.getBoundingClientRect()
        // 屏幕坐标转标准设备坐标
        this.mouse.x = ((x - roomRect.left) / this.roomDom.offsetWidth) * 2 - 1 // 标准设备横坐标
        this.mouse.y = -((y - roomRect.top) / this.roomDom.offsetHeight) * 2 + 1 // 标准设备纵坐标

        const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 1)
        // 标准设备坐标转世界坐标
        const worldVector = vector.unproject(this.camera)
        // 射线投射方向单位向量(worldVector坐标减相机位置坐标)
        const ray = worldVector.sub(this.camera.position).normalize()
        // 创建射线投射器对象
        const raycaster = new THREE.Raycaster(this.camera.position, ray)
        // 返回射线选中的对象
        const intersects = raycaster.intersectObjects(this.scene.children, true)
        const tooltipDom = document.getElementById('tooltip')
        if (intersects.length === 0) {
          tooltipDom.style.display = 'none' // 隐藏说明性标签
          return
        }
        // 获取选中最近的 Mesh 对象
        const selectObject = intersects[0].object
        console.info('当前点击的物体', selectObject)
        if (selectObject.name.includes('doorFront')) {
          this.openDoor(selectObject)
        }
        if (selectObject.name.includes('服务器')) {
          this.openServers(selectObject)
        }

        if (!selectObject.name.includes('服务器')) {
          tooltipDom.style.display = 'none' // 隐藏说明性标签

          if (selectObject.name.includes('摄像头')) {
            this.handleDialogOpen(selectObject.name)
          }
        } else {
          tooltipDom.style.display = 'block' // 显示说明性标签
          // 修改标签的位置
          tooltipDom.style.left = x - roomRect.x + 50 + 'px' // roomRect.x是元素的原点横坐标
          tooltipDom.style.top = y - roomRect.y - 30 + 'px' // roomRect.y是元素的原点纵坐标
          tooltipDom.innerHTML =
            selectObject.name +
            '<br/>' +
            '运行' +
            (!selectObject.info.deviceStatus ? '正常' : '异常') // 显示详细信息
        }
      }, 250)
    },
    /**
     * 房门、机柜门打开关闭
     */
    openDoor(selectObject) {
      const scale = selectObject.geometry.parameters

      if (selectObject.rotation.y === 0) {
        // 门的旋转
        new TWEEN.Tween(selectObject.rotation)
          .to(
            {
              y: 0.5 * Math.PI
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        // 门的位置
        new TWEEN.Tween(selectObject.position)
          .to(
            {
              x: selectObject.position.x + scale.width / 2,
              z: selectObject.position.z + scale.width / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        // // 相机的位置 相机位置变化之后 会有问题 先注释
        // new TWEEN.Tween(this.camera.position)
        //   .to(
        //     {
        //       x: selectObject.position.x,
        //       y: selectObject.position.y + scale.height * 0.95,
        //       z: selectObject.position.z + scale.width * 1.85
        //     },
        //     500
        //   )
        //   .start()
      } else {
        new TWEEN.Tween(selectObject.rotation)
          .to(
            {
              y: 0
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        new TWEEN.Tween(selectObject.position)
          .to(
            {
              x: selectObject.position.x - scale.width / 2,
              z: selectObject.position.z - scale.width / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
      }
    },
    /**
     * 服务器推进拉出
     */
    openServers(selectObject) {
      const scale = selectObject.geometry.parameters
      if (selectObject.info.deviceStatus) {
        return false
      }
      // 如果服务器在原位置,则执行推出 30是服务器相对于机柜的原位置z坐标
      if (selectObject.position.z === 30) {
        new TWEEN.Tween(selectObject.position)
          .to(
            {
              z: selectObject.position.z + scale.depth / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
      } else {
        new TWEEN.Tween(selectObject.position)
          .to(
            {
              z: selectObject.position.z - scale.depth / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
      }
    },
    /**
     * 双击事件
     */
    dbClick(event) {
      event.preventDefault()
      clearTimeout(this.clickFlag)
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
  color: #ffffff;
  // width: 100px;
  // height: 50px;
  // border-radius: 3px;
  // font-size: 4px;
  // padding: 5px;
  // line-height: 1;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 25px;
  line-height: 30px;
  text-align: center;
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
