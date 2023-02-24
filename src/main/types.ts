export enum AA {}

// IPC事件类型
export enum ChannelsEnum {
  EXAMPLE = 'ipc-example',
  // 压缩图片
  COMPRESS_IMAGE = 'ipc-compress-img',
  // 还原图片
  REVERT_IMAGE = 'ipc-revert-img',
  // 对比图片（打开新窗口）
  COMPARE_IMAGE = 'ipc-compare-img',
  // 获取图片信息
  GET_IMAGE_INFO = 'ipc-get-img-info',
  // 格式转换
  IMAGE_CONVERT = 'ipc-convert-img',
  // 打开目录选择窗口
  SELECT_DIR = 'ipc-select-dir',
}

// 图片处理状态
export enum ImgStatusEnum {
  // 成功
  SUCCESS = 'success',
  // 失败
  ERROR = 'error',
  // 处理中
  PROCESSING = 'processing',
  // 等待中
  WAITING = 'waiting',
  // 已还原
  REVERTED = 'reverted',
}

// 图片处理模式
export enum ImgProcessModeEnum {
  // 替换文件
  REPLACE_FILE = 'REPLACE_FILE',
  // 新建文件
  NEW_FILE = 'NEW_FILE',
}

// 图片格式转换存储位置
export enum ImgConvertOutputTypeEnum {
  // 源文件所在目录
  SOURCE_DIR = 'SOURCE_DIR',
  // 指定目录
  NEW_DIR = 'NEW_DIR',
}
