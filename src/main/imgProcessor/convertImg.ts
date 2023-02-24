import sharp, { FormatEnum } from 'sharp';
import path from 'path';
import fs from 'fs';
import { ImgConvertOutputTypeEnum } from '../types';

const getPathByNewFormat = (
  filePath: string,
  format: keyof FormatEnum,
  newFolder?: string
): string => {
  if (newFolder && !fs.existsSync(newFolder)) {
    throw new Error(`目录 ${newFolder} 不存在`);
  }
  const extname = path.extname(filePath);
  const fileName = path.basename(filePath);
  console.log('====extname====', extname);
  console.log('====fileName====', fileName);
  const newFilePath = newFolder ? path.join(newFolder, fileName) : filePath;
  if (extname === format) {
    return newFilePath;
  }
  return newFilePath.replace(extname, `.${format}`);
};

getPathByNewFormat(
  '/Users/zhaobowen/Desktop/github/BowenZ/image-master/src/main/ipcHandler/handleSelectDir.ts',
  'png',
  '/Users/zhaobowen/Desktop/demo/原图'
);

export default async function convertImg(
  filePath: string,
  options: {
    // 图片类型
    format: keyof FormatEnum;
    // 质量,[1,100]
    quality: number;
    outputType: ImgConvertOutputTypeEnum;
    outputDir: string;
  }
) {
  const { format, quality, outputType, outputDir } = options;
  const destinationPath = getPathByNewFormat(
    filePath,
    format,
    outputType === ImgConvertOutputTypeEnum.NEW_DIR && outputDir
      ? outputDir
      : ''
  );
  const data = await sharp(filePath, {
    animated: format === 'gif' || format === 'webp',
  })
    .toFormat(format, {
      quality,
    })
    .toFile(destinationPath);
  console.log('====convertImg====', data);
  return {
    ...data,
    destinationPath,
  };
}
