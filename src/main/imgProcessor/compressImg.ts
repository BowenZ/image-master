import path from 'path';
import fs from 'fs';
import imagemin from 'imagemin';
import type { Result } from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import md5 from 'md5';
import { app } from 'electron';
import { ImgProcessModeEnum } from '../types';

export default function compressImg(
  filePath: string,
  options?: {
    quality?: [number, number];
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
      const bakBasePath = path.join(app.getPath('userData'), 'tmp');
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
        imageminJpegtran(),
        imageminPngquant({
          quality: options?.quality || [0.3, 0.5],
        }),
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
