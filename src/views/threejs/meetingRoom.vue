<template>
  <div id="threeWorld"> </div>
</template>

<script>
import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
export default {
  name: 'MeetingRoom',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      trackballControls: null,
      clock: null,
      textureLoader: null,
      loadedFont: null,
      // 盆栽
      PottedPlant: null,
      PottedPlant1: null,
      threeDom: null
    }
  },
  mounted() {
    this.threeDom = document.getElementById('threeWorld')
    this.init()
    this.addGeoBox()
    // 墙以及门
    this.createWall()
    // 窗户
    this.createWindowRight()
    this.createWindowLeft()
    // 会议桌
    this.createConferenceTable()
    this.rendererScene()
    // 椅子
    this.createChair()
    // 盆栽
    this.createPottedPlant()
    // 壁画
    this.createLargeScreen()
    // 三维文字
    this.createText()
    // 鼠标事件
    document.addEventListener('mousedown', this.onDocumentMouseDown, false)
    window.addEventListener('resize', this.onWindowResize, false)
  },
  destroyed() {
    document.removeEventListener('mousedown', this.onDocumentMouseDown, false)
    window.removeEventListener('resize', this.onWindowResize, false)
  },
  methods: {
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(this.threeDom.clientWidth, window.innerHeight)

      // 兼容高清屏幕
      this.renderer.setPixelRatio(window.devicePixelRatio)

      this.rendererScene()
    },
    /**
     * @description: 描述主要功能
     * @returns 描述函数的返回值
     * @date: 2020/6/13  9:50
     * @author: zyy
     **/
    init() {
      // 创建三大件
      // 1.1 场景
      this.scene = new THREE.Scene()
      // 1.2 相机
      this.camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      // 1.3 渲染器
      this.renderer = new THREE.WebGLRenderer({ antialias: true })

      // 创建纹理加载器
      this.textureLoader = new THREE.TextureLoader()

      // 设置相机
      // 设置摄像机位置,相机方向逆X轴方向，倾斜向下看
      this.camera.position.set(360, 360, 0)
      // 指向场景中心
      this.camera.lookAt(this.scene.position)
      this.scene.add(this.camera)

      // 添加坐标轴，辅助判断位置
      const axes = new THREE.AxesHelper(1000)
      this.scene.add(axes)

      // 设置环境
      // this.renderer.setClearColor(new THREE.Color(0xf7f2f1))
      this.renderer.setClearColor('#b9d3ff', 1) // 设置背景颜色

      // 设置场景大小
      this.renderer.setSize(this.threeDom.clientWidth, window.innerHeight)

      // 兼容高清屏幕
      this.renderer.setPixelRatio(window.devicePixelRatio)

      // 渲染器开启阴影效果
      this.renderer.shadowMap.enabled = true
      // // 消除canvas的外边框
      // this.renderer.domElement.style.outline = 'none'
      // 渲染div到canvas
      this.threeDom.appendChild(this.renderer.domElement)

      // 鼠标键盘控制
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      // 点光源
      const point = new THREE.PointLight(0xffffff)
      point.position.set(500, 300, 400) // 点光源位置
      this.scene.add(point) // 点光源添加到场景中
      //  环境光
      const ambient = new THREE.AmbientLight(0x999999)
      this.scene.add(ambient)
    },

    rendererScene() {
      TWEEN.update()
      this.renderer.render(this.scene, this.camera)
      // 实时渲染
      requestAnimationFrame(this.rendererScene)
    },

    /**
     * @description: 描述主要功能: 创建自定义的几何体，并贴上纹理，使用贴图材质
     * @returns 描述函数的返回值
     * @date: 2020/6/11  15:24
     * @author: zyy
     **/
    customGeometry() {
      // 下底面的点和上底面的点
      const pointArr = []

      // 底面点
      for (let i = 0; i < 8; i++) {
        const x = 60 * Math.sin((Math.PI * i) / 4)
        const z = 60 * Math.cos((Math.PI * i) / 4)
        const temp = {}
        temp.x = x
        temp.y = 0
        temp.z = z
        pointArr.push(temp)
      }

      // 上面点
      for (let i = 0; i < 8; i++) {
        const x = 58 * Math.sin((Math.PI * i) / 4)
        const z = 58 * Math.cos((Math.PI * i) / 4)
        const temp = {}
        temp.x = x
        temp.y = 1
        temp.z = z
        pointArr.push(temp)
      }

      // 创建顶点
      const vertices = []
      for (let i = 0; i < pointArr.length; i++) {
        const temp = new THREE.Vector3(
          pointArr[i].x,
          pointArr[i].y,
          pointArr[i].z
        )
        vertices.push(temp)
      }

      // 定义面
      const faces = []

      // 侧面 根据序号添加
      const pointArrLen2 = pointArr.length / 2
      const pointArrLen = pointArr.length
      for (let j = 0; j < pointArrLen2; j++) {
        if (j !== pointArrLen2 - 1) {
          const tempFace1 = new THREE.Face3(j, j + pointArrLen2, j + 1)
          const tempFace2 = new THREE.Face3(
            j + 1,
            j + pointArrLen2,
            j + pointArrLen2 + 1
          )
          faces.push(tempFace1)
          faces.push(tempFace2)
        } else {
          const tempFace1 = new THREE.Face3(j, j + pointArrLen2, j + 1)
          const tempFace2 = new THREE.Face3(j + 1, 0, j)
          faces.push(tempFace1)
          faces.push(tempFace2)
        }
      }

      // 底面
      for (let m = 0; m < pointArrLen2; m++) {
        if (m + 2 < pointArrLen2) {
          const tempFace1 = new THREE.Face3(0, m + 1, m + 2)
          faces.push(tempFace1)
        }
      }

      // 上面
      for (let n = pointArrLen2; n < pointArrLen; n++) {
        if (n + 2 < pointArrLen) {
          const tempFace1 = new THREE.Face3(pointArrLen2 - 1, n + 1, n + 2)
          faces.push(tempFace1)
        }
      }

      const geom = new THREE.Geometry()
      geom.vertices = vertices
      geom.faces = faces
      geom.computeFaceNormals()

      const mats = []
      let material = null
      const floorTexture = this.textureLoader.load(
        '/source/textures/floor/floor.jpg'
      )
      const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })
      for (let i = 0; i < geom.faces.length; i++) {
        // 定义侧面的材质
        if (i < 4) {
          material = new THREE.MeshBasicMaterial({
            color: 0x9c9c9c,
            side: THREE.DoubleSide
          })
          mats.push(material)
        } else if (i >= 4 && i < 6) {
          material = new THREE.MeshBasicMaterial({
            color: 0x6b6b6b,
            side: THREE.DoubleSide
          })
          mats.push(material)
        } else if (i >= 6 && i < pointArrLen) {
          material = new THREE.MeshBasicMaterial({
            color: 0xd0d0d0,
            side: THREE.DoubleSide
          })
          mats.push(material)
        } else {
          mats.push(floorMaterial)
        }
        geom.faces[i].materialIndex = i
      }
      const cube = new THREE.Mesh(geom, mats)
      cube.position.set(0, 0, 0)
      this.scene.add(cube)
    },

    /**
     * @description: 描述主要功能: 创建一个box，并对不同的面使用不同的材质。
     * 生成地板
     * @returns 描述函数的返回值
     * @date: 2020/6/13  10:56
     * @author: zyy
     **/
    addGeoBox() {
      // 创建材质并贴上纹理
      const floorTexture = this.textureLoader.load(
        '/source/textures/floor/floor.jpg'
      )
      const boxTextureMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })
      // 创建地板
      for (let i = 0; i < 12; i++) {
        for (let j = 0; j < 16; j++) {
          const boxGeo = new THREE.BoxBufferGeometry(29.9, 2, 29.9)
          const boxMesh = new THREE.Mesh(boxGeo, boxTextureMaterial)
          boxMesh.position.set(-150 + i * 30, 0, -240 + j * 30)
          this.scene.add(boxMesh)
        }
      }
    },

    /**
     * @description: 描述主要功能 创建墙体
     * 使用BSP二元操作，扣除box内部
     * @returns 描述函数的返回值
     * @date: 2020/6/13  11:46
     * @author: zyy
     **/
    createWall() {
      // 外墙
      const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff })
      const wallGeo = new THREE.BoxGeometry(280, 120, 400)
      const wallMesh = new THREE.Mesh(wallGeo, wallMaterial)
      wallMesh.position.set(0, 60, -14.95)
      // 内墙
      const wallInnerMaterial = new THREE.MeshLambertMaterial({
        color: 0x2d1bff
      })
      const wallInnerGeo = new THREE.BoxGeometry(270, 120, 390)
      const wallInnerMesh = new THREE.Mesh(wallInnerGeo, wallInnerMaterial)
      wallInnerMesh.position.set(0, 60, -14.95)
      // 门
      const doorInnerMaterial = new THREE.MeshLambertMaterial({
        color: 0x2d1bff
      })
      const doorGeo = new THREE.BoxGeometry(18, 100, 70)
      const doorMesh = new THREE.Mesh(doorGeo, doorInnerMaterial)
      doorMesh.position.set(140.5, 50, 0)
      //  this.scene.add(doorMesh);

      // 转BSP
      const wallBSP = new ThreeBSP(wallMesh)
      const wallInnerBSP = new ThreeBSP(wallInnerMesh)
      const doorBSP = new ThreeBSP(doorMesh)
      const window1BSP = new ThreeBSP(this.createWindowRight())
      const window2BSP = new ThreeBSP(this.createWindowLeft())
      let wallResultBSP = wallBSP.subtract(wallInnerBSP)
      wallResultBSP = wallResultBSP.subtract(doorBSP)
      wallResultBSP = wallResultBSP.subtract(window1BSP)
      wallResultBSP = wallResultBSP.subtract(window2BSP)
      const wallResultMesh = wallResultBSP.toMesh()

      // 转换后的Mesh配置属性
      const wallTexture = this.textureLoader.load(
        '/source/textures/wall/wall.jpg'
      )
      const wallTextureMaterial = new THREE.MeshStandardMaterial({
        map: wallTexture,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })
      const wallInnerTexture = this.textureLoader.load(
        '/source/textures/wall/wallinner.jpg'
      )
      const wallInnerTextureMaterial = new THREE.MeshStandardMaterial({
        map: wallInnerTexture,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })

      const wallResultMeshMaterial = []
      wallResultMeshMaterial.push(wallTextureMaterial)
      wallResultMeshMaterial.push(wallInnerTextureMaterial)
      wallResultMesh.material = wallResultMeshMaterial

      console.log(wallResultMesh.geometry.faces, 112233)
      wallResultMesh.geometry.faces.forEach((item, i) => {
        if (i < 160) {
          item.materialIndex = 0
        } else {
          item.materialIndex = 1
        }
      })

      wallResultMesh.geometry.computeFaceNormals()
      wallResultMesh.geometry.computeVertexNormals()
      // 添加结果到场景中
      this.scene.add(wallResultMesh)
    },

    /**
     * @description: 描述主要功能 生成右侧窗户
     * @returns 描述函数的返回值
     * @date: 2020/6/13  15:03
     * @author: zyy
     **/
    createWindowRight() {
      const shpMaterial1 = new THREE.MeshBasicMaterial({ color: '#F7C777' })
      const shpGeometry1 = new THREE.BoxGeometry(70, 90, 10)
      const shpMesh1 = new THREE.Mesh(shpGeometry1, shpMaterial1)
      shpMesh1.position.set(-40, 65, -213)

      const wMaterial1 = new THREE.MeshBasicMaterial({ color: 0x2d1bff })
      const wGeometry1 = new THREE.BoxGeometry(70, 3, 10)
      const wMesh1 = new THREE.Mesh(wGeometry1, wMaterial1)
      wMesh1.position.set(-40, 85, -213)

      const wMaterial2 = new THREE.MeshBasicMaterial({ color: 0x2b2b2b })
      const wGeometry2 = new THREE.BoxGeometry(3, 90, 10)
      const wMesh2 = new THREE.Mesh(wGeometry2, wMaterial2)
      wMesh2.position.set(-40, 65, -213)

      const shpMesh1BSP = new ThreeBSP(shpMesh1)
      const wMesh1BSP = new ThreeBSP(wMesh1)
      const wMesh2BSP = new ThreeBSP(wMesh2)
      let shpMesh1BSPResult = shpMesh1BSP.subtract(wMesh1BSP)
      shpMesh1BSPResult = shpMesh1BSPResult.subtract(wMesh2BSP)
      const shpMesh1MeshResult = shpMesh1BSPResult.toMesh()
      return shpMesh1MeshResult
    },

    /**
     * @description: 描述主要功能 生成左侧窗户
     * @returns 描述函数的返回值
     * @date: 2020/6/13  16:00
     * @author: zyy
     **/
    createWindowLeft() {
      const shpMaterial1 = new THREE.MeshBasicMaterial({ color: '#F7C777' })
      const shpGeometry1 = new THREE.BoxGeometry(70, 90, 10)
      const shpMesh1 = new THREE.Mesh(shpGeometry1, shpMaterial1)
      shpMesh1.position.set(40, 65, -213)
      //  this.scene.add(shpMesh1);

      const wMaterial1 = new THREE.MeshBasicMaterial({ color: 0x2d1bff })
      const wGeometry1 = new THREE.BoxGeometry(70, 3, 10)
      const wMesh1 = new THREE.Mesh(wGeometry1, wMaterial1)
      wMesh1.position.set(40, 85, -213)
      //  this.scene.add(wMesh1);

      const wMaterial2 = new THREE.MeshBasicMaterial({ color: 0x2b2b2b })
      const wGeometry2 = new THREE.BoxGeometry(3, 90, 10)
      const wMesh2 = new THREE.Mesh(wGeometry2, wMaterial2)
      wMesh2.position.set(40, 65, -213)
      //  this.scene.add(wMesh2);

      const shpMesh1BSP = new ThreeBSP(shpMesh1)
      const wMesh1BSP = new ThreeBSP(wMesh1)
      const wMesh2BSP = new ThreeBSP(wMesh2)
      let shpMesh1BSPResult = shpMesh1BSP.subtract(wMesh1BSP)
      shpMesh1BSPResult = shpMesh1BSPResult.subtract(wMesh2BSP)
      const shpMesh1MeshResult = shpMesh1BSPResult.toMesh()
      //  this.scene.add(shpMesh1MeshResult);
      return shpMesh1MeshResult
    },

    /**
     * @description: 描述主要功能 添加会议桌
     * @returns 描述函数的返回值
     * @date: 2020/6/13  16:11
     * @author: zyy
     **/
    createConferenceTable() {
      const desktopTexture = this.textureLoader.load(
        '/source/textures/desktop/desktop.jpg'
      )
      const desktopTextureMaterial = new THREE.MeshStandardMaterial({
        map: desktopTexture,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })
      const desktopGeo = new THREE.BoxGeometry(100, 50, 280)
      const desktopMesh = new THREE.Mesh(desktopGeo, desktopTextureMaterial)
      desktopMesh.position.set(0, 25, -14.95)

      const d1Material = new THREE.MeshBasicMaterial({ color: 0xc49235 })
      const d1Geo = new THREE.BoxGeometry(100, 44, 274)
      const d1Mesh = new THREE.Mesh(d1Geo, d1Material)
      d1Mesh.position.set(0, 22, -14.95)

      const d2Material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
      const d2Geo = new THREE.BoxGeometry(94, 44, 320)
      const d2Mesh = new THREE.Mesh(d2Geo, d2Material)
      d2Mesh.position.set(0, 22, -14.95)

      const desktopMeshBSP = new ThreeBSP(desktopMesh)
      const d1BSP = new ThreeBSP(d1Mesh)
      const d2BSP = new ThreeBSP(d2Mesh)
      let desktopBSPResult = desktopMeshBSP.subtract(d1BSP)
      desktopBSPResult = desktopBSPResult.subtract(d2BSP)
      const desktopMeshResult = desktopBSPResult.toMesh()
      desktopMeshResult.material = desktopTextureMaterial
      this.scene.add(desktopMeshResult)

      // 会议桌上的花瓶
      const points = []
      const height = 3
      const count = 30
      for (let i = 0; i < count; i++) {
        const pointV3 = new THREE.Vector3(
          (Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 6,
          i - count + count / 2,
          0
        )
        points.push(pointV3)
      }
      const latheGeometry = new THREE.LatheGeometry(points, 20, 0, 2 * Math.PI)

      const latheTexture = this.textureLoader.load(
        '/source/textures/flowervase/flowervase.jpg'
      )
      const latheMaterial = new THREE.MeshStandardMaterial({
        map: latheTexture,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })

      // 花
      var leafTexture = this.textureLoader.load(
        '/source/textures/flowervase/flower.jpg'
      )
      var leafMaterial = new THREE.MeshBasicMaterial({
        map: leafTexture,
        side: THREE.DoubleSide,
        transparent: true
      })
      const geom = new THREE.PlaneGeometry(4, 8)

      // 第一个花瓶
      for (let i = 0; i < 40; i++) {
        const leaf = new THREE.Mesh(geom, leafMaterial)
        leaf.position.x = Math.random() * 2
        leaf.position.y = 70 + (Math.random() * i) / 2
        leaf.position.z = Math.random() * 3 - 2
        leaf.rotation.x = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.y = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.z = -Math.PI / (i + 1) + Math.random()
        this.scene.add(leaf)
      }
      const latheMesh1 = new THREE.Mesh(latheGeometry, latheMaterial)
      latheMesh1.position.set(0, 60, 0)
      this.scene.add(latheMesh1)

      // 第二个花瓶
      for (let i = 0; i < 40; i++) {
        const leaf = new THREE.Mesh(geom, leafMaterial)
        leaf.position.x = Math.random() * 2
        leaf.position.y = 70 + (Math.random() * i) / 2
        leaf.position.z = Math.random() * 3 - 2 - 100
        leaf.rotation.x = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.y = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.z = -Math.PI / (i + 1) + Math.random()
        this.scene.add(leaf)
      }
      const latheMesh = new THREE.Mesh(latheGeometry, latheMaterial)
      latheMesh.position.set(0, 60, -100)
      this.scene.add(latheMesh)

      // 第三个花瓶
      for (let i = 0; i < 40; i++) {
        const leaf = new THREE.Mesh(geom, leafMaterial)
        leaf.position.x = Math.random() * 2
        leaf.position.y = 70 + (Math.random() * i) / 2
        leaf.position.z = Math.random() * 3 - 2 + 85.05
        leaf.rotation.x = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.y = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.z = -Math.PI / (i + 1) + Math.random()
        this.scene.add(leaf)
      }
      const latheMesh3 = new THREE.Mesh(latheGeometry, latheMaterial)
      latheMesh3.position.set(0, 60, 85.05)
      this.scene.add(latheMesh3)
    },

    /**
     * @description: 描述主要功能 椅子
     * @returns 描述函数的返回值
     * @date: 2020/6/13  17:37
     * @author: zyy
     **/
    createChair() {
      const groupBox = new THREE.Group()
      const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x559762 })
      const boxTextures1 = this.textureLoader.load(
        '/source/textures/chair/chair.jpg'
      )
      const boxMaterial1 = new THREE.MeshStandardMaterial({
        map: boxTextures1,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })
      for (let i = 0; i < 6; i++) {
        // 前面椅子
        const boxGeo1 = new THREE.BoxGeometry(30, 40, 30)
        const boxGeo2 = new THREE.BoxGeometry(24, 28, 32)
        const boxGeo3 = new THREE.BoxGeometry(32, 28, 20)
        const boxMesh1 = new THREE.Mesh(boxGeo1, boxMaterial1)
        const boxMesh2 = new THREE.Mesh(boxGeo2, boxMaterial)
        const boxMesh3 = new THREE.Mesh(boxGeo3, boxMaterial)
        boxMesh1.position.set(0, 20, -i * 45 + 10)
        boxMesh2.position.set(0, 14, -i * 45 + 10)
        boxMesh3.position.set(0, 14, -i * 45 + 10)
        const boxMeshBSP1 = new ThreeBSP(boxMesh1)
        const boxMeshBSP2 = new ThreeBSP(boxMesh2)
        const boxMeshBSP3 = new ThreeBSP(boxMesh3)
        let boxMeshBSPResult = boxMeshBSP1.subtract(boxMeshBSP2)
        boxMeshBSPResult = boxMeshBSPResult.subtract(boxMeshBSP3)
        const boxMeshResult = boxMeshBSPResult.toMesh()
        boxMeshResult.material = boxMaterial1
        groupBox.add(boxMeshResult)
        // 靠背
        const boxBackRestGeo = new THREE.BoxGeometry(3, 30, 30)
        const boxBackRestMesh = new THREE.Mesh(boxBackRestGeo, boxMaterial1)
        boxBackRestMesh.position.set(13, 55, -i * 45 + 10)
        groupBox.add(boxBackRestMesh)

        // 后面椅子
        const boxGeob1 = new THREE.BoxGeometry(30, 40, 30)
        const boxGeob2 = new THREE.BoxGeometry(24, 28, 32)
        const boxGeob3 = new THREE.BoxGeometry(32, 28, 20)
        const boxMeshb1 = new THREE.Mesh(boxGeob1, boxMaterial1)
        const boxMeshb2 = new THREE.Mesh(boxGeob2, boxMaterial)
        const boxMeshb3 = new THREE.Mesh(boxGeob3, boxMaterial)
        boxMeshb1.position.set(-160, 20, -i * 45 + 10)
        boxMeshb2.position.set(-160, 14, -i * 45 + 10)
        boxMeshb3.position.set(-160, 14, -i * 45 + 10)
        const boxMeshBSPb1 = new ThreeBSP(boxMeshb1)
        const boxMeshBSPb2 = new ThreeBSP(boxMeshb2)
        const boxMeshBSPb3 = new ThreeBSP(boxMeshb3)
        let boxMeshBSPResultb = boxMeshBSPb1.subtract(boxMeshBSPb2)
        boxMeshBSPResultb = boxMeshBSPResultb.subtract(boxMeshBSPb3)
        const boxMeshResultb = boxMeshBSPResultb.toMesh()
        boxMeshResultb.material = boxMaterial1
        groupBox.add(boxMeshResultb)
        // 靠背
        const boxBackRestGeob = new THREE.BoxGeometry(3, 30, 30)
        const boxBackRestMeshb = new THREE.Mesh(boxBackRestGeob, boxMaterial1)
        boxBackRestMeshb.position.set(-173.3, 55, -i * 45 + 10)
        groupBox.add(boxBackRestMeshb)
      }
      groupBox.position.set(80, 5, 100)
      this.scene.add(groupBox)
    },

    /**
     * @description: 描述主要功能 盆栽
     * @returns 描述函数的返回值
     * @date: 2020/6/13  20:44
     * @author: zyy
     **/
    createPottedPlant() {
      const group = new THREE.Group()
      // const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0x559762 })
      const cylinderTextures1 = this.textureLoader.load(
        '/source/textures/cylinder/cylinder.jpg'
      )
      const cylinderMaterial1 = new THREE.MeshStandardMaterial({
        map: cylinderTextures1,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })

      var leafTexture = this.textureLoader.load(
        '/source/textures/leaf/leaf.jpg'
      )
      var leafMaterial = new THREE.MeshBasicMaterial({
        map: leafTexture,
        side: THREE.DoubleSide,
        transparent: true
      })
      const geom = new THREE.PlaneGeometry(4, 8)

      const cylinderGeo = new THREE.CylinderGeometry(12, 15, 40, 20, 10, false)
      this.cylinderMesh = new THREE.Mesh(cylinderGeo, cylinderMaterial1)
      this.cylinderMesh.name = '盆栽'
      this.cylinderMesh.position.set(100, 20, -180)
      group.add(this.cylinderMesh)
      for (let i = 0; i < 40; i++) {
        const leaf = new THREE.Mesh(geom, leafMaterial)
        leaf.position.x = 95 + Math.random() * 15
        leaf.position.y = 40 + (Math.random() * i) / 1.2
        leaf.position.z = -185 + Math.random() * 10
        leaf.rotation.x = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.y = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.z = -Math.PI / (i + 1) + Math.random()
        group.add(leaf)
      }

      const cylinderGeo1 = new THREE.CylinderGeometry(12, 15, 40, 20, 10, false)
      this.cylinderMesh1 = new THREE.Mesh(cylinderGeo1, cylinderMaterial1)
      this.cylinderMesh1.name = '盆栽1'
      this.cylinderMesh1.position.set(-100, 20, -180)
      group.add(this.cylinderMesh1)
      for (let i = 0; i < 60; i++) {
        const leaf = new THREE.Mesh(geom, leafMaterial)
        leaf.position.x = -105 + Math.random() * 15
        leaf.position.y = 40 + (Math.random() * i) / 1.2
        leaf.position.z = -185 + Math.random() * 10
        leaf.rotation.x = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.y = -Math.PI / (i + 1) + Math.random()
        leaf.rotation.z = -Math.PI / (i + 1) + Math.random()
        group.add(leaf)
      }
      group.position.set(0, 0, 0)
      this.scene.add(group)
      console.log(Math.random(), 999999)
    },

    /**
     * @description: 描述主要功能 大屏展示
     * @returns 描述函数的返回值
     * @date: 2020/6/13  21:28
     * @author: zyy
     **/
    createLargeScreen() {
      const createLargeTextures1 = this.textureLoader.load(
        '/source/textures/largeScreen/largeScreen.jpg'
      )
      const createLargeMaterial1 = new THREE.MeshStandardMaterial({
        map: createLargeTextures1,
        metalness: 0.2,
        roughness: 0.07,
        side: THREE.DoubleSide
      })
      // const boxGeo1 = new THREE.BoxGeometry(140, 80, 0.1)
      const boxGeo2 = new THREE.PlaneGeometry(140, 80)
      // const boxMesh1 = new THREE.Mesh(boxGeo1, createLargeMaterial1)
      const boxMesh2 = new THREE.Mesh(boxGeo2, createLargeMaterial1)
      boxMesh2.position.set(0, 70, 180)
      this.scene.add(boxMesh2)
    },

    /**
     * @description: 描述主要功能 加载字体
     * @returns 描述函数的返回值
     * @date: 2020/6/13  21:38
     * @author: zyy
     **/
    createText() {
      this.fontload = new THREE.FontLoader()
      const fontUrl = '/source/fonts/helvetiker_regular.typeface.json'
      this.fontload.load(fontUrl, (font) => {
        const textGeom = new THREE.TextBufferGeometry('This is Meeting Room', {
          font: font,
          size: 18,
          height: 10
        })
        const textMaterial = new THREE.MeshBasicMaterial({ color: 'red' })
        const textMesh = new THREE.Mesh(textGeom, textMaterial)
        textMesh.position.set(-140, 80, 100)
        textMesh.rotation.y = 0.5 * Math.PI
        textMesh.name = 'textMesh-' + this.scene.children.length

        this.scene.add(textMesh)
      })
    },

    /**
     * @description: 描述主要功能 鼠标事件，包含补间动画
     * @returns 描述函数的返回值
     * @date: 2020/6/14  17:21
     * @author: zyy
     **/
    onDocumentMouseDown(event) {
      let vector = new THREE.Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      )
      vector = vector.unproject(this.camera)
      const raycaster = new THREE.Raycaster(
        this.camera.position,
        vector.sub(this.camera.position).normalize()
      )
      const intersects = raycaster.intersectObjects([
        this.cylinderMesh1,
        this.cylinderMesh
      ])
      if (intersects.length > 0) {
        if (intersects[0].object.rotation.z === -0.5 * Math.PI) {
          //  intersects[0].object.rotation.z = 0;
          const a = -0.5 * Math.PI
          const b = 0
          const posSrc = { pos: a }
          console.log(posSrc, 2314)
          const tween = new TWEEN.Tween(posSrc).to({ pos: b }, 1000)
          tween.easing(TWEEN.Easing.Elastic.InOut).onUpdate(() => {
            intersects[0].object.rotation.z = posSrc.pos
          })
          tween.start()
        } else {
          //  intersects[0].object.rotation.z = -0.5 * Math.PI;
          const a = -0.5 * Math.PI
          const b = 0
          const posSrc = { pos: b }
          console.log(posSrc, 2314)
          const tween = new TWEEN.Tween(posSrc).to({ pos: a }, 1000)
          tween.easing(TWEEN.Easing.Elastic.InOut).onUpdate(() => {
            intersects[0].object.rotation.z = posSrc.pos
          })
          tween.start()
        }
      }
    }
  }
}
</script>

<style scoped>
#threeWorld {
  height: 100%;
  width: 100%;
}
</style>
