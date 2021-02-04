<template>
  <div id="box" ref="box">
    <div id="loading-outer">
    <div id="progress"></div>
    </div>
    <div id="btn" @click="click">切换</div>
  </div>
</template>

<script>
import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
let camera, scene, renderer
let controls,
  font,
  stats,
  time = 0
let group = new THREE.Group()
let persent = 0
let tween1
let tween2
let tween3
let flag = 0
let lookAt1 = new THREE.Vector3(0, 0, 1)
let lookAt2 = new THREE.Vector3(0, 0, 0)
let positions1 = []
let positions2 = []
let positions3 = []
let map, normal, diffuse
let texts =
  '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴鬱胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍卻璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公万俟司马上官欧阳夏侯诸葛闻人东方赫连皇甫尉迟公羊澹台公冶宗政濮阳淳于单于太叔申屠公孙仲孙轩辕令狐钟离宇文长孙慕容鲜于闾丘司徒司空丌官司寇仉督子车颛孙端木巫马公西漆雕乐正壤驷公良拓跋夹谷宰父谷梁晋楚闫法汝鄢涂钦段干百里东郭南门呼延归海羊舌微生岳帅缑亢况郈有琴梁丘左丘东门西门商牟佘佴伯赏南宫墨哈谯笪年爱阳佟第五言福百家姓终'

function onUpdate() {
  let time = this._object.time
  if (flag == 0) {
    group.children.forEach((d, i) => {
      d.position.copy(
        positions3[i]
          .clone()
          .multiplyScalar(time / 2)
          .add(positions1[i].clone().multiplyScalar(1 - time / 2))
      )
      d.lookAt(
        new THREE.Vector3(0, d.position.y, 0).multiplyScalar(time / 2).add(
          d.position
            .clone()
            .add(lookAt1)
            .multiplyScalar(1 - time / 2)
        )
      )
    })
  } else if (flag == 1) {
    group.children.forEach((d, i) => {
      d.position.copy(
        positions1[i]
          .clone()
          .multiplyScalar(1 - time)
          .add(positions2[i].clone().multiplyScalar(time))
      )
      d.lookAt(
        d.position
          .clone()
          .add(lookAt1)
          .multiplyScalar(1 - time)
          .add(lookAt2.multiplyScalar(time))
      )
    })
  } else if (flag == 2) {
    group.children.forEach((d, i) => {
      d.position.copy(
        positions2[i]
          .clone()
          .multiplyScalar(2 - time)
          .add(positions3[i].clone().multiplyScalar(time - 1))
      )
      d.lookAt(
        lookAt2
          .multiplyScalar(2 - time)
          .add(new THREE.Vector3(0, d.position.y, 0).multiplyScalar(time - 1))
      )
    })
  }
}
export default {
  name: 'ch',
  data() {
    return {
      canHandle: true
    }
  },
  methods: {
    initScene() {
      stats = new Stats()
      this.$refs.box.appendChild(stats.dom)

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      )
      camera.position.z = 1000

      scene = new THREE.Scene()
      scene.add(new THREE.AmbientLight(0x888888))

      let pointLight = new THREE.PointLight(0xffffff)
      scene.add(pointLight)
      let pointLight2 = pointLight.clone()
      pointLight2.position.set(0, 0, 600)
      scene.add(pointLight2)

      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x446655)
      this.$refs.box.appendChild(renderer.domElement)

      controls = new OrbitControls(camera, renderer.domElement)

      let vertices1 = new THREE.PlaneGeometry(1400, 900, 13, 6).vertices
      let vertices2 = new THREE.SphereGeometry(500, 12, 9).vertices

      positions1 = vertices1
      positions2 = vertices2

      for (let i = 0; i < 98; i++) {
        let x = Math.sin((Math.PI / 12) * i) * 400
        let y = (49 - i) * 8
        let z = Math.cos((Math.PI / 12) * i) * 400
        positions3.push(new THREE.Vector3(x, y, z))
      }

      document.getElementById('loading-outer').style.width = '40%'
      document.getElementById('progress').innerHTML = 40

      const fontLoader = new THREE.FontLoader()

      fontLoader.load('/source/fonts/STXinwei_Regular.json', (response) => {
        font = response
        texts
          .split('')
          .slice(0, 98)
          .forEach((d, i) => {
            let mesh = this.setText(d)
            mesh.position.copy(positions1[i])
            mesh.lookAt(mesh.position.clone().add(lookAt1))
            group.add(mesh)
          })
        scene.add(group)
        this.initTween()
        this.render()
        document.getElementById('loading').style.display = 'none'
      })
    },
    click() {
      tween1.stop()
      tween2.stop()
      tween3.stop()
      if (flag == 0) {
        tween1.start()
      } else if (flag == 1) {
        tween2.start()
      } else if (flag == 2) {
        tween3.start()
      }
      flag = (flag + 1) % 3
    },
    setText(d) {
      let textGeo = new THREE.TextGeometry(d, {
        font: font,

        size: 50,
        height: 4,
        curveSegments: 4,

        bevelThickness: 2,
        bevelSize: 1.5,
        bevelEnabled: true
      })

      textGeo.center()

      let material = new THREE.MeshStandardMaterial({ color: 0xffaa00 })
      let mesh = new THREE.Mesh(textGeo, material)

      return mesh
    },
    initTween() {
      var pos = { time: 0 }
      tween1 = new TWEEN.Tween(pos).to({ time: 1 }, 1000)
      tween2 = new TWEEN.Tween(pos).to({ time: 2 }, 1000)
      tween3 = new TWEEN.Tween(pos).to({ time: 0 }, 1000)
      tween1.easing(TWEEN.Easing.Linear.None)
      tween2.easing(TWEEN.Easing.Linear.None)
      tween3.easing(TWEEN.Easing.Linear.None)
      tween1.onUpdate(onUpdate)
      tween2.onUpdate(onUpdate)
      tween3.onUpdate(onUpdate)
    },
    render() {
      TWEEN.update()
      stats.update()
      renderer.render(scene, camera)
      this.globalID = requestAnimationFrame(this.render)
    }
  },
  mounted() {
    this.initScene()
    window.onresize = () => {
      camera.aspect = this.$refs.box.clientWidth / this.$refs.box.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(this.$refs.box.clientWidth, this.$refs.box.clientHeight)
    }
  },
  beforeDestroy() {
    renderer.forceContextLoss()
    renderer = null
    scene = null
    camera = null
    // controls = null;
    // lights = [];
    // document
    //     .getElementsByClassName("ac")[0]
    //     .removeChild(document.getElementsByClassName("main")[0]);
    cancelAnimationFrame(this.globalID)
  }
}
</script>

<style lang="scss" scope>
#box {
  position: relative;
  #btn {
    position: absolute;
    width: 100px;
    height: 30px;
    line-height: 30px;
    margin-left: 50%;
    left: 0;
    bottom: 10px;
    background: #ffffff;
    text-align: center;
    cursor: pointer;
  }
}
</style>
