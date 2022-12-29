import path from 'path';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';

export default function compressImg(filePath: string) {
  return imagemin([filePath], {
    destination: path.resolve(filePath, '../compressedImages'),
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.3, 0.5],
      }),
    ],
  });
}
