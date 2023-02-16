import sharp, { FormatEnum } from 'sharp';
import path from 'path';

const getPathByNewFormat = (
  filePath: string,
  format: keyof FormatEnum
): string => {
  const extname = path.extname(filePath);
  console.log('====extname====', extname);
  if (extname === format) {
    return filePath;
  }
  return filePath.replace(extname, `.${format}`);
};

export default async function convertImg(
  filePath: string,
  options: {
    // 图片类型
    format: keyof FormatEnum;
    // 质量,[1,100]
    quality: number;
  }
) {
  const destinationPath = getPathByNewFormat(filePath, options.format);
  const data = await sharp(filePath)
    .toFormat(options.format, {
      quality: options.quality,
    })
    .toFile(destinationPath);
  console.log('====convertImg====', data);
  return {
    ...data,
    destinationPath,
  };
}
