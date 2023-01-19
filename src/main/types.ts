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

export enum ImgProcessModeEnum {
  REPLACE_FILE = 'REPLACE_FILE',
  NEW_FILE = 'NEW_FILE',
}
