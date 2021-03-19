<template>
  <div id="cont">
    <canvas id="canvas" style="display: none;">你的浏览器不支持canvas</canvas>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      mesh: null,
      light: null,
      controls: null
    }
  },
  mounted() {
    this.main()
  },
  methods: {
    // 初始化渲染器
    initRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(window.innerWidth, window.innerHeight) // 渲染大小
      const roomDom = document.getElementById('cont')
      roomDom.appendChild(this.renderer.domElement)
      this.renderer.setClearColor(0xffffff, 1.0) // 渲染背景颜色
    },

    // 初始化相机
    initCamera() {
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        10000
      )
      this.camera.position.set(10, 5, 20)
    },

    // 初始化场景
    initScene() {
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xf0f0f0)
      const axesHelper = new THREE.AxesHelper(50)
      this.scene.add(axesHelper)
    },

    // 初始化光线
    initLight() {
      // 环境光
      this.light = new THREE.AmbientLight(0x00ff00)
      this.scene.add(this.light)

      // 方向光
      this.light = new THREE.DirectionalLight(0xff0000, 1)
      this.light.position.set(0, 0, 1)
      this.scene.add(this.light)
    },

    // 构建物体
    initObject() {
      const geometry = new THREE.BoxGeometry(50, 50, 50) // 构建一个正方体
      const material = new THREE.MeshLambertMaterial({ color: 0xffffff })
      this.mesh = new THREE.Mesh(geometry, material)
      this.scene.add(this.mesh)

      // 用canvas生成图片
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 300
      canvas.height = 300
      // 制作矩形
      ctx.fillStyle = 'rgba(255,165,0,0.8)'
      ctx.fillRect(0, 0, 300, 300)
      // 设置文字
      ctx.fillStyle = '#fff'
      ctx.font = 'normal 18pt "楷体"'
      ctx.fillText('模型介绍', 100, 20)
      const textWord = '制作完成'
      // 文字换行
      const len = parseInt(textWord.length / 10)
      for (let i = 0; i < len + 1; i++) {
        let space = 10
        if (i === len) {
          space = textWord.length - len * 10
        }
        console.log('len+' + len, 'space+' + space)
        const word = textWord.substr(i * 10, space)
        ctx.fillText(word, 15, 60 * (i + 1))
      }
      // 生成图片
      const url = canvas.toDataURL('image/png')

      // 将图片构建到纹理中
      const geometry1 = new THREE.CircleGeometry(15, 30)
      const texture = THREE.ImageUtils.loadTexture(url, null, function(t) {})

      const material1 = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
        opacity: 1,
        transparent: true
      })

      const rect = new THREE.Mesh(geometry1, material1)
      rect.position.set(0, 50, 12)
      this.scene.add(rect)
    },

    // 用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
    initControls() {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      //  如果使用animate方法时，将此函数删除
      // this.controls.addEventListener( 'change', render );
      //  使动画循环使用时阻尼或自转 意思是否有惯性
      this.controls.enableDamping = true
      // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
      // this.controls.dampingFactor = 0.25;
      // 是否可以缩放
      this.controls.enableZoom = true
      // 是否自动旋转
      // this.controls.autoRotate = true;
      // 设置相机距离原点的最远距离
      this.controls.minDistance = 200
      // 设置相机距离原点的最远距离
      this.controls.maxDistance = 600
      // 是否开启右键拖拽
      this.controls.enablePan = true
    },

    animate() {
      // 更新控制器
      this.controls.update()
      requestAnimationFrame(this.animate)
      this.renderer.render(this.scene, this.camera)
    },
    main() {
      this.initRenderer() // 渲染器
      this.initCamera() // 相机
      this.initScene() // 场景
      this.initLight() // 光线
      this.initObject() // 物体
      this.initControls()
      this.animate() // 动画
    }
  }
}
</script>

<style></style>
