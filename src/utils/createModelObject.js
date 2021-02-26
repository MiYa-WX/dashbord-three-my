import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

/**
 * 创建盒子模型
 */
function createBox(obj) {
  const length = obj.length || 1000 // 默认1000
  const width = obj.width || length
  const height = obj.height || 10
  const positionX = obj.position.x || 0
  const positionY = obj.position.y || 0
  const positionZ = obj.position.z || 0
  const skinColor = obj.style.skinColor || 0x98750f
  const boxGeometry = new THREE.BoxGeometry(length, height, width, 0, 0, 1)

  // 六面颜色
  for (let i = 0; i < boxGeometry.faces.length; i += 2) {
    const hex = skinColor || Math.random() * 0x531844
    boxGeometry.faces[i].color.setHex(hex)
    boxGeometry.faces[i + 1].color.setHex(hex)
  }
  // 六面纹理
  let skinUpObj = {
    vertexColors: THREE.FaceColors
  }
  let skinDownObj = skinUpObj
  let skinForeObj = skinUpObj
  let skinBehindObj = skinUpObj
  let skinLeftObj = skinUpObj
  let skinRightObj = skinUpObj
  let skinOpacity = 1
  if (
    obj.style != null &&
    typeof obj.style !== 'undefined' &&
    obj.style.skin !== null &&
    typeof obj.style.skin !== 'undefined'
  ) {
    // 透明度
    if (
      obj.style.skin.opacity != null &&
      typeof obj.style.skin.opacity !== 'undefined'
    ) {
      skinOpacity = obj.style.skin.opacity
      console.log(skinOpacity)
    }
    // 上
    skinUpObj = createSkinOptionOnj(
      this,
      length,
      width,
      obj.style.skin.skinup,
      boxGeometry,
      4
    )
    // 下
    skinDownObj = createSkinOptionOnj(
      length,
      width,
      obj.style.skin.skindown,
      boxGeometry,
      6
    )
    // 前
    skinForeObj = createSkinOptionOnj(
      length,
      width,
      obj.style.skin.skinfore,
      boxGeometry,
      0
    )
    // 后
    skinBehindObj = createSkinOptionOnj(
      length,
      width,
      obj.style.skin.skinbehind,
      boxGeometry,
      2
    )
    // 左
    skinLeftObj = createSkinOptionOnj(
      length,
      width,
      obj.style.skin.skinleft,
      boxGeometry,
      8
    )
    // 右
    skinRightObj = createSkinOptionOnj(
      length,
      width,
      obj.style.skin.skinright,
      boxGeometry,
      10
    )
  }
  const cubeMaterialArray = []
  cubeMaterialArray.push(new THREE.MeshLambertMaterial(skinForeObj))
  cubeMaterialArray.push(new THREE.MeshLambertMaterial(skinBehindObj))
  cubeMaterialArray.push(new THREE.MeshLambertMaterial(skinUpObj))
  cubeMaterialArray.push(new THREE.MeshLambertMaterial(skinDownObj))
  cubeMaterialArray.push(new THREE.MeshLambertMaterial(skinRightObj))
  cubeMaterialArray.push(new THREE.MeshLambertMaterial(skinLeftObj))
  const cubeMaterials = new THREE.MeshFaceMaterial(cubeMaterialArray)
  const box = new THREE.Mesh(boxGeometry, cubeMaterials)
  box.castShadow = true
  box.receiveShadow = true
  box.uuid = obj.uuid
  box.name = obj.name
  box.position.set(positionX, positionY, positionZ)
  if (
    obj.rotation != null &&
    typeof obj.rotation !== 'undefined' &&
    obj.rotation.length > 0
  ) {
    for (let i = 0; i < obj.rotation.length; i++) {
      const rotationObj = obj.rotation[i]
      switch (rotationObj.direction) {
        case 'x':
          box.rotateX(rotationObj.degree)
          break
        case 'y':
          box.rotateY(rotationObj.degree)
          break
        case 'z':
          box.rotateZ(rotationObj.degree)
          break
        case 'arb':
          box.rotateOnAxis(
            new THREE.Vector3(
              rotationObj.degree[0],
              rotationObj.degree[1],
              rotationObj.degree[2]
            ),
            rotationObj.degree[3]
          )
          break
      }
    }
  }

  return box
}
/**
 * 创建圆柱模型
 */
function createCylinder() {}
/**
 * 创建平面模型
 */
function createPlane() {}
/**
 * 创建空盒子模型
 */
function createEmptyBox() {}

/**
 * 皮肤
 */
function createSkinOptionOnj(
  _this,
  flength,
  fwidth,
  _obj,
  _cube,
  _cubefacenub
) {
  // if (_this.commonFunc.hasObj(_obj)) {
  //     if (_this.commonFunc.hasObj(_obj.imgurl)) {
  //         return {
  //             map: _this.createSkin(flength, fwidth, _obj),transparent:true
  //         }
  //     } else {
  //         if (_this.commonFunc.hasObj(_obj.skinColor)) {
  //             _cube.faces[_cubefacenub].color.setHex(_obj.skinColor);
  //             _cube.faces[_cubefacenub + 1].color.setHex(_obj.skinColor);
  //         }
  //         return {
  //             vertexColors: THREE.FaceColors
  //         }
  //     }
  // } else {
  //     return {
  //         vertexColors: THREE.FaceColors
  //     }
  // }
}
/**
 * 创建地板，并贴图
 */
function createFloor(scope) {
  const textureLoader = new THREE.TextureLoader()
  // 创建材质并贴上纹理
  textureLoader.load(
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
      scope.scene.add(boxMesh)
    },

    // 目前暂不支持onProgress的回调
    undefined,

    // onError回调
    (err) => {
      console.error('An error happened in textureLoader.', err)
    }
  )
}
/**
 * 创建墙壁
 */
function createWall(scope) {
  const textureLoader = new THREE.TextureLoader()
  const wallTexture = textureLoader.load('/source/textures/wall/wall.jpg')
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping
  wallTexture.repeat.set(20, 5)

  const material = new THREE.MeshBasicMaterial({
    map: wallTexture,
    side: THREE.DoubleSide
  })

  const geometryAB = new THREE.BoxBufferGeometry(2, 100, 128 * 3)

  const wallMeshBefore = new THREE.Mesh(geometryAB, material)
  wallMeshBefore.position.set((128 * 4) / 2, 50, 0)
  wallMeshBefore.name = '墙壁Before'
  scope.scene.add(wallMeshBefore)

  const wallMeshAfter = new THREE.Mesh(geometryAB, material)
  wallMeshAfter.position.set(-(128 * 4) / 2, 50, 0)
  wallMeshAfter.name = '墙壁After'
  scope.scene.add(wallMeshAfter)

  const geometryLR = new THREE.BoxGeometry(2, 100, 128 * 4)

  const wallMeshLeft = new THREE.Mesh(geometryLR, material)
  wallMeshLeft.position.set(0, 50, (128 * 3) / 2)
  wallMeshLeft.rotation.y += 1.5 * Math.PI
  wallMeshLeft.name = '墙壁Left'
  // scope.scene.add(wallMeshLeft)

  const wallMeshRight = new THREE.Mesh(geometryLR, material)
  wallMeshRight.position.set(0, 50, -(128 * 3) / 2)
  wallMeshRight.rotation.y += 1.5 * Math.PI
  wallMeshRight.name = '墙壁Right'
  scope.scene.add(wallMeshRight)

  const geometryDong = new THREE.BoxGeometry(2, 80, 34)
  const dongMesh = new THREE.Mesh(geometryDong, material)
  dongMesh.position.set(0, 80 / 2, (128 * 3) / 2)
  dongMesh.rotation.y += 1.5 * Math.PI
  dongMesh.name = '门洞'
  const objectsCube = []
  objectsCube.push(dongMesh)
  createResultBsp(scope, wallMeshLeft, objectsCube, material)
}
/**
 * 绘制房门
 */
function createDoor(scope) {
  const textureLoader = new THREE.TextureLoader()

  textureLoader.load('/source/textures/door/door1.png', (texture) => {
    const doormaterial = new THREE.MeshBasicMaterial({
      map: texture,
      color: 0xffffff,
      side: THREE.DoubleSide
    })
    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    // texture.repeat.set(5, 5)
    const doorgeometry = new THREE.BoxGeometry(2, 80, 34)
    const door = new THREE.Mesh(doorgeometry, doormaterial)
    door.position.set(0, 80 / 2, (128 * 3) / 2)
    door.rotation.y += 1.5 * Math.PI
    door.name = '房门'
    door.open = false
    door.toggle = (o) => {
      if (!door.open) {
        new TWEEN.Tween(o.rotation)
          .to(
            {
              y: o.rotation.y + (Math.PI * 3) / 5
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()

        new TWEEN.Tween(o.position)
          .to(
            {
              x: 34 / 2 + 5,
              z: (128 * 3) / 2 + 34 / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()

        door.open = true
      } else {
        new TWEEN.Tween(o.rotation)
          .to(
            {
              y: o.rotation.y - (Math.PI * 3) / 5
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        new TWEEN.Tween(o.position)
          .to(
            {
              x: 0,
              z: (128 * 3) / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()

        door.open = false
      }
    }
    scope.scene.add(door)
  })
}

/**
 * 绘制机柜
 */
function createCabinet(scope, w, h, d, px, py, pz, c) {
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

  // scope.scene.add(cabientGroup, cabientGroupClone, cabientGroupClone1)
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

  back.container = cabinet
  back.name = 'back'
  scope.scene.add(back)

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

  left.container = cabinet
  right.container = cabinet

  scope.scene.add(left)
  scope.scene.add(right)

  cabinet.left = left
  cabinet.right = right

  // 机柜的底部、顶部
  const geometry2 = new THREE.BoxBufferGeometry(w, 2, d)
  const meterial2 = new THREE.MeshBasicMaterial({
    color: 0x222222,
    transparent: true
  })

  const meterialTop = [
    meterial2, // 相对于机房门方向的右边
    meterial2, // 相对于机房门方向的左边
    new THREE.MeshBasicMaterial({
      // 机柜上面的标签字体
      map: new THREE.CanvasTexture(createText(c)),
      side: THREE.FrontSide
    }), // 相对于机房门方向的上
    meterial2, // 相对于机房门方向的下
    meterial2, // 相对于机房门方向的前
    meterial2 // 相对于机房门方向的后
  ]

  const top = new THREE.Mesh(geometry2, meterialTop)
  const bottom = new THREE.Mesh(geometry2, meterial2)

  top.position.x = px
  top.position.y = py + h + 2
  top.position.z = pz
  top.name = 'top'

  bottom.position.x = px
  bottom.position.y = py + 2
  bottom.position.z = pz
  bottom.name = 'bottom'

  top.container = cabinet
  bottom.container = cabinet
  scope.scene.add(top)
  scope.scene.add(bottom)

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
  front.open = false
  front.toggle = (o) => {
    if (!front.open) {
      new TWEEN.Tween(o.rotation)
        .to(
          {
            y: o.rotation.y + (Math.PI * 3) / 5
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()

      new TWEEN.Tween(o.position)
        .to(
          {
            x: o.position.x + w / 2 + 3,
            z: o.position.z + d / 2
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      front.open = true
    } else {
      new TWEEN.Tween(o.rotation)
        .to(
          {
            y: o.rotation.y - (Math.PI * 3) / 5
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()
      new TWEEN.Tween(o.position)
        .to(
          {
            x: o.position.x - w / 2 - 3,
            z: o.position.z - d / 2
          },
          1000
        )
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start()

      front.open = false
      // 关闭机柜门时，将机柜中的服务器收起
      for (var i = 0; i < o.container.servers.length; i++) {
        o.container.servers[i].toggle(o.container.servers[i], false)
      }
    }
  }
  front.container = cabinet
  scope.scene.add(front)

  cabinet.front = front
  cabinet.servers = []
  if (c && c.servers) {
    cabinet.info = c
    for (let i = 0; i < c.servers.length; i++) {
      const server = createServer(
        scope,
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
      /**
       * 服务器异常时的处理逻辑
       * 1.机柜门打开
       * 2.服务器标红
       * 3.机柜顶部显示异常图标
       */
      if (c.servers[i].deviceStatus) {
        handleStatus(c.servers[i], c, cabinet)
      } else {
        continue
      }
    }
  }
  cabinet.name = 'cabinet'
  return cabinet
}
/**
 * 绘制服务器
 */
function createServer(scope, w, h, d, px, py, pz, config) {
  const textureLoader = new THREE.TextureLoader()

  // 服务器
  const texture = textureLoader.load(
    config.skinImgurl ? config.skinImgurl : '/source/textures/computer/4.jpg'
  )
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)

  const textureBack = textureLoader.load('/source/textures/computer/2.jpg')
  textureBack.wrapS = textureBack.wrapT = THREE.RepeatWrapping
  textureBack.repeat.set(1, 1)

  const materialBasic = new THREE.MeshBasicMaterial({
    color: 0xbbbbbb
  })
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
  server.open = false
  server.toggle = (o, openOrClose) => {
    // 关闭同一机柜中的其他服务器
    for (var i = 0; i < o.container.servers.length; i++) {
      const serversItem = o.container.servers[i]
      if (o === serversItem) {
        continue
      }
      if (serversItem.position.z !== pz) {
        new TWEEN.Tween(serversItem.position)
          .to(
            {
              z: serversItem.position.z - d / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
      }
    }

    if (o.position.z === pz) {
      if (openOrClose == null || openOrClose) {
        new TWEEN.Tween(o.position)
          .to(
            {
              z: o.position.z + d / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        // o.position.z = o.position.z + d / 2
        // 打开服务器时，处理其他逻辑
        // openServer(o)
        server.open = true
      }
    } else {
      if (openOrClose == null || !openOrClose) {
        new TWEEN.Tween(o.position)
          .to(
            {
              z: o.position.z - d / 2
            },
            1000
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .start()
        // o.position.z = o.position.z - d / 2
        // 关上服务器时，处理其他逻辑
        // closeServer(o)
        server.open = false
      }
    }
  }
  // 异常设备的处理
  if (config.deviceStatus) {
    const geometryStatus = new THREE.BoxGeometry(w, h, d)
    const meterialStatus = new THREE.MeshBasicMaterial({
      color: 0xff4d4d,
      opacity: 0.6,
      transparent: true
    })
    const meshStatus = new THREE.Mesh(geometryStatus, meterialStatus)
    meshStatus.position.x = px
    meshStatus.position.y = py
    meshStatus.position.z = pz
    meshStatus.name = config.name
    meshStatus.info = config
    scope.scene.add(meshStatus)
  }

  scope.scene.add(server)

  return server
}
/**
 * 服务器异常时的处理逻辑:
 * 1.机柜门打开
 * 2.服务器标红
 * 3.机柜顶部显示异常图标
 */
function handleStatus(serversInfo, cabinetInfo, cabinetMesh) {
  const text = document.createElement('div')
  text.className = 'label'
  text.innerHTML =
    cabinetInfo.name +
    '告警: <br/>' +
    serversInfo.name +
    '运行' +
    (serversInfo.deviceStatus ? '异常' : '正常') // 显示详细信息

  const label = new CSS2DObject(text)
  label.position.set(
    cabinetMesh.top.position.x - cabinetInfo.position.x + 100 / 2,
    cabinetMesh.top.position.y - cabinetInfo.position.y - 50,
    cabinetMesh.top.position.z - cabinetInfo.position.z
  )
  cabinetMesh.top.add(label)
}

/**
 * 绘制墙壁上的门洞，通过两个几何体相减得到的差集生成BSP对象
 */
function createResultBsp(scope, bsp, objectsCube, material) {
  let BSP = new ThreeBSP(bsp)
  for (var i = 0; i < objectsCube.length; i++) {
    const lessBsp = new ThreeBSP(objectsCube[i])
    BSP = BSP.subtract(lessBsp)
  }
  const result = BSP.toMesh(material)
  result.material.flatshading = THREE.FlatShading // 定义材质是否使用平面着色进行渲染
  result.geometry.computeFaceNormals() // 重新计算几何体侧面法向量
  result.geometry.computeVertexNormals()
  result.material.needsUpdate = true // 更新纹理
  result.geometry.buffersNeedUpdate = true
  result.geometry.uvsNeedUpdate = true
  scope.scene.add(result)
}
/**
 * 加载字体
 **/
function createText(cabinetInfo) {
  const width = 100
  const height = 40
  var canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  var ctx = canvas.getContext('2d')
  ctx.fillRect(0, 0, width, height)

  ctx.font = 20 + 'px " bold'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(cabinetInfo.name, width / 2, height / 2)
  return canvas
}
export {
  createBox,
  createCylinder,
  createPlane,
  createEmptyBox,
  createFloor,
  createWall,
  createDoor,
  createCabinet
}
