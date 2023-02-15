import sharp from 'sharp';
import fs from 'fs';
import ExifReader from 'exifreader';

export default async function getImgInfo(filePath: string) {
  const metadata = await sharp(filePath).metadata();
  console.log('====metadata====', metadata);
  const stats = await sharp(filePath).stats();
  console.log('====stats====', stats);
  const fileInfo = fs.statSync(filePath);
  console.log('====fileInfo====', fileInfo);
  let tags: Awaited<ReturnType<typeof ExifReader.load>> = {};
  try {
    tags = await ExifReader.load(filePath);
  } catch (err) {
    console.log('====err====', err);
  }

  console.log('====tags====', tags);

  if (!metadata.size) {
    metadata.size = fileInfo.size;
  }
  return {
    ...metadata,
    ...fileInfo,
    ...tags,
    path: filePath,
  };
}
