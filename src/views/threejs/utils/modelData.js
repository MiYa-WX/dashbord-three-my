import * as configConstant from '@/views/threejs/utils/configConstant'
// 墙体y轴坐标，墙壁高度的一半加上地板厚度的一半,防止模型重叠
const wallY = configConstant.WALL_HEIGHT / 2 + configConstant.FLOOR_THICK / 2
// 机房各模型数据,定义机柜、服务器数据
export const objectModel = [
  // 地板
  {
    show: true,
    name: 'floor',
    type: 'floor',
    position: { x: 0, y: 0, z: 0 },
    scale: { width: 1000, height: configConstant.FLOOR_THICK, depth: 600 },
    /**
     * rotation:模型旋转配置
     * direction: x|y|z 表示旋转方向
     * degree: 表示旋转角度 arb表示任意参数值[x,y,z,angle]
     */
    // rotation: [{ direction: 'x', degree: 0 }],
    style: {
      /**
       * skinWhole和skinFace存在一个就可
       * skinWhole:表示每一面都设置一样的皮肤
       * skinFace:表示根据配置的皮肤数据为每一面设置不同的皮肤，不配置则使用默认皮肤
       * skinFace.top:上 skinFace.bottom:下
       * skinFace.left:左 skinFace.right:右
       * skinFace.front:前 skinFace.back:后
       */
      skinWhole: {
        // skinColor: 0x98750f,
        skinImgUrl: 'floorMy.png'
      }
    }
  },

  // 墙壁
  {
    show: true,
    name: 'wall',
    type: 'wall',
    /**
     * 外层的position scale style是每一扇墙体公共的配置
     * position:模型旋转配置
     * scale: x|y|z 表示旋转方向
     * style: 表示旋转角度 arb表示任意参数值[x,y,z,angle]
     */
    position: {
      x: 0,
      y: wallY,
      z: 0
    },
    scale: {
      width: 900,
      height: configConstant.WALL_HEIGHT,
      depth: configConstant.WALL_THICK
    },
    style: {
      skinWhole: {
        skinColor: 0xffffff,
        skinImgUrl: 'wall.jpg'
      }
    },
    wallData: [
      {
        show: true,
        name: 'wallFront',
        type: 'box',
        position: {
          x: 0,
          y: wallY,
          z: 600 / 2 - 50
        }, // z轴方向是地板depth的一半，距离边沿50
        scale: {
          width: 900,
          height: configConstant.WALL_HEIGHT,
          depth: configConstant.WALL_THICK
        },
        door: {
          isDoor: true,
          show: true,
          name: 'doorFront',
          type: 'box',
          position: {
            x: 0,
            y: wallY - 30 / 2,
            z: 600 / 2 - 50
          },
          scale: {
            width: 80,
            height: 150 - 30,
            depth: configConstant.WALL_THICK
          },
          style: {
            skinWhole: {
              skinColor: 0xffffff,
              skinImgUrl: 'door.png',
              repeatx: false,
              repeaty: false
            }
          }
        },
        windows: { isWindows: false }
      },
      {
        show: true,
        name: 'wallBack',
        type: 'box',
        position: {
          x: 0,
          y: wallY,
          z: -600 / 2 + 50
        },
        scale: {
          width: 900,
          height: configConstant.WALL_HEIGHT,
          depth: configConstant.WALL_THICK
        },
        door: { isDoor: false },
        windows: { isWindows: false }
      },
      {
        show: true,
        name: 'wallLeft',
        type: 'box',
        position: {
          x: -1000 / 2 + 50,
          y: wallY,
          z: 0
        },
        scale: {
          width: 500,
          height: configConstant.WALL_HEIGHT,
          depth: configConstant.WALL_THICK
        },
        rotation: [{ direction: 'y', degree: 1.5 * Math.PI }],
        door: { isDoor: false },
        windows: { isWindows: false }
      },
      {
        show: true,
        name: 'wallRight',
        type: 'box',
        position: {
          x: 1000 / 2 - 50,
          y: wallY,
          z: 0
        },
        scale: {
          width: 500,
          height: configConstant.WALL_HEIGHT,
          depth: configConstant.WALL_THICK
        },
        rotation: [{ direction: 'y', degree: -1.5 * Math.PI }],
        door: { isDoor: false },
        windows: { isWindows: false }
      }
    ]
  },
  // 线条
  {
    show: true,
    name: 'line',
    type: 'line',
    linesData: [
      {
        show: true,
        name: 'line1',
        type: 'line',
        source: { x: 20, y: 5, z: 0 },
        target: { x: (128 * 4) / 2 - 5, y: 5, z: 0 }
      },
      {
        show: true,
        name: 'line2',
        type: 'line',
        source: { x: (128 * 4) / 2 - 5, y: 5, z: 0 },
        target: { x: (128 * 4) / 2 - 5, y: 105, z: 0 }
      },
      {
        show: true,
        name: 'line3',
        type: 'line',
        source: { x: (128 * 4) / 2 - 5, y: 105, z: 0 },
        target: { x: -(128 * 4) / 2 + 5, y: 105, z: 0 }
      },
      {
        show: true,
        name: 'line4',
        type: 'line',
        source: { x: -(128 * 4) / 2 + 5, y: 105, z: 0 },
        target: { x: -(128 * 4) / 2 + 5, y: 5, z: 0 }
      },
      {
        show: true,
        name: 'line5',
        type: 'line',
        source: { x: -(128 * 4) / 2 + 5, y: 5, z: 0 },
        target: { x: -20, y: 5, z: 0 }
      },
      {
        show: true,
        name: 'line6',
        type: 'line',
        source: { x: -20, y: 5, z: 0 },
        target: { x: -20, y: 5, z: -110 }
      },
      {
        show: true,
        name: 'line7',
        type: 'line',
        source: { x: -20, y: 5, z: -110 },
        target: { x: -(128 * 4) / 2 + 5, y: 5, z: -110 }
      },
      {
        show: true,
        name: 'line8',
        type: 'line',
        source: { x: -(128 * 4) / 2 + 5, y: 5, z: 0 },
        target: { x: (128 * 4) / 2 - 5, y: 5, z: 0 },
        position: { x: 0, y: 0, z: 10 },
        style: {
          color: 0xd99e39,
          linewidth: 2
        }
      }
    ]
  },
  // 摄像头 start
  {
    show: true,
    name: '右上角摄像头',
    type: 'cylinderCamera',
    scale: {
      radiusTop: 10,
      radiusBottom: 10,
      height: 30
    },
    // TODO 圆柱旋转之后的位置调整还没理清楚
    position: {
      x: (1000 - 50 * 2) / 2 - 30 / 2 - 0.7 * Math.PI,
      y: configConstant.WALL_HEIGHT - 10,
      z: -(600 - 50 * 2) / 2 + 20
    },
    style: {
      skinWhole: {
        skinColor: 0x252525,
        skinImgUrl: 'sxt.png',
        repeatx: false,
        repeaty: false
      }
    },
    rotation: [
      { direction: 'x', degree: -0.4 * Math.PI },
      { direction: 'z', degree: 0.7 * Math.PI }
    ]
  },
  {
    show: true,
    name: '左上角摄像头',
    type: 'cylinderCamera',
    scale: {
      radiusTop: 10,
      radiusBottom: 10,
      height: 30
    },
    // TODO 圆柱旋转之后的位置调整还没理清楚
    position: {
      x: -((1000 - 50 * 2) / 2 - 30 / 2 - 0.5 * Math.PI),
      y: configConstant.WALL_HEIGHT - 10,
      z: -(600 - 50 * 2) / 2 + 20
    },
    style: {
      skinWhole: {
        skinColor: 0x252525,
        skinImgUrl: 'sxt.png',
        repeatx: false,
        repeaty: false
      }
    },
    rotation: [
      { direction: 'x', degree: 0.5 * Math.PI },
      { direction: 'z', degree: -0.3 * Math.PI }
    ]
  },
  // 摄像头 end

  // 机柜 start
  {
    show: true,
    name: '1号机柜',
    type: 'cabinet',
    scale: {
      width: configConstant.CABINET_WIDTH,
      height: configConstant.CABINET_HEIGHT,
      depth: configConstant.CABINET_DEPTH
    },
    position: {
      x: 50,
      y: 2,
      z: 10
    },
    style: {
      skinWhole: {
        skinImgUrl: 'rack_door_back.jpg',
        repeatx: false,
        repeaty: false
      }
    },
    door: {
      isDoor: true,
      show: true,
      name: 'doorFront',
      type: 'box',
      position: {
        x: 50,
        y: 10,
        z: 10
      },
      scale: {
        width: configConstant.CABINET_WIDTH,
        height: configConstant.CABINET_HEIGHT,
        depth: configConstant.CABINET_THICK
      },
      style: {
        skinWhole: {
          skinColor: 0xffffff,
          skinImgUrl: 'rack_door_front.jpg',
          repeatx: false,
          repeaty: false
        }
      }
    },
    servers: [
      {
        show: true,
        name: '1-1号服务器',
        type: 'box',
        scale: {
          width:
            configConstant.CABINET_WIDTH - 2 * configConstant.CABINET_THICK,
          height: 15,
          depth: configConstant.CABINET_DEPTH - 2 * configConstant.CABINET_THICK
        },
        position: {
          // x: 50,
          // y: 0,
          // z: 0
        },
        style: {
          skinWhole: {
            skinImgUrl: 'rack_door_back.jpg',
            repeatx: false,
            repeaty: false
          }
        },
        ip: '192.168.62.71',
        deviceStatus: 1 // 0正常  1异常
      }
    ]
  }
  // 机柜 end

  // {
  //   cabinet: {
  //     show: true,
  //     uuid: '1',
  //     name: '1号机柜',
  //     size: { w: 40, h: 100, d: 40 }, // 尺寸
  //     position: { x: 50, y: 0, z: 0 }, // 位置
  //     servers: [
  //       {
  //         uuid: '11',
  //         name: '1-1号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: ''
  //       },
  //       {
  //         uuid: '12',
  //         name: '1-2号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: '',
  //         deviceStatus: 1 // 0正常  1异常
  //       },
  //       {
  //         uuid: '13',
  //         name: '1-3号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: ''
  //       }
  //     ]
  //   }
  // },
  // {
  //   cabinet: {
  //     uuid: '2',
  //     name: '2号机柜',
  //     size: { w: 40, h: 100, d: 40 }, // 尺寸
  //     position: { x: 100, y: 0, z: 0 }, // 位置
  //     servers: [
  //       {
  //         uuid: '21',
  //         name: '2-1号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: ''
  //       },
  //       {
  //         uuid: '22',
  //         name: '2-2号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: ''
  //       },
  //       {
  //         uuid: '23',
  //         name: '2-3号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: ''
  //       },
  //       {
  //         uuid: '24',
  //         name: '2-4号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: '/source/textures/computer/3.jpg'
  //       }
  //     ]
  //   }
  // },
  // {
  //   cabinet: {
  //     uuid: '3',
  //     name: '3号机柜',
  //     size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
  //     position: { x: -50, y: 0, z: 0 }, // 位置
  //     servers: [
  //       {
  //         uuid: '31',
  //         name: '3-1号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: '/source/textures/computer/3.jpg'
  //       }
  //     ]
  //   }
  // },
  // {
  //   cabinet: {
  //     uuid: '4',
  //     name: '4号机柜',
  //     size: { w: 40, h: 100, d: 40 }, // 尺寸
  //     position: { x: -100, y: 0, z: 0 }, // 位置
  //     servers: [
  //       {
  //         uuid: '41',
  //         name: '4-1号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: '/source/textures/computer/3.jpg'
  //       }
  //     ]
  //   }
  // },
  // {
  //   cabinet: {
  //     uuid: '5',
  //     name: '5号机柜',
  //     size: { w: 40, h: 100, d: 40 }, // 尺寸
  //     position: { x: -150, y: 0, z: 0 }, // 位置
  //     servers: [
  //       {
  //         uuid: '51',
  //         name: '5-1号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: '/source/textures/computer/3.jpg'
  //       }
  //     ]
  //   }
  // },
  // {
  //   cabinet: {
  //     uuid: '6',
  //     name: '6号机柜',
  //     size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
  //     position: { x: -50, y: 0, z: -110 }, // 位置
  //     servers: [
  //       {
  //         uuid: '61',
  //         name: '6-1号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: '/source/textures/computer/3.jpg',
  //         deviceStatus: 1 // 0正常  1异常
  //       }
  //     ]
  //   }
  // },
  // {
  //   cabinet: {
  //     uuid: '7',
  //     name: '7号机柜',
  //     size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
  //     position: { x: -100, y: 0, z: -110 }, // 位置
  //     servers: [
  //       {
  //         uuid: '71',
  //         name: '7-1号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: '/source/textures/computer/3.jpg'
  //       }
  //     ]
  //   }
  // },
  // {
  //   cabinet: {
  //     uuid: '8',
  //     name: '8号机柜',
  //     size: { w: 40, h: 100, d: 40 }, // 尺寸 宽、高、深
  //     position: { x: -150, y: 0, z: -110 }, // 位置
  //     servers: [
  //       {
  //         uuid: '81',
  //         name: '8-1号服务器',
  //         ip: '',
  //         apps: '',
  //         skinImgurl: '/source/textures/computer/3.jpg'
  //       }
  //     ]
  //   }
  // }
]

// 机房操作按钮
export const btnsConfig = [
  {
    btnId: 'btnReset',
    btnTitle: '场景复位',
    btnIcon: 'el-icon-refresh-left',
    event: () => {
      console.info('场景复位')
    }
  },
  {
    btnId: 'btnStats',
    btnTitle: '性能监测',
    btnIcon: 'el-icon-odometer',
    event: () => {
      console.info('性能监测')
    }
  },
  {
    btnId: 'btnAuto',
    btnTitle: '路线巡检',
    btnIcon: 'el-icon-s-unfold',
    event: () => {
      console.info('路线巡检')
    }
  },
  {
    btnId: 'btnFirstPerson',
    btnTitle: '第一人称巡检',
    btnIcon: 'el-icon-map-location',
    event: () => {
      console.info('第一人称巡检')
    }
  },
  // {
  //   btnId: 'btnCabinet',
  //   btnTitle: '机柜巡检',
  //   btnIcon: 'el-icon-thumb',
  //   event: () => {
  //     console.info('机柜巡检')
  //   }
  // },
  // {
  //   btnId: 'btnAlarm',
  //   btnTitle: '告警管理',
  //   btnIcon: 'el-icon-warning',
  //   event: () => {
  //     console.info('告警管理')
  //   }
  // },
  // {
  //   btnId: 'btnUsage',
  //   btnTitle: '烟雾模拟',
  //   btnIcon: 'el-icon-smoking',
  //   event: () => {
  //     console.info('烟雾模拟')
  //   }
  // },
  {
    btnId: 'btnConnection',
    btnTitle: '走线管理',
    btnIcon: 'el-icon-s-operation',
    event: () => {
      console.info('走线管理')
    }
  }
]
