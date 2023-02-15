import fs from 'fs';
import dataStore from '../dataStore';
import compressImg from '../imgProcessor/compressImg';
import { ChannelsEnum, ImgProcessModeEnum, ImgStatusEnum } from '../types';

export default async function handleCompressImage(
  event: Electron.IpcMainEvent,
  arg: {
    filePathList: string[];
    quality?: [number, number];
    mode?: ImgProcessModeEnum;
  }
) {
  console.log('====ipc-compress-img====', arg);
  const { filePathList, quality, mode } = arg;
  if (!filePathList?.length) {
    event.reply(ChannelsEnum.COMPRESS_IMAGE, {
      status: ImgStatusEnum.ERROR,
    });
    return;
  }

  for (const sourcePath of filePathList) {
    try {
      event.sender.send(ChannelsEnum.COMPRESS_IMAGE, {
        status: ImgStatusEnum.PROCESSING,
        sourcePath,
      });
      console.log('====开始压缩====', sourcePath);
      const compressResult = await compressImg(sourcePath, {
        quality,
        mode,
      });
      dataStore.compressImageBakList.push(compressResult);
      console.log('====压缩成功====', sourcePath, compressResult);
      const { destinationPath } = compressResult;
      const destinationSize = fs.statSync(destinationPath).size;
      const originalSize = fs.statSync(sourcePath).size;

      if (destinationSize > originalSize) {
        fs.copyFileSync(sourcePath, destinationPath);
      }
      event.sender.send(ChannelsEnum.COMPRESS_IMAGE, {
        // 图片状态
        status: ImgStatusEnum.SUCCESS,
        // 源文件地址
        sourcePath,
        // 原始文件地址（若为替换压缩，则地址为备份的文件，若是新建压缩，地址为源文件地址）
        originalFilePath: compressResult.sourcePath,
        // 处理后的图片地址
        destinationPath,
        // 处理后的图片大小
        destinationSize: Math.min(destinationSize, originalSize),
      });
    } catch (err) {
      console.log('====压缩失败====', sourcePath, err);
      event.sender.send(ChannelsEnum.COMPRESS_IMAGE, {
        status: ImgStatusEnum.ERROR,
        sourcePath,
      });
    }
  }
}
