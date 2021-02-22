// 机房各模型数据,定义机柜、服务器数据
export const objectModel = [
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
          name: '1-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: ''
        },
        {
          uuid: '12',
          id: 12,
          name: '1-2号服务器',
          ip: '',
          apps: '',
          skinImgurl: '',
          deviceStatus: 1 // 0正常  1异常
        },
        {
          uuid: '13',
          id: 13,
          name: '1-3号服务器',
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
          uuid: '21',
          id: 21,
          name: '2-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: ''
        },
        {
          uuid: '22',
          id: 21,
          name: '2-2号服务器',
          ip: '',
          apps: '',
          skinImgurl: ''
        },
        {
          uuid: '23',
          id: 23,
          name: '2-3号服务器',
          ip: '',
          apps: '',
          skinImgurl: ''
        },
        {
          uuid: '24',
          id: 24,
          name: '2-4号服务器',
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
          name: '3-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: '/source/textures/computer/3.jpg',
          deviceStatus: 1 // 0正常  1异常
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
          name: '4-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: '/source/textures/computer/3.jpg'
        }
      ]
    }
  },
  {
    cabinet: {
      uuid: '5',
      id: 5,
      name: '5号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸
      position: { x: -150, y: 0, z: 0 }, // 位置
      servers: [
        {
          uuid: '51',
          id: 51,
          name: '5-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: '/source/textures/computer/3.jpg'
        }
      ]
    }
  },
  {
    cabinet: {
      uuid: '6',
      id: 6,
      name: '6号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
      position: { x: -50, y: 0, z: -110 }, // 位置
      servers: [
        {
          uuid: '61',
          id: 61,
          name: '6-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: '/source/textures/computer/3.jpg'
        }
      ]
    }
  },
  {
    cabinet: {
      uuid: '7',
      id: 7,
      name: '7号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
      position: { x: -100, y: 0, z: -110 }, // 位置
      servers: [
        {
          uuid: '71',
          id: 71,
          name: '7-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: '/source/textures/computer/3.jpg'
        }
      ]
    }
  },
  {
    cabinet: {
      uuid: '8',
      id: 8,
      name: '8号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
      position: { x: -150, y: 0, z: -110 }, // 位置
      servers: [
        {
          uuid: '81',
          id: 81,
          name: '8-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: '/source/textures/computer/3.jpg'
        }
      ]
    }
  }
]

// 机房操作按钮
export const btns = [
  {
    btnId: 'btnReset',
    btnTitle: '场景复位',
    btnIcon: 'el-icon-refresh-left',
    event: function() {}
  },
  {
    btnId: 'btnAlarm',
    btnTitle: '告警',
    btnIcon: 'el-icon-warning',
    event: function() {}
  },
  {
    btnId: 'btnUsage',
    btnTitle: '烟雾模拟',
    btnIcon: 'el-icon-smoking',
    event: function() {}
  },
  {
    btnId: 'btnAlarm',
    btnTitle: '巡检',
    btnIcon: 'el-icon-map-location',
    event: function() {
      // var mainCamera = msj3DObj.commonFunc.findObject('mainCamera') //主摄像机
      // var doorRight = msj3DObj.commonFunc.findObject('doorRight')
      // mainCamera.lookAt(doorRight.position)
      // new createjs.Tween(mainCamera.position)
      //   .to(
      //     {
      //       x: -300,
      //       y: 200,
      //       z: -700
      //     },
      //     5000,
      //     createjs.Ease.linear
      //   )
      //   .call(function() {
      //     openRightDoor(
      //       msj3DObj.commonFunc.findObject('doorRight'),
      //       function() {
      //         var cabinet3_1 = msj3DObj.commonFunc.findObject(
      //           'cabinet3_1'
      //         )
      //         mainCamera.lookAt(cabinet3_1.position)
      //         new createjs.Tween(mainCamera.position)
      //           .to(
      //             {
      //               x: -300,
      //               y: 150,
      //               z: -200
      //             },
      //             5000,
      //             createjs.Ease.linear
      //           )
      //           .call(function() {
      //             mainCamera.lookAt(cabinet3_1.position)
      //           })
      //       }
      //     )
      //   })
    }
  },
  {
    btnId: 'btnConnection',
    btnTitle: '走线管理',
    btnIcon: 'el-icon-s-operation',
    event: function() {
      console.info('qqq')
    }
  }
]
