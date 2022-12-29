export enum AA {}

// IPC事件类型
export enum ChannelsEnum {
  EXAMPLE = 'ipc-example',
  // 压缩图片
  COMPRESS_IMAGE = 'ipc-compress-img',
  // 对比图片（打开新窗口）
  COMPARE_IMAGE = 'ipc-compare-img',
}

export enum ImgStatusEnum {
  SUCCESS = 'success',
  ERROR = 'error',
  PROCESSING = 'processing',
  WAITING = 'waiting',
}
