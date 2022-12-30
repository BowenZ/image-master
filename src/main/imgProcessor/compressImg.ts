import path from 'path';
import imagemin from 'imagemin';
import type { Result } from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import { ImgProcessModeEnum } from '../types';

export default function compressImg(
  filePath: string,
  options?: {
    quality?: [number, number];
    mode?: ImgProcessModeEnum;
  }
) {
  console.log('====压缩质量====', options?.quality);
  return new Promise<Result[]>((resolve, reject) => {
    imagemin([filePath], {
      destination:
        options?.mode === ImgProcessModeEnum.REPLACE_FILE
          ? path.resolve(filePath, '../', `.${path.basename(filePath)}.tmp`)
          : path.resolve(filePath, '../compressedImages'),
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: options?.quality || [0.3, 0.5],
        }),
      ],
    })
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
