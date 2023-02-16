import { FormatEnum } from 'sharp';
import convertImg from '../imgProcessor/convertImg';
import { ChannelsEnum, ImgProcessModeEnum, ImgStatusEnum } from '../types';

export default async function handleConvertImage(
  event: Electron.IpcMainEvent,
  arg: {
    filePathList: string[];
    config: {
      format: keyof FormatEnum;
      quality: number;
    };
  }
) {
  console.log('====ipc-compress-img====', arg);
  const {
    filePathList,
    config: { format, quality },
  } = arg;
  if (!filePathList?.length) {
    event.reply(ChannelsEnum.IMAGE_CONVERT, {
      status: ImgStatusEnum.ERROR,
    });
    return;
  }

  for (const sourcePath of filePathList) {
    try {
      event.sender.send(ChannelsEnum.IMAGE_CONVERT, {
        status: ImgStatusEnum.PROCESSING,
        sourcePath,
      });
      console.log('====开始转换====', sourcePath);
      const result = await convertImg(sourcePath, {
        format,
        quality,
      });
      console.log('====转换成功====', sourcePath, result);
      const { destinationPath, size } = result;

      event.sender.send(ChannelsEnum.IMAGE_CONVERT, {
        // 图片状态
        status: ImgStatusEnum.SUCCESS,
        // 源文件地址
        sourcePath,
        // 处理后的图片地址
        destinationPath,
        // 处理后的图片大小
        destinationSize: size,
      });
    } catch (err) {
      console.log('====转换失败====', sourcePath, err);
      event.sender.send(ChannelsEnum.IMAGE_CONVERT, {
        status: ImgStatusEnum.ERROR,
        sourcePath,
      });
    }
  }
}
