import {
  Group
} from '@tweenjs/tween.js'
import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)
import {
  TWEEN
} from 'three/examples/jsm/libs/tween.module.min.js'
import {
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

import * as configConstant from '@/views/threejs/utils/configConstant'

// 用于生成uuid
function S4() {
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
}
export function guid() {
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

const textureLoader = new THREE.TextureLoader()
/**
 * 创建纹理贴图
 * @param width 物体尺寸
 * @param depth 物体尺寸
 * @param repeatBaseX 纹理U方向重复的基础单位
 * @param repeatBaseY 纹理V方向重复的基础单位
 * @param skinImgUrl 纹理贴图路径
 */
function createTexture(width, depth, repeatX, repeatY, skinImgUrl) {
  const base = 128
  const repeatWidthNum = width / base
  const repeatHeightNum = depth / base
  const texture = textureLoader.load(skinImgUrl)
  let repeat = false
  if (repeatX) {
    // 设置阵列模式   默认ClampToEdgeWrapping  RepeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
    texture.wrapS = THREE.RepeatWrapping
    repeat = true
  } else {
    texture.wrapS = THREE.ClampToEdgeWrapping
    repeat = false
  }
  if (repeatY) {
    // 设置阵列模式   默认ClampToEdgeWrapping  RepeatWrapping：阵列  镜像阵列：MirroredRepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    repeat = true
  } else {
    texture.wrapT = THREE.ClampToEdgeWrapping
    repeat = false
  }
  if (repeat) {
    // uv两个方向纹理重复数量
    texture.repeat.set(repeatHeightNum, repeatWidthNum)
  }
  return texture
}
/**
 * 创建地板，并贴图
 */
function createFloor(obj) {
  const width = obj.scale.width || 100
  const height = obj.scale.height || 100
  const depth = obj.scale.depth || 100
  const positionX = obj.position.x || 0
  const positionY = obj.position.y || 0
  const positionZ = obj.position.z || 0
  const boxGeometry = new THREE.BoxGeometry(
    width,
    height || configConstant.FLOOR_THICK,
    depth
  )
  const url = configConstant.FILE_URL + obj.style.skinWhole.skinImgUrl
  const material = new THREE.MeshLambertMaterial({
    color: obj.style.skinWhole.skinColor || 0xffffff,
    map: createTexture(width, depth, true, true, url) // 颜色贴图
  })
  const model = new THREE.Mesh(boxGeometry, material)
  model.castShadow = true
  model.receiveShadow = true
  model.uuid = obj.uuid
  model.name = obj.name
  model.data = obj
  model.position.set(positionX, positionY, positionZ)
  return model
}

/**
 * 创建墙壁
 */
function createWall(obj) {
  const width = obj.scale.width || 100
  const height = obj.scale.height || 100
  const depth = obj.scale.depth || 100
  const positionX = obj.position.x || 0
  const positionY = obj.position.y || 0
  const positionZ = obj.position.z || 0
  const boxGeometry = new THREE.BoxGeometry(
    width,
    height || configConstant.WALL_HEIGHT,
    depth || configConstant.WALL_THICK
  )
  const url = configConstant.FILE_URL + obj.style.skinWhole.skinImgUrl
  const material = new THREE.MeshLambertMaterial({
    color: obj.style.skinWhole.skinColor || 0xffffff,
    map: createTexture(height, width, true, true, url) // 颜色贴图
  })

  const model = new THREE.Mesh(boxGeometry, material)
  model.castShadow = true
  model.receiveShadow = true
  model.uuid = obj.uuid
  model.name = obj.name
  model.data = obj
  model.position.set(positionX, positionY, positionZ)

  if (
    obj.rotation != null &&
    typeof obj.rotation !== 'undefined' &&
    obj.rotation.length > 0
  ) {
    for (let i = 0; i < obj.rotation.length; i++) {
      const rotationObj = obj.rotation[i]
      switch (rotationObj.direction) {
        case 'x':
          model.rotateX(rotationObj.degree)
          break
        case 'y':
          model.rotateY(rotationObj.degree)
          break
        case 'z':
          model.rotateZ(rotationObj.degree)
          break
        case 'arb':
          model.rotateOnAxis(
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
  return model
}

/**
 * TODO 使用了ThreeBSP之后控制台报警告:THREE.Matrix4: .getInverse() has been removed. Use matrixInv.copy( matrix ).invert(); instead.
 * 模型运算
 * @param bsp 几何体
 * @param objectsCube 几何体
 * @param material 材料
 */
function modelBsp(bsp, objectsCube, material) {
  let BSP = new ThreeBSP(bsp)
  for (var i = 0; i < objectsCube.length; i++) {
    const lessBsp = new ThreeBSP(objectsCube[i])
    BSP = BSP.subtract(lessBsp) // 使用该函数可以在第一个几何体中移除两个几何体重叠的部分来创建新的几何体。
  }
  const result = BSP.toMesh(material)
  result.material.flatshading = true // 定义材质是否使用平面着色进行渲染
  result.geometry.computeFaceNormals() // 重新计算几何体侧面法向量
  result.geometry.computeVertexNormals()
  result.material.needsUpdate = true // 更新纹理
  result.geometry.buffersNeedUpdate = true
  result.geometry.uvsNeedUpdate = true
  return result
}

/**
 * 绘制房门
 */
function createDoor(obj) {
  const width = obj.scale.width || 100
  const height = obj.scale.height || 100
  const depth = obj.scale.depth || 100
  const positionX = obj.position.x || 0
  const positionY = obj.position.y || 0
  const positionZ = obj.position.z || 0
  const boxGeometry = new THREE.BoxGeometry(
    width,
    height || configConstant.WALL_HEIGHT - 30,
    depth || configConstant.WALL_THICK
  )
  const url = configConstant.FILE_URL + obj.style.skinWhole.skinImgUrl
  const material = new THREE.MeshLambertMaterial({
    color: obj.style.skinWhole.skinColor || 0xffffff,
    map: createTexture(width, height, false, false, url) // 颜色贴图
  })
  const model = new THREE.Mesh(boxGeometry, material)
  model.castShadow = true
  model.receiveShadow = true
  model.uuid = obj.uuid
  model.name = obj.name
  model.data = obj
  model.position.set(positionX, positionY, positionZ)

  if (
    obj.rotation != null &&
    typeof obj.rotation !== 'undefined' &&
    obj.rotation.length > 0
  ) {
    for (let i = 0; i < obj.rotation.length; i++) {
      const rotationObj = obj.rotation[i]
      switch (rotationObj.direction) {
        case 'x':
          model.rotateX(rotationObj.degree)
          break
        case 'y':
          model.rotateY(rotationObj.degree)
          break
        case 'z':
          model.rotateZ(rotationObj.degree)
          break
        case 'arb':
          model.rotateOnAxis(
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
  return model
}
/**
 * 创建线模型
 */
function createLines(obj) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(obj.source.x, obj.source.y, obj.source.z),
    new THREE.Vector3(obj.target.x, obj.target.y, obj.target.z)
  ])
  const points = curve.getPoints(50) // 将曲线划分成的段数
  const geometryLine = new THREE.BufferGeometry().setFromPoints(points)
  let materialLine = null
  if (obj.style != null && typeof obj.style !== 'undefined') {
    materialLine = new THREE.LineBasicMaterial({
      color: obj.style.color,
      linewidth: obj.style.linewidth
    })
  } else {
    materialLine = new THREE.LineBasicMaterial({
      color: 0xff0000,
      linewidth: 1
    })
  }
  const model = new THREE.Line(geometryLine, materialLine)
  model.name = obj.name
  model.data = obj
  if (obj.position != null && typeof obj.position !== 'undefined') {
    model.position.set(obj.position.x, obj.position.y, obj.position.z)
  }
  return model
}
/**
 * 创建圆柱模型
 */
function createCylinder(obj) {
  const radiusTop = obj.scale.radiusTop || 2 // 圆柱的顶部半径，默认值是1。
  const radiusBottom = obj.scale.radiusBottom || 2 // 圆柱的底部半径，默认值是1。
  const height = obj.scale.height || 5 // 圆柱的高度，默认值是1。

  const positionX = obj.position.x || 0
  const positionY = obj.position.y || 0
  const positionZ = obj.position.z || 0

  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    32
  )
  const url = configConstant.FILE_URL + obj.style.skinWhole.skinImgUrl
  const textureMap = createTexture(
    radiusTop,
    radiusBottom,
    obj.style.skinWhole.repeatX,
    obj.style.skinWhole.repeatY,
    url
  ) // 颜色贴图
  const material = new THREE.MeshLambertMaterial({
    color: obj.style.skinWhole.skinColor || 0xffffff
  })

  const materialArray = []
  materialArray.push(material)
  materialArray.push(
    new THREE.MeshLambertMaterial({
      map: textureMap
    })
  )
  materialArray.push(material)

  const model = new THREE.Mesh(geometry, materialArray)
  model.castShadow = true
  model.receiveShadow = true
  model.uuid = obj.uuid
  model.name = obj.name
  model.data = obj
  model.position.set(positionX, positionY, positionZ)
  if (
    obj.rotation != null &&
    typeof obj.rotation !== 'undefined' &&
    obj.rotation.length > 0
  ) {
    for (let i = 0; i < obj.rotation.length; i++) {
      const rotationObj = obj.rotation[i]
      switch (rotationObj.direction) {
        case 'x':
          model.rotateX(rotationObj.degree)
          break
        case 'y':
          model.rotateY(rotationObj.degree)
          break
        case 'z':
          model.rotateZ(rotationObj.degree)
          break
        case 'arb':
          model.rotateOnAxis(
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
  return model
}
/**
 * 绘制机柜
 */
function createCabinet(obj) {
  const width = obj.scale.width || 100
  const height = obj.scale.height || 100
  const depth = obj.scale.depth || 100
  const positionX = obj.position.x || 0
  const positionY = obj.position.y || 0
  const positionZ = obj.position.z || 0
  const mapBack = textureLoader.load(
    configConstant.FILE_URL + 'rack_door_back.jpg'
  )
  const materialBack = new THREE.MeshBasicMaterial({
    map: mapBack
  })
  const materialTexture = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(createText(obj.name)) // canvas贴图
  })
  // 创建机柜组对象
  const cabinetGroup = new THREE.Group()
  // cabGroup的平面中心是机柜主体的平面中心
  // cabGroup.position.set(positionX, positionY, positionZ)
  cabinetGroup.name = obj.name // 'cabinetGroup'

  // 机柜顶部盒子
  const topGeometry = new THREE.BoxBufferGeometry(
    width,
    configConstant.CABINET_THICK,
    depth
  )
  const materialTopArr = []
  materialTopArr.push(
    materialBack,
    materialBack,
    materialTexture,
    materialBack,
    materialBack,
    materialBack
  )
  const topModel = new THREE.Mesh(topGeometry, materialTopArr)
  topModel.name = obj.name + 'top'
  topModel.position.set(positionX + width, positionY + height, positionZ)
  // 机柜底部盒子
  const bottomGeometry = new THREE.BoxBufferGeometry(
    width,
    configConstant.CABINET_THICK,
    depth
  )
  const bottomModel = new THREE.Mesh(bottomGeometry, materialBack)
  bottomModel.name = obj.name + 'bottom'
  bottomModel.position.set(
    positionX + width,
    positionY + configConstant.CABINET_THICK,
    positionZ
  )
  // 机柜左边盒子
  const leftGeometry = new THREE.BoxBufferGeometry(
    depth,
    height,
    configConstant.CABINET_THICK
  )
  const leftModel = new THREE.Mesh(leftGeometry, materialBack)
  leftModel.name = obj.name + 'left'
  leftGeometry.rotateY(0.5 * Math.PI)
  leftModel.position.set(
    positionX + width / 2 - configConstant.CABINET_THICK / 2,
    positionY + height / 2 + configConstant.CABINET_THICK / 2,
    positionZ
  )
  // 机柜右边盒子
  const rightGeometry = new THREE.BoxBufferGeometry(
    depth,
    height,
    configConstant.CABINET_THICK
  )
  const rightModel = new THREE.Mesh(rightGeometry, materialBack)
  rightModel.name = obj.name + 'right'
  rightModel.rotateY(0.5 * Math.PI)
  rightModel.position.set(
    positionX + width + width / 2 + configConstant.CABINET_THICK / 2,
    positionY + height / 2 + configConstant.CABINET_THICK / 2,
    positionZ
  )
  // 机柜后面盒子
  const backGeometry = new THREE.BoxBufferGeometry(
    width, // + 2 * configConstant.CABINET_THICK, // 加上后会重叠闪烁
    height,
    configConstant.CABINET_THICK
  )
  const backModel = new THREE.Mesh(backGeometry, materialBack)
  backModel.name = obj.name + 'back'
  backModel.position.set(
    positionX + width,
    positionY + height / 2 + configConstant.CABINET_THICK / 2,
    positionZ - depth / 2 - configConstant.CABINET_THICK / 2
  )
  cabinetGroup.add(topModel, bottomModel, leftModel, rightModel, backModel)

  if (obj.door.isDoor) {
    // 创建机柜门
    const doorModel = createCabinetDoor(materialBack, positionX, positionY, positionZ, obj)
    cabinetGroup.add(doorModel)
  }
  if (obj.servers && obj.servers.length > 0) {
    for (let i = 0; i < obj.servers.length; i++) {
      const item = obj.servers[i]
      // 创建服务器
      const serversModel = createServer(item, positionX, positionY, positionZ, obj)
      cabinetGroup.add(serversModel)
      // 如果服务器报警标红，则机柜标红
      handleWarningC(serversModel, item)
    }
  }
  cabinetGroup.data = obj
  return cabinetGroup
}

/**
 * 创建服务器模型
 * @param obj 服务器模型数据
 * @param parentPosX 父机柜已计算好的x轴坐标
 * @param parentPosY 父机柜已计算好的y轴坐标
 * @param parentPosZ 父机柜已计算好的z轴坐标
 * @param parentObj  装服务器的父机柜模型数据
 **/
function createServer(obj, parentPosX, parentPosY, parentPosZ, parentObj) {
  // 创建服务器
  const serversGeometry = new THREE.BoxBufferGeometry(
    obj.scale.width,
    obj.scale.height,
    obj.scale.depth
  )
  const color = obj.deviceStatus ? 0xbbbbbb : 0xff0000
  const opacity = obj.deviceStatus ? 1 : 0.6
  const transparent = !obj.deviceStatus
  const materialBasic = new THREE.MeshBasicMaterial({
    color: color,
    opacity: opacity,
    transparent: transparent
  })
  const materialServeBack = new THREE.MeshBasicMaterial({
    color: color,
    opacity: opacity,
    transparent: transparent,
    map: textureLoader.load(configConstant.FILE_URL + '2.jpg')
  })
  const materialServeFront = new THREE.MeshBasicMaterial({
    color: color,
    opacity: opacity,
    transparent: transparent,
    map: textureLoader.load(configConstant.FILE_URL + '4.jpg')
  })

  const materialServersArr = []
  materialServersArr.push(
    materialBasic,
    materialBasic,
    materialBasic,
    materialBasic,
    materialServeFront,
    materialServeBack
  )
  const serversModel = new THREE.Mesh(serversGeometry, materialServersArr)
  serversModel.name = parentObj.name + obj.name
  serversModel.data = obj
  // 服务器的位置都是相对机柜的，先得出机柜的位置，然后计算服务器在机柜内部的位置
  const cabinetPosX = parentPosX + obj.scale.width + configConstant.CABINET_THICK / 2
  const cabinetPosY = parentPosY + obj.scale.height / 2 + configConstant.CABINET_THICK
  const cabinetPosZ = parentPosZ
  serversModel.position.set(
    cabinetPosX + obj.position.x,
    cabinetPosY + 10 + obj.position.y, // 每个服务器之间有一个10间隙
    cabinetPosZ + obj.position.z
  )
  return serversModel
}
/**
 * 创建机柜门模型
 * @param materialDoorBack 门的前面的材质
 * @param parentPosX 父机柜已计算好的x轴坐标
 * @param parentPosY 父机柜已计算好的y轴坐标
 * @param parentPosZ 父机柜已计算好的z轴坐标
 * @param parentObj  装服务器的父机柜模型数据
 **/
function createCabinetDoor(materialDoorBack, parentPosX, parentPosY, parentPosZ, parentObj) {
  const mapFront = textureLoader.load(
    configConstant.FILE_URL + 'rack_door_front.jpg'
  )
  const materialFront = new THREE.MeshBasicMaterial({
    map: mapFront
  })
  const doorGeometry = new THREE.BoxBufferGeometry(
    parentObj.scale.width, // + 2 * configConstant.CABINET_THICK, // 加上后会重叠闪烁
    parentObj.scale.height,
    configConstant.CABINET_THICK
  )
  const materialDoorArr = []
  materialDoorArr.push(
    materialDoorBack,
    materialDoorBack,
    materialDoorBack,
    materialDoorBack,
    materialFront,
    materialDoorBack
  )
  const doorModel = new THREE.Mesh(doorGeometry, materialDoorArr)
  doorModel.name = parentObj.name + 'doorFront'
  doorModel.position.set(
    parentPosX + parentObj.scale.width,
    parentPosY + parentObj.scale.height / 2 + configConstant.CABINET_THICK / 2,
    parentPosZ + parentObj.scale.depth / 2 + configConstant.CABINET_THICK / 2
  )
  return doorModel
}
// TODO 如果服务器报警标红，则机柜标红
function handleWarningC(serversModel, objData) {
  // serversModel.parent
  if (objData.deviceStatus) {
    return
  }
  serversModel.parent.traverse(child => {
    if (child.isMesh) {
      // const childC = child.clone()
      // childC.material.color.set('0xff0000')
      // childC.material.transparent = !objData.deviceStatus
      // childC.material.opacity = 0.6
      // childC.material.needsUpdate = true // 更新纹理
    }
  })
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
  label.position.x = cabinetInfo.position.x + cabinetInfo.size.w
  label.position.y = cabinetInfo.position.y + cabinetInfo.size.h
  // label.position.set(
  //   cabinetInfo.position.x,
  //   cabinetMesh.position.y + cabinetInfo.size.h,
  //   cabinetMesh.position.z
  // )
  // console.info('po', label.position)
  cabinetMesh.add(label)
}
/**
 * 加载字体
 **/
function createText(text) {
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
  ctx.fillText(text, width / 2, height / 2)
  return canvas
}
/**
 * 创建盒子模型
 */
function createBox(obj) {
  const width = obj.scale.width || 100
  const height = obj.scale.height || 100
  const depth = obj.scale.depth || 100
  const positionX = obj.position.x || 0
  const positionY = obj.position.y || 0
  const positionZ = obj.position.z || 0
  // const boxBufferGeometry = new THREE.BoxBufferGeometry(width, height, depth)

  // MeshStandardMaterial
  const boxGeometry = new THREE.BoxGeometry(width, height, depth)
  let skinColor = 0x98750f
  let boxMaterial = new THREE.MeshLambertMaterial({
    color: skinColor
  })
  let mapWhole = boxMaterial

  let materialTop = boxMaterial
  let materialBottom = boxMaterial
  let materialFront = boxMaterial
  let materialBack = boxMaterial
  let materialLeft = boxMaterial
  let materialRight = boxMaterial
  if (obj.style != null && typeof obj.style !== 'undefined') {
    if (
      obj.style.skinWhole !== null &&
      typeof obj.style.skinWhole !== 'undefined'
    ) {
      // 所有面一起配置
      skinColor = obj.style.skinWhole.skinColor
      // 所有面一样的纹理
      mapWhole = new THREE.MeshLambertMaterial({
        color: skinColor,
        map: textureLoader.load(
          configConstant.FILE_URL + obj.style.skinWhole.skinImgUrl
        )
      })
      boxMaterial = mapWhole
    } else if (
      obj.style.skinFace !== null &&
      typeof obj.style.skinFace !== 'undefined'
    ) {
      // 可单面配置
      // 立方体的顶部
      materialTop = new THREE.MeshLambertMaterial({
        color: obj.style.skinFace.up.skinColor,
        map: textureLoader.load(
          configConstant.FILE_URL + obj.style.skinFace.top.skinImgUrl
        )
      })
      // 立方体的底部
      materialBottom = new THREE.MeshLambertMaterial({
        color: obj.style.skinFace.bottom.skinColor,
        map: textureLoader.load(
          configConstant.FILE_URL + obj.style.skinFace.bottom.skinImgUrl
        )
      })
      // 立方体的前面
      materialFront = new THREE.MeshLambertMaterial({
        color: obj.style.skinFace.front.skinColor,
        map: textureLoader.load(
          configConstant.FILE_URL + obj.style.skinFace.front.skinImgUrl
        )
      })
      // 立方体的后面
      materialBack = new THREE.MeshLambertMaterial({
        color: obj.style.skinFace.back.skinColor,
        map: textureLoader.load(
          configConstant.FILE_URL + obj.style.skinFace.back.skinImgUrl
        )
      })
      // 立方体的左边
      materialLeft = new THREE.MeshLambertMaterial({
        color: obj.style.skinFace.left.skinColor,
        map: textureLoader.load(
          configConstant.FILE_URL + obj.style.skinFace.left.skinImgUrl
        )
      })
      // 立方体的右边
      materialRight = new THREE.MeshLambertMaterial({
        color: obj.style.skinFace.right.skinColor,
        map: textureLoader.load(
          configConstant.FILE_URL + obj.style.skinFace.right.skinImgUrl
        )
      })
      const boxMaterialArray = []
      boxMaterialArray.push(new THREE.MeshLambertMaterial(materialFront))
      boxMaterialArray.push(new THREE.MeshLambertMaterial(materialBack))
      boxMaterialArray.push(new THREE.MeshLambertMaterial(materialTop))
      boxMaterialArray.push(new THREE.MeshLambertMaterial(materialBottom))
      boxMaterialArray.push(new THREE.MeshLambertMaterial(materialRight))
      boxMaterialArray.push(new THREE.MeshLambertMaterial(materialLeft))
      boxMaterial = boxMaterialArray
    }
  }

  const box = new THREE.Mesh(boxGeometry, boxMaterial)
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
export {
  createBox,
  createCylinder,
  createFloor,
  createWall,
  createDoor,
  createCabinet,
  createLines,
  modelBsp
}
