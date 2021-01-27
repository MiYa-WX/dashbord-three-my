<template>
  <div id="computerRoom"> </div>
</template>
<script>
import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import Detector from 'three/examples/jsm/libs/Detector.js' //  加载 WebGl 探测器
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
      controls: null,
      el: null,
      camearX: 0,
      camearY: 1500,
      camearZ: 0,
      initLen: 1500,
      houseWidth: 900, // 房间长度
      houseHeight: 600, // 房间宽
      angle: 45, // 房间朝向
      wall: [
        {
          position: { x: 0, y: 0, endX: 900, endY: 0 },
          door: { isDoor: false },
          windows: { isWindows: false }
        },
        {
          position: { x: 900, y: 0, endX: 900, endY: 600 },
          door: { isDoor: false },
          windows: { isWindows: false }
        },
        {
          position: { x: 0, y: 600, endX: 900, endY: 600 },
          door: { isDoor: false },
          windows: { isWindows: false }
        },
        {
          position: { x: 0, y: 0, endX: 0, endY: 600 },
          door: {
            isDoor: false,
            doorNum: 2,
            doorPoint: [{ x: 0, y: 200, endX: 0, endY: 400, doorDirection: 2 }]
          },
          windows: {
            isWindows: false,
            windowsPoint: [
              { x: 0, y: 0, endX: 0, endY: 150 },
              { x: 0, y: 450, endX: 0, endY: 600 }
            ]
          }
        }
      ]
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
    this.matArrayB = new THREE.MeshBasicMaterial({ color: 0xa8aaaf })
    // 添加坐标轴，辅助判断位置
    const axes = new THREE.AxesHelper(1000)
    this.scene.add(axes)

    // 创建纹理加载器
    this.textureLoader = new THREE.TextureLoader()

    // 创建地板
    this.createFloor()
    // 创建墙壁
    this.createWall()
    this.initCabient()
    this.DoorRenderingList = new THREE.MeshBasicMaterial({
      color: 0xecf1f3
    })
    const doorgeometry = new THREE.BoxGeometry(55, 190, 2)
    const door = new THREE.Mesh(doorgeometry, this.DoorRenderingList)
    door.position.set(30, 0, 0)
    door.rotation.y = 0.5 * Math.PI // -逆时针旋转,+顺时针
    door.nature = 'Cabinet__door'
    door.isClose = 1
    this.initCabientObject.add(door)
    this.createCabient()
    this.render()

    // 鼠标键盘控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // 点击了鼠标左键
    window.addEventListener('click', this.onClick, false)

    window.addEventListener('resize', this.onWindowResize, false)
  },
  destroyed() {
    window.removeEventListener('resize', this.onWindowResize, false)
    window.removeEventListener('click', this.onClick, false)
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
        45,
        this.windowWidth / this.windowHeight,
        1,
        10000
      )
      this.camera.position.set(0, this.camearY, 1600)
      const target = new THREE.Vector3()
      this.camera.lookAt(target)
      this.camera.fov = 50
    },
    /**
     * 创建渲染器,并设置渲染器的相关参数
     */
    createRenderer() {
      /**
       * WebGLRenderer
       * antialias 抗锯齿，平滑，默认false
       * alpha 画布是否包含透明缓冲区，默认false
       * gammaInput: Boolean 所有的纹理和颜色预乘伽马，默认false
       * gammaOutput: Boolean 需要以预乘的伽马输出，默认false
       * shadowMap: 属性有enabled(默认false)/autoUpdate(默认true)/needsUpdate(默认false)/type(默认 THREE.PCFShadowMap)
       * setPixelRatio(value) 设置设备像素比
       * setSize(width, height) 设置渲染器的范围
       * setClearColor(color,alpha) 设置渲染的环境的颜色
       */
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.windowWidth, this.windowHeight - 60)

      this.renderer.setClearColor(0xffffff, 0)

      this.renderer.gammaInput = true
      this.renderer.gammaOutput = true

      this.renderer.shadowMap.enabled = true
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
      // 设置环境光
      const ambientLight = new THREE.AmbientLight(0x606060)
      this.scene.add(ambientLight)
      // 设置平行光
      const directionalLight = new THREE.DirectionalLight(0xffffff)
      directionalLight.position.set(1, 0.75, 0.5).normalize()
      this.scene.add(directionalLight)
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
     * 点击事件
     */
    onClick(event) {
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      // var intersects = getIntersects(event)
      event.preventDefault()
      console.log('event.clientX:' + event.clientX)
      console.log('event.clientY:' + event.clientY)

      // 声明 raycaster 和 mouse 变量
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      mouse.x = (event.clientX / (window.innerWidth + 210)) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // 通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      raycaster.setFromCamera(mouse, this.camera)

      // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
      const intersects = raycaster.intersectObjects(this.scene.children)
      // 获取选中最近的 Mesh 对象
      if (
        intersects.length !== 0 &&
        intersects[0].object instanceof THREE.Mesh
      ) {
        const selectObject = intersects[0].object
        console.info('当前点击的物体', selectObject)
        // changeMaterial(selectObject)
        if (selectObject.name === '墙壁') {
          alert('点击了' + selectObject.name)
        }
      } else {
        // alert('未选中 Mesh!')
        // debugger
      }
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
          // 设置阵列模式   默认ClampToEdgeWrapping  RepeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping
          const repeatWidthNum = 5
          const repeatHeightNum = 7

          // uv两个方向纹理重复数量
          texture.repeat.set(repeatWidthNum, repeatHeightNum)
          // 创建地板
          const boxGeo = new THREE.BoxBufferGeometry(
            900, // X轴上面的宽度
            4, // Y轴上面的高度
            600 // Z轴上面的深度
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
    initLambert() {
      const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

      const material = new THREE.MeshBasicMaterial({ color: 0xa8aaaf })
      this.initLambertMod = new THREE.Mesh(cubeGeometry, material)
    },
    /**
     * 画长方体
     * @param { 长方体的长度 } width
     * @param { 长方体的高度 } height
     * @param { 长方体的厚度 } depth
     * @param { 长方体旋转的角度 } angle
     * @param { 长方体的材质 } material
     * @param { 长方体的X轴坐标 } x
     * @param { 长方体的Y轴坐标 } y
     * @param { 长方体的Z轴坐标 } z
     */
    createLambert(width, height, depth, angle, material, x, y, z) {
      var code = this.initLambertMod.clone()
      code.scale.set(width, height, depth)
      code.position.set(x, y, z)
      code.rotation.set(0, angle * Math.PI, 0) // -逆时针旋转,+顺时针
      return code
    },
    /**
     * 几何体裁切函数
     * @param { 被采裁切的集合体 } bsp
     * @param { 要裁掉的集合体 } lessBsp
     * @param { 区分是机房的墙还是机柜裁切的 } mat
     */
    returnResultBsp(bsp, lessBsp, mat) {
      let material = null
      switch (mat) {
        case 1:
          material = new THREE.MeshPhongMaterial({
            color: 0x9cb2d1,
            specular: 0x9cb2d1,
            shininess: 30,
            transparent: true,
            opacity: 1
          })
          break
        case 2:
          material = new THREE.MeshPhongMaterial({
            color: 0x42474c,
            specular: 0xafc0ca,
            shininess: 30,
            transparent: true,
            opacity: 1
          })
          break
        default:
      }

      var sphere1BSP = new ThreeBSP(bsp)
      var cube2BSP = new ThreeBSP(lessBsp) // 0x9cb2d1 淡紫,0xC3C3C3 白灰 , 0xafc0ca灰
      var resultBSP = sphere1BSP.subtract(cube2BSP)
      var result = resultBSP.toMesh(material)
      result.material.flatshading = THREE.FlatShading
      result.geometry.computeFaceNormals() // 重新计算几何体侧面法向量
      result.geometry.computeVertexNormals()
      result.material.needsUpdate = true // 更新纹理
      result.geometry.buffersNeedUpdate = true
      result.geometry.uvsNeedUpdate = true
      if (mat === 2) {
        result.nature = 'Cabinet'
      }
      return result
    },
    /**
     * 创建墙壁
     */
    createWall() {
      this.initLambert()
      this.wall.map((item) => {
        // {
        //   position: { x: 0, y: 0, endX: 900, endY: 0 },
        // },
        // {
        //   position: { x: 900, y: 0, endX: 900, endY: 600 },
        // },
        // {
        //   position: { x: 0, y: 600, endX: 900, endY: 600 },
        // },
        var position = item.position
        var w = position.endX - position.x
        var h = position.endY - position.y
        var x = position.x + w / 2 - this.houseWidth / 2
        var z = position.y + h / 2 - this.houseHeight / 2
        var width = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2))
        var angle = Math.asin(h / width) / Math.PI

        if (item.windows.isWindows || item.door.isDoor) {
          // 有窗户或有门或都有
          // 当然判断里面还是分开成有门或者有窗户，但互不干涉
          var windowList = [] // 盛放窗户的数组
          var doorList = [] // 盛放门的数组
          if (item.windows.isWindows) {
            item.windows.windowsPoint.map((windowsPoint, windowindex) => {
              const windowJson = {}
              const windowsW = windowsPoint.endX - windowsPoint.x
              const windowsH = windowsPoint.endY - windowsPoint.y
              windowJson.windowx =
                windowsPoint.x + windowsW / 2 - this.houseWidth / 2
              windowJson.windowz =
                windowsPoint.y + windowsH / 2 - this.houseHeight / 2
              windowJson.windowwidth = Math.sqrt(
                Math.pow(windowsW, 2) + Math.pow(windowsH, 2)
              )
              windowJson.wHeight = 120
              windowJson.windowy = 100
              windowList.push(windowJson)
            })
          }
          if (item.door.isDoor) {
            var doornum = item.door.doorNum || 1
            item.door.doorPoint.map((doorPoint, doorindex) => {
              var doorJson = {}
              var windowsW = doorPoint.endX - doorPoint.x
              var windowsH = doorPoint.endY - doorPoint.y
              if (doornum === 2) {
                const doubleDoorList = []
                for (var i = 0; i < 2; i++) {
                  doorJson = {}
                  doorJson.doorx =
                    doorPoint.x +
                    windowsW / 2 -
                    this.houseWidth / 2 +
                    ((doorPoint.endX - doorPoint.x) / 2) * i
                  doorJson.doorz =
                    doorPoint.y +
                    windowsH / 2 -
                    this.houseHeight / 2 +
                    ((doorPoint.endY - doorPoint.y) / 2) * i
                  doorJson.doorwidth =
                    Math.sqrt(Math.pow(windowsW, 2) + Math.pow(windowsH, 2)) / 2
                  doorJson.doorheight = 180
                  doorJson.doory = 100
                  doorJson.doorDirection = doorPoint.doorDirection
                  if (doorPoint.doorDirection < 2) {
                    doubleDoorList.unshift(doorJson)
                  } else {
                    doubleDoorList.push(doorJson)
                  }
                }
                doorList.push(doubleDoorList)
              } else {
                doorJson.doorx =
                  doorPoint.x + windowsW / 2 - this.houseWidth / 2
                doorJson.doorz =
                  doorPoint.y + windowsH / 2 - this.houseHeight / 2
                doorJson.doorwidth = Math.sqrt(
                  Math.pow(windowsW, 2) + Math.pow(windowsH, 2)
                )
                doorJson.doorheight = 180
                doorJson.doory = 100
                doorJson.doorDirection = doorPoint.doorDirection
                doorList.push(doorJson)
              }
            })
          }

          // this.cerateWallHadDoorOrGlass(
          //   width,
          //   200,
          //   10,
          //   angle,
          //   this.matArrayB,
          //   x,
          //   100,
          //   z,
          //   doorList,
          //   windowList
          // )
        } else {
          // 没门、没窗户
          const code = this.createLambert(
            width,
            200,
            10,
            angle,
            this.matArrayB,
            x,
            100,
            z
          )
          code.name = '墙壁'

          this.scene.add(code)
        }
      })
    },
    // 画有门和有窗子的墙（工具函数）
    cerateWallHadDoorOrGlass(
      width,
      height,
      depth,
      angle,
      material,
      x,
      y,
      z,
      doorlist,
      windowsList
    ) {
      // 茶色：0x58ACFA   透明玻璃色：0XECF1F3
      var glassMaterial = new THREE.MeshBasicMaterial({
        color: 0xecf1f3
      })
      glassMaterial.opacity = 0.5
      glassMaterial.transparent = true
      var wall = this.createLambert(
        width,
        height,
        depth,
        angle,
        material,
        x,
        y,
        z
      )
      windowsList.map((item, index) => {
        var windowCube = this.createLambert(
          item.windowwidth,
          item.wHeight,
          depth,
          angle,
          material,
          item.windowx,
          item.windowy,
          item.windowz
        )
        wall = this.returnResultBsp(wall, windowCube, 1)
        const code = this.createLambert(
          item.windowwidth,
          item.wHeight,
          2,
          angle,
          glassMaterial,
          item.windowx,
          item.windowy,
          item.windowz
        )
        this.scene.add(code)
      })
      var statusresult = [0.5, 0.5, 0, 0]
      doorlist.map((item, index) => {
        if (item.length === 2) {
          item.map((cItem, cIndex) => {
            const doorCube = this.createLambert(
              cItem.doorwidth,
              cItem.doorheight,
              10,
              angle,
              this.matArrayB,
              cItem.doorx,
              cItem.doory,
              cItem.doorz
            )
            wall = this.returnResultBsp(wall, doorCube, 1)
            const doorgeometry = new THREE.BoxGeometry(100, 180, 2)
            let door = ''
            if (cIndex === 0) {
              door = new THREE.Mesh(doorgeometry, this.LeftDoorRenderingList)
            } else {
              door = new THREE.Mesh(doorgeometry, this.DoorRenderingList)
            }
            door.position.set(cItem.doorx, cItem.doory, cItem.doorz)
            door.rotation.y = statusresult[cItem.doorDirection] * Math.PI
            door.nature = 'door'
            door.direction = cItem.doorDirection
            door.isClose = 1
            door.doorIndex = cIndex
            this.scene.add(door)
          })
        } else {
          const doorCube = this.createLambert(
            item.doorwidth,
            item.doorheight,
            10,
            angle,
            this.matArrayB,
            item.doorx,
            item.doory,
            item.doorz
          )
          wall = this.returnResultBsp(wall, doorCube, 1)
          const doorgeometry = new THREE.BoxGeometry(100, 180, 2)
          const door = new THREE.Mesh(doorgeometry, this.DoorRenderingList)
          door.position.set(item.doorx, item.doory, item.doorz)
          door.rotation.y = statusresult[item.doorDirection] * Math.PI
          door.nature = 'door'
          door.direction = item.doorDirection
          door.isClose = 1
          this.scene.add(door)
        }
      })
      this.scene.add(wall)
    },
    initCabient() {
      // 用打组有个好处是我们不用管group中的Mesh的位置，我们只需要操控Group的位置
      this.initCabientObject = new THREE.Group()
      var cabinetMaterial = new THREE.MeshPhongMaterial({
        color: 0x42474c
      })
      // 注意此处不能用之前初始化同来克隆的几何体，因为用来克隆的集合体的长宽高都为1，我们看到的都是放大的，而本体尺寸其实并没有改变，所以用几何体做减法的时候会被减没了
      var Cabinet = this.createLambert(60, 200, 60, 0, cabinetMaterial, 0, 0, 0)
      var cabinetInside = this.createLambert(
        54,
        196,
        56,
        0,
        cabinetMaterial,
        3,
        0,
        0
      )
      this.initCabientObject.add(
        this.returnResultBsp(Cabinet, cabinetInside, 2, 0)
      ) // 这一步一个掏空的盒子已经出现了

      // // 以下三行代码仅做演示用
      // this.initCabientObject.position.set(0, 100, 0)
      // this.initCabientObject.rotation.y = 1 * Math.PI
      // this.scene.add(this.initCabientObject)
    },
    /**
     * 往机房里面添加机柜的方法
     */
    createCabient() {
      const result = [
        { x: 130, z: 120, codeID: 'XZ100001', angle: 0 },
        { x: 230, z: 120, codeID: 'XZ100002', angle: 0.5 },
        { x: 330, z: 120, codeID: 'XZ100003', angle: 1 },
        { x: 430, z: 120, codeID: 'XZ100004', angle: 1.5 }
      ]
      result.map((item) => {
        const cabientMod = this.initCabientObject.clone()
        cabientMod.position.set(
          item.x - this.houseWidth / 2,
          100,
          item.z - this.houseHeight / 2
        )
        cabientMod.rotation.y = item.angle * Math.PI
        // 此处给每个机柜设置name为 cabient 标识加 _ 再加机柜ID，后面会用到
        cabientMod.name = 'cabient_' + item.codeID
        this.scene.add(cabientMod)
      })
    }
  }
}
</script>
<style lang="scss" scoped></style>
