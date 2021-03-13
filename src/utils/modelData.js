// 机房各模型数据,定义机柜、服务器数据
export const objectModel = [
  // 地板
  // {
  //   show: true,
  //   id: 'floor1',
  //   name: 'floor',
  //   type: 'box',
  //   size: { length: 2000, width: 1600, height: 10 }, // 尺寸
  //   position: { x: 0, y: 0, z: 0 }, // 位置
  //   rotation: [{ direction: 'x', degree: 0 }], // 旋转 表示x方向0度
  //   style: {
  //     skinColor: 0x8ac9e2,
  //     skin: {
  //       skinUp: {
  //         skinColor: 0x98750f,
  //         imgurl: 'floor/floorMy.png',
  //         repeatx: true,
  //         repeaty: true,
  //         width: 128,
  //         height: 128
  //       },
  //       skinDown: {
  //         skinColor: 0x8ac9e2
  //       },
  //       skinFore: {
  //         skinColor: 0x8ac9e2
  //       }
  //     }
  //   }
  // },

  // // 墙体
  // {
  //   show: true,
  //   uuid: 'wall1',
  //   name: 'wall',
  //   objType: 'wall',
  //   thick: 20,
  //   length: 100,
  //   height: 240,
  //   wallData: [
  //     {
  //       //wall1
  //       uuid: '',
  //       name: 'wall1',
  //       thick: 20,
  //       height: 240,
  //       skin: {
  //         skin_up: {
  //           skinColor: 0xdddddd
  //         },
  //         skin_down: {
  //           skinColor: 0xdddddd
  //         },
  //         skin_fore: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_behind: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_left: {
  //           skinColor: 0xdeeeee
  //         },
  //         skin_right: {
  //           skinColor: 0xb0cee0
  //         }
  //       },
  //       startDot: {
  //         x: -500,
  //         y: 120,
  //         z: -350
  //       },
  //       endDot: {
  //         x: 500,
  //         y: 120,
  //         z: -350
  //       },
  //       rotation: [{ direction: 'x', degree: 0 }], //旋转 表示x方向0度  arb表示任意参数值[x,y,z,angle]
  //       childrens: [
  //         {
  //           op: '-',
  //           show: true,
  //           uuid: '',
  //           name: 'doorhole',
  //           objType: 'doorhole',
  //           thick: 20,
  //           height: 220,
  //           startDot: {
  //             x: -410,
  //             y: 110,
  //             z: -350
  //           },
  //           endDot: {
  //             x: -190,
  //             y: 110,
  //             z: -350
  //           },
  //           skin: {
  //             skin_up: {
  //               skinColor: 0xffdddd
  //             },
  //             skin_down: {
  //               skinColor: 0xdddddd
  //             },
  //             skin_fore: {
  //               skinColor: 0xffdddd
  //             },
  //             skin_behind: {
  //               skinColor: 0xffdddd
  //             },
  //             skin_left: {
  //               skinColor: 0xffdddd
  //             },
  //             skin_right: {
  //               skinColor: 0xffdddd
  //             }
  //           }
  //         },
  //         {
  //           op: '-',
  //           show: true,
  //           uuid: '',
  //           name: 'windowHole',
  //           objType: 'windowHole',
  //           thick: 20,
  //           height: 160,
  //           startDot: {
  //             x: -50,
  //             y: 130,
  //             z: -350
  //           },
  //           endDot: {
  //             x: 450,
  //             y: 130,
  //             z: -350
  //           }
  //         },
  //         {
  //           show: true,
  //           name: 'windowCaseBottom',
  //           uuid: '',
  //           objType: 'cube',
  //           thick: 30,
  //           height: 10,
  //           startDot: {
  //             x: -50,
  //             y: 50,
  //             z: -350
  //           },
  //           endDot: {
  //             x: 450,
  //             y: 50,
  //             z: -350
  //           },
  //           skin: {
  //             skin_up: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_down: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_fore: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_behind: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_left: {
  //               skinColor: 0xd0eef0
  //             },
  //             skin_right: {
  //               skinColor: 0xd0eef0
  //             }
  //           }
  //         },

  //         {
  //           show: true,
  //           uuid: '',
  //           name: 'doorCaseRight',
  //           objType: 'cube',
  //           thick: 24,
  //           height: 220,
  //           startDot: {
  //             x: -410,
  //             y: 110,
  //             z: -350
  //           },
  //           endDot: {
  //             x: -405,
  //             y: 110,
  //             z: -350
  //           },
  //           skin: {
  //             skin_up: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_down: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_fore: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_behind: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_left: {
  //               skinColor: 0xd0eef0
  //             },
  //             skin_right: {
  //               skinColor: 0xd0eef0
  //             }
  //           }
  //         },
  //         {
  //           show: true,
  //           name: 'doorCaseLeft',
  //           uuid: '',
  //           objType: 'cube',
  //           thick: 24,
  //           height: 220,
  //           startDot: {
  //             x: -190,
  //             y: 110,
  //             z: -350
  //           },
  //           endDot: {
  //             x: -195,
  //             y: 110,
  //             z: -350
  //           },
  //           skin: {
  //             skin_up: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_down: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_fore: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_behind: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_left: {
  //               skinColor: 0xd0eef0
  //             },
  //             skin_right: {
  //               skinColor: 0xd0eef0
  //             }
  //           }
  //         },
  //         {
  //           show: true,
  //           name: 'doorCaseTop',
  //           uuid: '',
  //           objType: 'cube',
  //           thick: 24,
  //           height: 5,
  //           startDot: {
  //             x: -190,
  //             y: 220,
  //             z: -350
  //           },
  //           endDot: {
  //             x: -410,
  //             y: 220,
  //             z: -350
  //           },
  //           skin: {
  //             skin_up: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_down: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_fore: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_behind: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_left: {
  //               skinColor: 0xd0eef0
  //             },
  //             skin_right: {
  //               skinColor: 0xd0eef0
  //             }
  //           }
  //         },
  //         {
  //           show: true,
  //           name: 'doorCaseBottom',
  //           uuid: '',
  //           objType: 'cube',
  //           thick: 24,
  //           height: 5,
  //           startDot: {
  //             x: -190,
  //             y: 5,
  //             z: -350
  //           },
  //           endDot: {
  //             x: -410,
  //             y: 5,
  //             z: -350
  //           },
  //           skin: {
  //             skin_up: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_down: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_fore: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_behind: {
  //               skinColor: 0xc0dee0
  //             },
  //             skin_left: {
  //               skinColor: 0xd0eef0
  //             },
  //             skin_right: {
  //               skinColor: 0xd0eef0
  //             }
  //           }
  //         },
  //         {
  //           show: true,
  //           name: 'doorLeft',
  //           uuid: '',
  //           objType: 'cube',
  //           thick: 4,
  //           height: 210,
  //           startDot: {
  //             x: -196,
  //             y: 112,
  //             z: -350
  //           },
  //           endDot: {
  //             x: -300,
  //             y: 112,
  //             z: -350
  //           },
  //           skin: {
  //             opacity: 0.1,
  //             skin_up: {
  //               skinColor: 0x51443e
  //             },
  //             skin_down: {
  //               skinColor: 0x51443e
  //             },
  //             skin_fore: {
  //               skinColor: 0x51443e
  //             },
  //             skin_behind: {
  //               skinColor: 0x51443e
  //             },
  //             skin_left: {
  //               skinColor: 0x51443e,
  //               imgurl: 'images/door_left.png'
  //             },
  //             skin_right: {
  //               skinColor: 0x51443e,
  //               imgurl: 'images/door_right.png'
  //             }
  //           }
  //         },
  //         {
  //           show: true,
  //           name: 'doorRight',
  //           uuid: '',
  //           objType: 'cube',
  //           thick: 4,
  //           height: 210,
  //           startDot: {
  //             x: -300,
  //             y: 112,
  //             z: -350
  //           },
  //           endDot: {
  //             x: -404,
  //             y: 112,
  //             z: -350
  //           },
  //           skin: {
  //             opacity: 0.1,
  //             skin_up: {
  //               skinColor: 0x51443e
  //             },
  //             skin_down: {
  //               skinColor: 0x51443e
  //             },
  //             skin_fore: {
  //               skinColor: 0x51443e
  //             },
  //             skin_behind: {
  //               skinColor: 0x51443e
  //             },
  //             skin_left: {
  //               skinColor: 0x51443e,
  //               imgurl: 'images/door_right.png'
  //             },
  //             skin_right: {
  //               skinColor: 0x51443e,
  //               imgurl: 'images/door_left.png'
  //             }
  //           }
  //         },
  //         {
  //           show: true,
  //           name: 'doorControl',
  //           uuid: '',
  //           objType: 'cube',
  //           thick: 10,
  //           height: 40,
  //           startDot: {
  //             x: -120,
  //             y: 160,
  //             z: -365
  //           },
  //           endDot: {
  //             x: -160,
  //             y: 160,
  //             z: -365
  //           },
  //           skin: {
  //             opacity: 0.1,
  //             skin_up: {
  //               skinColor: 0x333333
  //             },
  //             skin_down: {
  //               skinColor: 0x333333
  //             },
  //             skin_fore: {
  //               skinColor: 0x333333
  //             },
  //             skin_behind: {
  //               skinColor: 0x333333
  //             },
  //             skin_left: {
  //               skinColor: 0x333333,
  //               imgurl: 'images/doorControl.jpg'
  //             },
  //             skin_right: {
  //               skinColor: 0x333333
  //             }
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       //wall2
  //       uuid: '',
  //       name: 'wall2',
  //       thick: 20,
  //       height: 240,
  //       skin: {
  //         skin_up: {
  //           skinColor: 0xdddddd
  //         },
  //         skin_down: {
  //           skinColor: 0xdddddd
  //         },
  //         skin_fore: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_behind: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_left: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_right: {
  //           skinColor: 0xdeeeee
  //         }
  //       },
  //       startDot: {
  //         x: -500,
  //         y: 120,
  //         z: 450
  //       },
  //       endDot: {
  //         x: 500,
  //         y: 120,
  //         z: 450
  //       }
  //     },
  //     {
  //       //wall3
  //       uuid: '',
  //       name: 'wall3',
  //       thick: 20,
  //       height: 240,
  //       skin: {
  //         skin_up: {
  //           skinColor: 0xdddddd
  //         },
  //         skin_down: {
  //           skinColor: 0xdddddd
  //         },
  //         skin_fore: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_behind: {
  //           skinColor: 0xdeeeee
  //         },
  //         skin_left: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_right: {
  //           skinColor: 0xb0cee0
  //         }
  //       },
  //       startDot: {
  //         x: 490,
  //         y: 120,
  //         z: -355
  //       },
  //       endDot: {
  //         x: 490,
  //         y: 120,
  //         z: 455
  //       }
  //     },
  //     {
  //       //wall4
  //       uuid: '',
  //       name: 'wall4',
  //       thick: 20,
  //       height: 240,
  //       skin: {
  //         skin_up: {
  //           skinColor: 0xdddddd
  //         },
  //         skin_down: {
  //           skinColor: 0xdddddd
  //         },
  //         skin_fore: {
  //           skinColor: 0xdeeeee
  //         },
  //         skin_behind: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_left: {
  //           skinColor: 0xb0cee0
  //         },
  //         skin_right: {
  //           skinColor: 0xb0cee0
  //         }
  //       },
  //       startDot: {
  //         x: -490,
  //         y: 120,
  //         z: -355
  //       },
  //       endDot: {
  //         x: -490,
  //         y: 120,
  //         z: 455
  //       }
  //     }
  //   ],
  //   style: {
  //     skinColor: 0x8ac9e2
  //   }
  // },

  // // 网线布局
  // {},
  {
    cabinet: {
      show: true,
      uuid: '1',
      name: '1号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸
      position: { x: 50, y: 0, z: 0 }, // 位置
      servers: [
        {
          uuid: '11',
          name: '1-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: ''
        },
        {
          uuid: '12',
          name: '1-2号服务器',
          ip: '',
          apps: '',
          skinImgurl: '',
          deviceStatus: 1 // 0正常  1异常
        },
        {
          uuid: '13',
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
      name: '2号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸
      position: { x: 100, y: 0, z: 0 }, // 位置
      servers: [
        {
          uuid: '21',
          name: '2-1号服务器',
          ip: '',
          apps: '',
          skinImgurl: ''
        },
        {
          uuid: '22',
          name: '2-2号服务器',
          ip: '',
          apps: '',
          skinImgurl: ''
        },
        {
          uuid: '23',
          name: '2-3号服务器',
          ip: '',
          apps: '',
          skinImgurl: ''
        },
        {
          uuid: '24',
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
      name: '3号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
      position: { x: -50, y: 0, z: 0 }, // 位置
      servers: [
        {
          uuid: '31',
          name: '3-1号服务器',
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
      name: '4号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸
      position: { x: -100, y: 0, z: 0 }, // 位置
      servers: [
        {
          uuid: '41',
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
      name: '5号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸
      position: { x: -150, y: 0, z: 0 }, // 位置
      servers: [
        {
          uuid: '51',
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
      name: '6号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
      position: { x: -50, y: 0, z: -110 }, // 位置
      servers: [
        {
          uuid: '61',
          name: '6-1号服务器',
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
      uuid: '7',
      name: '7号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
      position: { x: -100, y: 0, z: -110 }, // 位置
      servers: [
        {
          uuid: '71',
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
      name: '8号机柜',
      size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
      position: { x: -150, y: 0, z: -110 }, // 位置
      servers: [
        {
          uuid: '81',
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
export const btnsConfig = [
  {
    btnId: 'btnReset',
    btnTitle: '场景复位',
    btnIcon: 'el-icon-refresh-left',
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
    btnId: 'btnStats',
    btnTitle: '性能监测',
    btnIcon: 'el-icon-odometer',
    event: () => {}
  },
  {
    btnId: 'btnAuto',
    btnTitle: '路线巡检',
    btnIcon: 'el-icon-s-unfold',
    event: function() {
      console.info('qqq')
    }
  },
  {
    btnId: 'btnFirstPerson',
    btnTitle: '第一人称巡检',
    btnIcon: 'el-icon-map-location',
    event: () => {}
  },
  {
    btnId: 'btnCabinet',
    btnTitle: '机柜巡检',
    btnIcon: 'el-icon-thumb',
    event: function() {
      console.info('qqq')
    }
  },
  // {
  //   btnId: 'btnAlarm',
  //   btnTitle: '告警',
  //   btnIcon: 'el-icon-warning',
  //   event: function() {}
  // },
  // {
  //   btnId: 'btnUsage',
  //   btnTitle: '烟雾模拟',
  //   btnIcon: 'el-icon-smoking',
  //   event: function() {}
  // },
  {
    btnId: 'btnConnection',
    btnTitle: '走线管理',
    btnIcon: 'el-icon-s-operation',
    event: function() {
      console.info('qqq')
    }
  }
]
