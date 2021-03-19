import { Notification } from 'element-ui'
import * as THREE from 'three'
const ThreeBSP = require('three-js-csg')(THREE)
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

import * as configConstant from '@/views/threejs/utils/configConstant'

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
 * @param objInitialData 用于建模的原始数据
 */
function createFloor(objInitialData) {
  const width = objInitialData.scale.width || 100
  const height = objInitialData.scale.height || 100
  const depth = objInitialData.scale.depth || 100
  const positionX = objInitialData.position.x || 0
  const positionY = objInitialData.position.y || 0
  const positionZ = objInitialData.position.z || 0
  const boxGeometry = new THREE.BoxGeometry(
    width,
    height || configConstant.FLOOR_THICK,
    depth
  )
  const url =
    configConstant.FILE_URL + objInitialData.style.skinWhole.skinImgUrl
  const material = new THREE.MeshLambertMaterial({
    color: objInitialData.style.skinWhole.skinColor || 0xffffff,
    map: createTexture(width, depth, true, true, url) // 颜色贴图
  })
  const model = new THREE.Mesh(boxGeometry, material)
  model.castShadow = true
  model.receiveShadow = true
  model.name = objInitialData.name
  model.info = objInitialData
  model.position.set(positionX, positionY, positionZ)
  return model
}

/**
 * 创建墙壁
 * @param objInitialData 用于建模的原始数据
 */
function createWall(objInitialData) {
  const width = objInitialData.scale.width || 100
  const height = objInitialData.scale.height || 100
  const depth = objInitialData.scale.depth || 100
  const positionX = objInitialData.position.x || 0
  const positionY = objInitialData.position.y || 0
  const positionZ = objInitialData.position.z || 0
  const boxGeometry = new THREE.BoxGeometry(
    width,
    height || configConstant.WALL_HEIGHT,
    depth || configConstant.WALL_THICK
  )
  const url =
    configConstant.FILE_URL + objInitialData.style.skinWhole.skinImgUrl
  const material = new THREE.MeshLambertMaterial({
    color: objInitialData.style.skinWhole.skinColor || 0xffffff,
    map: createTexture(height, width, true, true, url) // 颜色贴图
  })

  const model = new THREE.Mesh(boxGeometry, material)
  model.castShadow = true
  model.receiveShadow = true
  model.name = objInitialData.name
  model.info = objInitialData
  model.position.set(positionX, positionY, positionZ)

  if (
    objInitialData.rotation != null &&
    typeof objInitialData.rotation !== 'undefined' &&
    objInitialData.rotation.length > 0
  ) {
    for (let i = 0; i < objInitialData.rotation.length; i++) {
      const rotationObj = objInitialData.rotation[i]
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
 * @param objInitialData 用于建模的原始数据
 */
function createDoor(objInitialData) {
  const width = objInitialData.scale.width || 100
  const height = objInitialData.scale.height || 100
  const depth = objInitialData.scale.depth || 100
  const positionX = objInitialData.position.x || 0
  const positionY = objInitialData.position.y || 0
  const positionZ = objInitialData.position.z || 0
  const boxGeometry = new THREE.BoxGeometry(
    width,
    height || configConstant.WALL_HEIGHT - 30,
    depth || configConstant.WALL_THICK
  )
  const url =
    configConstant.FILE_URL + objInitialData.style.skinWhole.skinImgUrl
  const material = new THREE.MeshLambertMaterial({
    color: objInitialData.style.skinWhole.skinColor || 0xffffff,
    map: createTexture(width, height, false, false, url) // 颜色贴图
  })
  const model = new THREE.Mesh(boxGeometry, material)
  model.castShadow = true
  model.receiveShadow = true
  model.name = objInitialData.name
  model.info = objInitialData
  model.position.set(positionX, positionY, positionZ)

  if (
    objInitialData.rotation != null &&
    typeof objInitialData.rotation !== 'undefined' &&
    objInitialData.rotation.length > 0
  ) {
    for (let i = 0; i < objInitialData.rotation.length; i++) {
      const rotationObj = objInitialData.rotation[i]
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
 * @param objInitialData 用于建模的原始数据
 */
function createLines(objInitialData) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(
      objInitialData.source.x,
      objInitialData.source.y,
      objInitialData.source.z
    ),
    new THREE.Vector3(
      objInitialData.target.x,
      objInitialData.target.y,
      objInitialData.target.z
    )
  ])
  const points = curve.getPoints(50) // 将曲线划分成的段数
  const geometryLine = new THREE.BufferGeometry().setFromPoints(points)
  let materialLine = null
  if (
    objInitialData.style != null &&
    typeof objInitialData.style !== 'undefined'
  ) {
    materialLine = new THREE.LineBasicMaterial({
      color: objInitialData.style.color,
      linewidth: objInitialData.style.linewidth
    })
  } else {
    materialLine = new THREE.LineBasicMaterial({
      color: configConstant.DEVICE_COLOR,
      linewidth: 1
    })
  }
  const model = new THREE.Line(geometryLine, materialLine)
  model.name = objInitialData.name
  model.info = objInitialData
  if (
    objInitialData.position != null &&
    typeof objInitialData.position !== 'undefined'
  ) {
    model.position.set(
      objInitialData.position.x,
      objInitialData.position.y,
      objInitialData.position.z
    )
  }
  return model
}
/**
 * 创建圆柱模型
 * @param objInitialData 用于建模的原始数据
 */
function createCylinder(objInitialData) {
  const radiusTop = objInitialData.scale.radiusTop || 2 // 圆柱的顶部半径，默认值是1。
  const radiusBottom = objInitialData.scale.radiusBottom || 2 // 圆柱的底部半径，默认值是1。
  const height = objInitialData.scale.height || 5 // 圆柱的高度，默认值是1。

  const positionX = objInitialData.position.x || 0
  const positionY = objInitialData.position.y || 0
  const positionZ = objInitialData.position.z || 0

  const geometry = new THREE.CylinderGeometry(
    radiusTop,
    radiusBottom,
    height,
    32
  )
  const url =
    configConstant.FILE_URL + objInitialData.style.skinWhole.skinImgUrl
  const textureMap = createTexture(
    radiusTop,
    radiusBottom,
    objInitialData.style.skinWhole.repeatX,
    objInitialData.style.skinWhole.repeatY,
    url
  ) // 颜色贴图
  const material = new THREE.MeshLambertMaterial({
    color: objInitialData.style.skinWhole.skinColor || 0xffffff
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
  model.name = objInitialData.name
  model.info = objInitialData
  model.position.set(positionX, positionY, positionZ)
  if (
    objInitialData.rotation != null &&
    typeof objInitialData.rotation !== 'undefined' &&
    objInitialData.rotation.length > 0
  ) {
    for (let i = 0; i < objInitialData.rotation.length; i++) {
      const rotationObj = objInitialData.rotation[i]
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
 * @param objInitialData 用于建模的原始数据
 */
function createCabinet(objInitialData) {
  const width = objInitialData.scale.width || 100
  const height = objInitialData.scale.height || 100
  const depth = objInitialData.scale.depth || 100
  const positionX = objInitialData.position.x || 0
  const positionY = objInitialData.position.y || 0
  const positionZ = objInitialData.position.z || 0
  const mapBack = textureLoader.load(
    configConstant.FILE_URL + 'rack_door_back.jpg'
  )
  const materialBack = new THREE.MeshLambertMaterial({
    map: mapBack
  })
  const fontC = createText({
    text: objInitialData.name,
    textWidth: 100,
    textHeight: 40,
    textSize: 20,
    textColor: '#ffffff'
  })
  const materialTexture = new THREE.MeshLambertMaterial({
    map: new THREE.CanvasTexture(fontC) // canvas贴图
  })
  // 创建机柜组对象
  const cabinetGroup = new THREE.Group()
  // cabinetGroup的平面中心是机柜主体的平面中心
  // cabinetGroup.position.set(positionX, positionY, positionZ)
  cabinetGroup.name = objInitialData.name
  cabinetGroup.info = objInitialData

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
  topModel.name = objInitialData.name + '柜体top'
  topModel.position.set(positionX + width, positionY + height, positionZ)
  // 机柜底部盒子
  const bottomGeometry = new THREE.BoxBufferGeometry(
    width,
    configConstant.CABINET_THICK,
    depth
  )
  const bottomModel = new THREE.Mesh(bottomGeometry, materialBack)
  bottomModel.name = objInitialData.name + '柜体bottom'
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
  leftModel.name = objInitialData.name + '柜体left'
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
  rightModel.name = objInitialData.name + '柜体right'
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
  backModel.name = objInitialData.name + '柜体back'
  backModel.position.set(
    positionX + width,
    positionY + height / 2 + configConstant.CABINET_THICK / 2,
    positionZ - depth / 2 - configConstant.CABINET_THICK / 2
  )
  cabinetGroup.add(topModel, bottomModel, leftModel, rightModel, backModel)

  if (objInitialData.door.isDoor) {
    // 创建机柜门
    const doorModel = createCabinetDoor(
      materialBack,
      positionX,
      positionY,
      positionZ,
      objInitialData
    )
    cabinetGroup.add(doorModel)
  }
  if (objInitialData.servers && objInitialData.servers.length > 0) {
    for (let i = 0; i < objInitialData.servers.length; i++) {
      const item = objInitialData.servers[i]
      // 创建服务器
      const serversModel = createServer(
        item,
        positionX,
        positionY,
        positionZ,
        objInitialData
      )
      cabinetGroup.add(serversModel)
      // 如果服务器报警标红，则机柜标红
      handleWarningC(serversModel, item)
    }
  }
  return cabinetGroup
}

/**
 * 创建服务器模型
 * @param objInitialData 服务器模型数据
 * @param parentPosX 父机柜已计算好的x轴坐标
 * @param parentPosY 父机柜已计算好的y轴坐标
 * @param parentPosZ 父机柜已计算好的z轴坐标
 */
function createServer(objInitialData, parentPosX, parentPosY, parentPosZ) {
  // 创建服务器
  const serversGeometry = new THREE.BoxBufferGeometry(
    objInitialData.scale.width,
    objInitialData.scale.height,
    objInitialData.scale.depth
  )
  const color = !objInitialData.deviceStatus
    ? 0xbbbbbb
    : configConstant.DEVICE_COLOR
  const opacity = !objInitialData.deviceStatus ? 1 : 0.9
  const transparent = objInitialData.deviceStatus
  const materialBasic = new THREE.MeshLambertMaterial({
    color: color,
    opacity: opacity,
    transparent: transparent
  })
  const materialServeBack = new THREE.MeshLambertMaterial({
    color: color,
    opacity: opacity,
    transparent: transparent,
    map: textureLoader.load(configConstant.FILE_URL + '2.jpg')
  })
  const materialServeFront = new THREE.MeshLambertMaterial({
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
  serversModel.name = objInitialData.name
  serversModel.info = objInitialData
  // 服务器的位置都是相对机柜的，先得出机柜的位置，然后计算服务器在机柜内部的位置
  const cabinetPosX =
    parentPosX + objInitialData.scale.width + configConstant.CABINET_THICK / 2
  const cabinetPosY =
    parentPosY + objInitialData.scale.height / 2 + configConstant.CABINET_THICK
  const cabinetPosZ = parentPosZ
  serversModel.position.set(
    cabinetPosX + objInitialData.position.x,
    cabinetPosY + 10 + objInitialData.position.y, // 每个服务器之间有一个10间隙
    cabinetPosZ + objInitialData.position.z
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
 */
function createCabinetDoor(
  materialDoorBack,
  parentPosX,
  parentPosY,
  parentPosZ,
  parentObj
) {
  const mapFront = textureLoader.load(
    configConstant.FILE_URL + 'rack_door_front.jpg'
  )
  const materialFront = new THREE.MeshLambertMaterial({
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
  doorModel.name = parentObj.name + '柜体doorFront'
  doorModel.position.set(
    parentPosX + parentObj.scale.width,
    parentPosY + parentObj.scale.height / 2 + configConstant.CABINET_THICK / 2,
    parentPosZ + parentObj.scale.depth / 2 + configConstant.CABINET_THICK / 2
  )
  return doorModel
}
/**
 * 服务器异常时的处理逻辑:
 * 1.如果服务器异常报警，服务器本身标红；
 * 2.装该服务器的机柜标红；
 * 3.机柜顶部显示异常图标,先带有闪烁动画。
 * @param serversModel 服务器模型数据
 * @param objInitialData 服务器模型原始数据
 */
function handleWarningC(serversModel, objInitialData) {
  // 如果服务器是正常的则不往下执行了
  if (!serversModel.info.deviceStatus) {
    return false
  }
  // 通过服务器模型的父parent遍历其可见的后代模型
  serversModel.parent.traverseVisible((child) => {
    // 用于检查这个类或者其派生类是否为网格
    if (child.isMesh) {
      // 找出符合条件的机柜柜体（包括门总共有6个，事先在创建模型时，为每一个柜体模型手动添加了同类型的name），服务器也是父parent的后代，需要排除
      if (child.name.includes('柜体')) {
        if (Array.isArray(child.material) && child.material.length > 0) {
          child.material.map((item) => {
            // 要使用setHex()才能把颜色改掉，不能直接使用set方法()
            item.color.setHex(configConstant.DEVICE_COLOR)
          })
        } else {
          child.material.color.setHex(configConstant.DEVICE_COLOR)
        }
        child.material.needsUpdate = true // 更新纹理
      }
    }
  })
  addLabelForCabinet(serversModel.parent, serversModel)
}
/**
 * 机柜顶部显示异常图标,先带有闪烁动画
 */
function addLabelForCabinet(cabinetModel, serversModel) {
  // const text = document.createElement('div')
  // text.className = 'label'
  // text.innerHTML = '!'
  // // cabinetModel.name +
  // //   '告警: <br/>' +
  // //   serversModel.name +
  // //   '运行异常'// 显示详细信息

  // const label = new CSS2DObject(text)
  // label.position.set(
  //   cabinetModel.position.x + cabinetModel.info.scale.width * 2,
  //   cabinetModel.position.y + cabinetModel.info.scale.height / 2,
  //   cabinetModel.position.z - cabinetModel.info.scale.depth * 2
  // )
  // cabinetModel.add(label)

  // 生成CanvasTexture纹理
  const geometry1 = new THREE.CircleGeometry(15, 30)
  const fontC = createText({
    text: '!',
    textBgColor: '#e6a23c',
    textWidth: 100,
    textHeight: 40,
    textSize: 20,
    textColor: '#ffffff'
  })
  const material = new THREE.MeshLambertMaterial({
    map: new THREE.CanvasTexture(fontC),
    side: THREE.DoubleSide,
    opacity: 1,
    transparent: true
  })

  const rect = new THREE.Mesh(geometry1, material)
  rect.position.set(
    cabinetModel.position.x + cabinetModel.info.scale.width * 2 - 11,
    cabinetModel.position.y + cabinetModel.info.scale.height + 30,
    cabinetModel.position.z + cabinetModel.info.scale.depth / 2
  )
  cabinetModel.add(rect)
  Notification.warning({
    title: cabinetModel.name + '告警',
    message: serversModel.name + '运行异常'
  })
}
/**
 * 加载字体
 * @param textOption 字体基本配置
 **/
function createText(textOption) {
  var canvas = document.createElement('canvas')
  canvas.width = textOption.textWidth || 40
  canvas.height = textOption.textHeight || 40

  var ctx = canvas.getContext('2d')
  // 背景颜色
  ctx.fillStyle = textOption.textBgColor || '#000000'
  ctx.fillRect(0, 0, textOption.textWidth, textOption.textHeight)

  ctx.font = (textOption.textSize || 20) + 'px " bold'
  // 字体颜色
  ctx.fillStyle = textOption.textColor || '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(
    textOption.text,
    textOption.textWidth / 2,
    textOption.textHeight / 2
  )
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
