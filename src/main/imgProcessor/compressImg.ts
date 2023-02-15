import path from 'path';
import fs from 'fs';
import imagemin from 'imagemin';
// import imageminJpegtran from 'imagemin-jpegtran';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
// import imageminGifsicle from 'imagemin-gifsicle';
import imageminGiflossy from 'imagemin-giflossy';
import md5 from 'md5';
import { ImgProcessModeEnum } from '../types';
import { imgBakDirPath } from '../config/paths';

/**
 * 压缩图片
 * @param filePath 图片路径
 * @param options 压缩配置
 * @returns Promise
 */
export default function compressImg(
  filePath: string,
  options?: {
    // 质量,[0,1]
    quality?: [number, number];
    // 替换图片还是新建图片
    mode?: ImgProcessModeEnum;
  }
) {
  console.log('====压缩质量====', options?.quality);
  return new Promise<{
    originalFileBuffer: Buffer | null;
    originalFilePath: string;
    sourcePath: string;
    destinationPath: string;
  }>((resolve, reject) => {
    const isReplace = options?.mode === ImgProcessModeEnum.REPLACE_FILE;
    const fileName = path.basename(filePath);
    const replaceDirPath = isReplace
      ? path.resolve(filePath, '../', `.${fileName}.tmp`)
      : '';

    const originalFileBuffer = isReplace ? fs.readFileSync(filePath) : null;

    let bakFilePath = '';
    if (isReplace) {
      const bakBasePath = imgBakDirPath;
      if (!fs.existsSync(bakBasePath)) {
        fs.mkdirSync(bakBasePath, { recursive: true });
      }
      const bakFileName = `${md5(filePath)}-${fileName}`;
      bakFilePath = path.join(bakBasePath, bakFileName);
      console.log('====bakFilePath====', bakFilePath);
      fs.copyFileSync(filePath, bakFilePath, fs.constants.COPYFILE_FICLONE);
    }

    imagemin([filePath], {
      destination: isReplace
        ? path.resolve(filePath, '../')
        : path.resolve(filePath, '../压缩图片'),
      plugins: [
        imageminMozjpeg(),
        imageminPngquant({
          quality: options?.quality || [0.3, 0.5],
        }),
        // imageminGifsicle({
        //   optimizationLevel: 3,
        // }),
        imageminGiflossy({ lossy: 80 }),
      ],
    })
      .then((res) => {
        // 压缩后覆盖源文件
        // if (isReplace) {
        //   // fs.copyFileSync(
        //   //   `${replaceDirPath}/${fileName}`,
        //   //   filePath,
        //   //   fs.constants.COPYFILE_FICLONE
        //   // );
        //   // fs.rmSync(replaceDirPath, {
        //   //   recursive: true,
        //   //   force: true,
        //   // });

        //   fs.mkdirSync(replaceDirPath);
        //   fs.writeFileSync(`${replaceDirPath}/${fileName}`, res[0].data);
        // }
        return resolve({
          originalFileBuffer,
          originalFilePath: filePath,
          sourcePath:
            isReplace && bakFilePath ? bakFilePath : res[0].sourcePath,
          destinationPath: isReplace
            ? res[0].sourcePath
            : res[0].destinationPath,
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}
