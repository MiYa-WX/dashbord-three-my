/**
 * 3D场景中的一些配置常量
 * author：miya
 */
export const FILE_URL = '/source/textures/computer/' // 文件基础路径

export const FLOOR_WIDTH = 1000 // 地板的宽度
export const FLOOR_LENGTH = 600 // 地板的长度
export const FLOOR_THICK = 4 // 地板的厚度

export const WALL_X_LENGTH = 50 // 墙壁距离地板边缘左右的间距
export const WALL_Z_LENGTH = 50 // 墙壁距离地板边缘前后的间距
export const WALL_X_WIDTH = FLOOR_WIDTH - 2 * WALL_X_LENGTH // 前后墙壁的宽度
export const WALL_Z_WIDTH = FLOOR_LENGTH - 2 * WALL_Z_LENGTH // 左右墙壁的宽度

export const WALL_THICK = 2 // 墙壁的厚度
export const WALL_HEIGHT = 130 // 墙壁的高度
export const DOOR_WALL_LENGTH = 20 // 门的上方距离墙壁上方的高度
export const DOOR_WIDTH = 80 // 门的宽度
export const DOOR_HEIGHT = WALL_HEIGHT - DOOR_WALL_LENGTH // 门的高度

export const CABINET_NUM = 10 // 机柜个数
export const CABINET_WIDTH = 60 // 机柜的宽度
export const CABINET_HEIGHT = 130 // 机柜的高度
export const CABINET_DEPTH = 50 // 机柜的深度
export const CABINET_THICK = 2 // 机柜板子的厚度
export const CABINET_X_LENGTH = 30 // 各机柜左右间距
export const CABINET_Z_LENGTH = 80 // 各机柜前后间距

export const CABINET_X_INIT = 50 // 机柜初始X轴坐标
export const CABINET_Y_INIT = 2 // 机柜初始Y轴坐标
export const CABINET_Z_INIT = 30 // 机柜初始Z轴坐标

export const SERVER_HEIGHT = 20 // 服务器的高度

export const DEVICE_COLOR = 0xff0000 // 异常设备颜色

