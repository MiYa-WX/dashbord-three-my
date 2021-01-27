<template>
  <div class="container">
    <div id="tooltip"> </div>
    <div id="computerRoom"> </div>
  </div>
</template>
<script>
import * as THREE from 'three'
// const ThreeBSP = require('three-js-csg')(THREE)
import { WEBGL } from 'three/examples/jsm/WebGL.js'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
export default {
  name: 'MeetingRoom',
  data() {
    return {
      roomDom: null, // canvas容器
      areaWidth: 0, // 窗口宽度
      areaHeight: 0, // 窗口高度
      scene: null, // 场景对象
      camera: null, // 相机对象
      renderer: null, // 渲染器对象
      textureLoader: null,
      controls: null, // 控制器
      stats: null,

      // 定义机柜、服务器数据
      model: [
        {
          cabinet: {
            uuid: '1',
            id: 1,
            name: '1号机柜',
            size: { w: 40, h: 100, d: 40 }, // 尺寸
            position: { x: 50, y: 0, z: 0 }, // 位置
            servers: [
              {
                uuid: '11',
                id: 11,
                name: '1号服务器',
                ip: '',
                apps: '',
                skinImgurl: ''
              },
              {
                uuid: '12',
                id: 12,
                name: '2号服务器',
                ip: '',
                apps: '',
                skinImgurl: ''
              },
              {
                uuid: '13',
                id: 13,
                name: '3号服务器',
                ip: '',
                apps: '',
                skinImgurl: ''
              }
            ]
          }
        },
        {
          cabinet: {
            uuid: '2',
            id: 2,
            name: '2号机柜',
            size: { w: 40, h: 100, d: 40 }, // 尺寸
            position: { x: 100, y: 0, z: 0 }, // 位置
            servers: [
              {
                uuid: '24',
                id: 24,
                name: '4号服务器',
                ip: '',
                apps: '',
                skinImgurl: ''
              },
              {
                uuid: '25',
                id: 25,
                name: '5号服务器',
                ip: '',
                apps: '',
                skinImgurl: ''
              },
              {
                uuid: '26',
                id: 26,
                name: '6号服务器',
                ip: '',
                apps: '',
                skinImgurl: ''
              },
              {
                uuid: '27',
                id: 27,
                name: '7号服务器',
                ip: '',
                apps: '',
                skinImgurl: '/source/textures/computer/3.jpg'
              }
            ]
          }
        },
        {
          cabinet: {
            uuid: '3',
            id: 3,
            name: '3号机柜',
            size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
            position: { x: -50, y: 0, z: 0 }, // 位置
            servers: [
              {
                uuid: '31',
                id: 31,
                name: '8号服务器',
                ip: '',
                apps: '',
                skinImgurl: '/source/textures/computer/3.jpg'
              }
            ]
          }
        },
        {
          cabinet: {
            uuid: '4',
            id: 4,
            name: '4号机柜',
            size: { w: 40, h: 100, d: 40 }, // 尺寸
            position: { x: -100, y: 0, z: 0 }, // 位置
            servers: [
              {
                uuid: '41',
                id: 41,
                name: '9号服务器',
                ip: '',
                apps: '',
                skinImgurl: '/source/textures/computer/3.jpg'
              }
            ]
          }
        }
      ]
    }
  },
  mounted() {
    this.roomDom = document.getElementById('computerRoom')
    this.areaWidth = window.innerWidth - 210
    this.areaHeight = window.innerHeight - 60

    this.stats = this.initStats()
    this.createScene()
    this.createCamera()
    this.createRenderer()
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
    // // 绘制墙壁
    // this.createCabinet()

    for (let i = 0; i < this.model.length; i++) {
      const c = this.model[i].cabinet
      this.createCabinet(
        c.size.w,
        c.size.h,
        c.size.d,
        c.position.x,
        c.position.y,
        c.position.z,
        c
      )
    }
    this.render()

    // 鼠标键盘控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // 视角最小距离
    this.controls.minDistance = 10
    // 视角最远距离
    this.controls.maxDistance = 1600
    // 最大角度
    this.controls.maxPolarAngle = Math.PI / 1.6

    window.addEventListener('click', this.onClick, false)
    window.addEventListener('resize', this.onWindowResize, false)
  },
  destroyed() {
    window.removeEventListener('click', this.onClick, false)
    window.removeEventListener('resize', this.onWindowResize, false)
    document.body.removeChild(this.stats.domElement)
    this.stats = null
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
        50,
        this.areaWidth / this.areaHeight,
        0.1,
        2000
      )
      this.camera.name = 'mainCamera'
      // 设置摄像机位置
      this.camera.position.set(300, 1000, 800)
      // 指向场景中心
      this.camera.lookAt(this.scene.position)
    },
    /**
     * 创建渲染器,并设置渲染器的相关参数
     */
    createRenderer() {
      // WebGL兼容性检查 WEBGL.isWebGLAvailable()
      if (WEBGL.isWebGLAvailable()) {
        this.renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true // antialias:是否执行抗锯齿
        })
        // 设置颜色和透明度
        this.renderer.setClearColor(0x1f2d3d, 1)

        // 设置渲染器大小
        this.renderer.setSize(this.areaWidth, this.areaHeight)
        // 兼容高清屏幕
        this.renderer.setPixelRatio(window.devicePixelRatio)
        // 将渲染器的DOM元素(this.renderer.domElement)添加到roomDom元素中
        this.roomDom.appendChild(this.renderer.domElement)
      } else {
        const warning = WEBGL.getWebGLErrorMessage()
        this.roomDommainDom.appendChild(warning)
      }
    },

    /**
     * 初始化光源,并设置其相关参数
     */
    initLight() {
      // const light = new THREE.DirectionalLight(0x999999, 0.1) // 模拟远处类似太阳的光源
      // light.position.set(0, 500, 0).normalize()
      // this.scene.add(light)

      const ambient = new THREE.AmbientLight(0xffffff, 0.85) // AmbientLight,影响整个场景的光源
      ambient.position.set(0, 500, 0)
      this.scene.add(ambient)
    },
    /**
     * 用相机(camera)渲染一个场景(scene)
     */
    render() {
      this.renderer.render(this.scene, this.camera)
      // 实时渲染
      requestAnimationFrame(this.render)
      this.stats.update()
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
          texture.repeat.set(repeatHeightNum, repeatWidthNum)
          // 绘制地板
          const boxGeo = new THREE.BoxBufferGeometry(
            texture.image.width * repeatHeightNum, // X轴上面的宽度
            4, // Y轴上面的高度
            texture.image.height * repeatWidthNum // Z轴上面的深度
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
      const wallTexture = this.textureLoader.load(
        'data:image/jpeg;base64,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'
      )
      wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
      wallTexture.repeat.set(20, 5)

      const material = new THREE.MeshBasicMaterial({
        map: wallTexture,
        side: THREE.DoubleSide
      })

      const geometryAB = new THREE.BoxBufferGeometry(2, 100, 128 * 4)

      const wallMeshBefore = new THREE.Mesh(geometryAB, material)
      wallMeshBefore.position.set((128 * 7) / 2, 50, 0)
      wallMeshBefore.name = '墙壁Before'
      this.scene.add(wallMeshBefore)

      const wallMeshAfter = new THREE.Mesh(geometryAB, material)
      wallMeshAfter.position.set(-(128 * 7) / 2, 50, 0)
      wallMeshAfter.name = '墙壁After'
      this.scene.add(wallMeshAfter)

      const geometryLR = new THREE.BoxBufferGeometry(2, 100, 128 * 7)

      const wallMeshLeft = new THREE.Mesh(geometryLR, material)
      wallMeshLeft.position.set(0, 50, (128 * 4) / 2)
      wallMeshLeft.rotation.y += 1.5 * Math.PI
      wallMeshLeft.name = '墙壁Left'
      this.scene.add(wallMeshLeft)

      const wallMeshRight = new THREE.Mesh(geometryLR, material)
      wallMeshRight.position.set(0, 50, -(128 * 4) / 2)
      wallMeshRight.rotation.y += 1.5 * Math.PI
      wallMeshRight.name = '墙壁Right'
      this.scene.add(wallMeshRight)
    },
    /**
     * 绘制机柜
     */
    createCabinet(w, h, d, px, py, pz, c) {
      // const materialCabinet = new THREE.MeshPhongMaterial({ color: 0x42474c })

      // const geometryCabinet = new THREE.BoxBufferGeometry(60, 150, 30)
      // const meshCabinet = new THREE.Mesh(geometryCabinet, materialCabinet)

      // const cabientGroup = new THREE.Group()
      // cabientGroup.add(meshCabinet)

      // cabientGroup.position.set(50, 75, 200)
      // cabientGroup.name = '机柜1'

      // const cabientGroupClone = cabientGroup.clone()
      // cabientGroupClone.position.set(-120, 75, 200)
      // cabientGroupClone.rotation.y += 1.5 * Math.PI
      // cabientGroupClone.name = '机柜2'

      // const cabientGroupClone1 = cabientGroupClone.clone()
      // cabientGroupClone1.position.set(-120, 75, 120)
      // cabientGroupClone1.name = '机柜3'

      // this.scene.add(cabientGroup, cabientGroupClone, cabientGroupClone1)
      const cabinet = {}

      // 机柜的后
      const geometry = new THREE.BoxBufferGeometry(w, h, 2)
      const meterial = new THREE.MeshBasicMaterial({
        color: 0x777777,
        opacity: 0.2,
        transparent: true
      })

      const back = new THREE.Mesh(geometry, meterial)

      back.position.x = px
      back.position.y = py + h / 2 + 1
      back.position.z = pz - d / 2 + 2

      // back.hover = function(o) {
      //   hoverCabinet(o.container)
      // }
      back.container = cabinet
      back.name = 'back'
      this.scene.add(back)

      cabinet.back = back

      // 机柜的左、右
      const meterial1 = new THREE.MeshBasicMaterial({
        color: 0x777777,
        opacity: 0.9,
        transparent: true
      })

      const left = new THREE.Mesh(geometry, meterial1)
      const right = new THREE.Mesh(geometry, meterial1)

      left.position.x = px + w / 2 - 1
      left.position.y = py + h / 2 + 1
      left.position.z = pz
      left.rotation.y = Math.PI / 2
      left.name = 'left'

      right.position.x = px - w / 2 + 1
      right.position.y = py + h / 2 + 1
      right.position.z = pz
      right.rotation.y = -Math.PI / 2
      right.name = 'right'

      // left.hover = function(o) {
      //   hoverCabinet(o.container)
      // }
      left.container = cabinet
      // right.hover = function(o) {
      //   hoverCabinet(o.container)
      // }
      right.container = cabinet

      // targetList.push(left)
      // targetList.push(right)
      this.scene.add(left)
      this.scene.add(right)

      cabinet.left = left
      cabinet.right = right

      // 机柜的底部、顶部
      const geometry2 = new THREE.BoxBufferGeometry(w, 2, d)
      const meterial2 = new THREE.MeshBasicMaterial({
        color: 0x222222,
        transparent: true
      })

      const top = new THREE.Mesh(geometry2, meterial2)
      const bottom = new THREE.Mesh(geometry2, meterial2)

      top.position.x = px
      top.position.y = py + h + 2
      top.position.z = pz
      top.name = 'top'

      bottom.position.x = px
      bottom.position.y = py + 2
      bottom.position.z = pz
      bottom.name = 'bottom'

      // top.hover = function(o) {
      //   hoverCabinet(o.container)
      // }
      top.container = cabinet
      // bottom.hover = function(o) {
      //   hoverCabinet(o.container)
      // }
      bottom.container = cabinet

      // targetList.push(top)
      // targetList.push(bottom)
      this.scene.add(top)
      this.scene.add(bottom)

      cabinet.top = top
      cabinet.bottom = bottom

      // 机柜门
      const geometry3 = new THREE.BoxBufferGeometry(w, h, 1)
      const meterial3 = new THREE.MeshBasicMaterial({
        color: 0x003333,
        opacity: 0.5,
        transparent: true
      })

      const front = new THREE.Mesh(geometry3, meterial3)

      front.position.x = px
      front.position.y = py + h / 2 + 1
      front.position.z = pz + d / 2
      front.name = 'front'
      front.toggle = function(o) {
        if (o.rotation.y === 0) {
          o.rotation.y = o.rotation.y + (Math.PI * 3) / 5
          o.position.x = o.position.x + w / 2 + 3
          o.position.z = o.position.z + d / 2

          // openCabinet(o.container)
        } else {
          o.rotation.y = o.rotation.y - (Math.PI * 3) / 5
          o.position.x = o.position.x - w / 2 - 3
          o.position.z = o.position.z - d / 2

          // 关闭机柜门时，将机柜中的服务器收起
          for (var i = 0; i < o.container.servers.length; i++) {
            o.container.servers[i].toggle(o.container.servers[i], false)
          }

          // closeCabinet(o.container)
        }
      }
      // front.hover = function(o) {
      //   hoverCabinet(o.container)
      // }
      front.container = cabinet

      this.scene.add(front)
      // targetList.push(front)

      cabinet.front = front

      //
      cabinet.servers = []

      if (c && c.servers) {
        cabinet.info = c
        for (let i = 0; i < c.servers.length; i++) {
          const server = this.createServer(
            w - 4,
            15,
            d - 4,
            px,
            i === 0 ? 10 : py + 20 * (i + 1),
            pz + 2,
            c.servers[i]
          ) // 服务器的厚度默认为 15 服务器之间的间隔为 5
          server.container = cabinet
          server.info = c.servers[i]
          cabinet.servers.push(server)
        }
      }
      cabinet.name = 'cabinet'
      return cabinet
    },
    createServer(w, h, d, px, py, pz, config) {
      // 服务器
      const texture = this.textureLoader.load(
        config.skinImgurl
          ? config.skinImgurl
          : '/source/textures/computer/4.jpg'
      )
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      texture.repeat.set(1, 1)

      const textureBack = this.textureLoader.load(
        '/source/textures/computer/2.jpg'
      )
      textureBack.wrapS = textureBack.wrapT = THREE.RepeatWrapping
      textureBack.repeat.set(1, 1)

      const materialBasic = new THREE.MeshBasicMaterial({ color: 0xbbbbbb })
      const geometry = new THREE.BoxBufferGeometry(w, h, d)
      // Create an array of materials to be used in a cube, one for each side
      const materialArray = []
      // order to add materials: x+,x-,y+,y-,z+,z-
      materialArray.push(materialBasic)
      materialArray.push(materialBasic)
      materialArray.push(materialBasic)
      materialArray.push(materialBasic)
      materialArray.push(new THREE.MeshBasicMaterial({ map: texture }))
      materialArray.push(new THREE.MeshBasicMaterial({ map: textureBack }))
      const material = new THREE.MeshFaceMaterial(materialArray)

      const server = new THREE.Mesh(geometry, material)

      server.position.x = px
      server.position.y = py
      server.position.z = pz
      server.name = config.name
      server.toggle = function(o, openOrClose) {
        // 关闭同一机柜中的其他服务器
        for (var i = 0; i < o.container.servers.length; i++) {
          if (o === o.container.servers[i]) {
            continue
          }
          if (o.container.servers[i].position.z === pz) {
          } else {
            o.container.servers[i].position.z =
              o.container.servers[i].position.z - d / 2
            //
            // closeServer(o.container.servers[i])
          }
        }

        if (o.position.z === pz) {
          if (openOrClose == null || openOrClose) {
            o.position.z = o.position.z + d / 2
            // 打开服务器时，处理其他逻辑
            // openServer(o)
          }
        } else {
          if (openOrClose == null || !openOrClose) {
            o.position.z = o.position.z - d / 2
            // 关上服务器时，处理其他逻辑
            // closeServer(o)
          }
        }
      }
      // server.hover = function(o) {
      //   hoverServer(o)
      // }

      this.scene.add(server)
      // targetList.push(server)

      return server
    },

    // 初始化性能插件
    initStats() {
      const statsTem = new Stats()
      statsTem.domElement.style.position = 'absolute'
      statsTem.domElement.style.left = 'auto'
      statsTem.domElement.style.right = '110px'
      statsTem.domElement.style.top = '0px'
      document.body.appendChild(statsTem.domElement)

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

      // 重置渲染器输出画布canvas尺寸
      this.renderer.setSize(width, height - 60)
    },
    /**
     * 点击事件
     */
    onClick(event) {
      event.preventDefault()
      this.camera.fov = 50

      console.log('event.clientX:' + event.clientX)
      console.log('event.clientY:' + event.clientY)
      const x = event.clientX - 210
      const y = event.clientY - 60
      // 声明 raycaster 和 mouse 变量
      // const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      // 通过鼠标点击位置,计算出 raycaster 所需点的位置,以屏幕为中心点,范围 -1 到 1
      // mouse.x = (x / window.innerWidth) * 2 - 1
      // mouse.y = -(y / window.innerHeight) * 2 + 1
      mouse.x = (x / this.areaWidth) * 2 - 1
      mouse.y = -(y / this.areaHeight) * 2 + 1

      // const stdVector = new THREE.Vector3(mouse.x, mouse.y, 1)
      // // 通过unproject方法，可以将标准设备坐标转世界坐标
      // const worldVector = stdVector.unproject(this.camera)

      // const raycaster = new THREE.Raycaster(
      //   this.camera.position,
      //   worldVector.sub(this.camera.position).normalize()
      // )

      const vector = new THREE.Vector3(mouse.x, mouse.y, 1)
      vector.unproject(this.camera)
      const raycaster = new THREE.Raycaster(
        this.camera.position,
        vector.sub(this.camera.position).normalize()
      )

      const intersects = raycaster.intersectObjects(this.scene.children)

      //       // 通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
      // raycaster.setFromCamera(mouse, this.camera)

      // // 获取与射线相交的对象数组，其中的元素按照距离排序，越近的越靠前
      // const intersects = raycaster.intersectObjects(this.scene.children)

      const tooltipDom = document.getElementById('tooltip')
      if (intersects.length === 0) {
        tooltipDom.style.display = 'none' // 隐藏说明性标签
        this.camera.fov = 50
        this.camera.updateProjectionMatrix()
        return
      }
      // 获取选中最近的 Mesh 对象
      const selectObject = intersects[0].object
      console.info('当前点击的物体', selectObject)

      if (selectObject.name.startsWith('地板')) {
        tooltipDom.style.display = 'none' // 隐藏说明性标签
        return
      }
      tooltipDom.style.display = 'block' // 显示说明性标签
      // 修改标签的位置
      tooltipDom.style.left = x + 50 + 'px'
      tooltipDom.style.top = y - 30 + 'px'
      tooltipDom.innerHTML = selectObject.name // 显示模型信息
      if (selectObject.name.includes('服务器')) {
        tooltipDom.innerHTML += '<br/>' + '运行正常' // 显示机柜详细信息
      }

      // if (selectObject.name.startsWith('机柜')) {
      //   tooltipDom.innerHTML = selectObject.name + '详细信息' // 显示机柜详细信息
      // } else {
      //   const a = -0.5 * Math.PI
      //   const b = 0
      //   const posSrc = { pos: b }
      //   const tween = new TWEEN.Tween(posSrc).to({ pos: a }, 1000)
      //   tween.easing(TWEEN.Easing.Elastic.InOut).onUpdate(() => {
      //     // intersects[0].object.rotation.z = posSrc.pos
      //   })
      this.camera.fov = 35
      //   // this.camera.position.set(300, 1000, 800)

      this.camera.updateProjectionMatrix()
      //   tween.start()
      // }
      if (selectObject.toggle && typeof selectObject.toggle === 'function') {
        selectObject.toggle(selectObject)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
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
</style>
