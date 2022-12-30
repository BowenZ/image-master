export enum AA {}

// IPC事件类型
export enum ChannelsEnum {
  EXAMPLE = 'ipc-example',
  // 压缩图片
  COMPRESS_IMAGE = 'ipc-compress-img',
  // 对比图片（打开新窗口）
  COMPARE_IMAGE = 'ipc-compare-img',
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
}

export enum ImgProcessModeEnum {
  REPLACE_FILE = 'REPLACE_FILE',
  NEW_FILE = 'NEW_FILE',
}
