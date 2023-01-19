import sharp from 'sharp';

export default async function getImgInfo(filePath: string) {
  const metadata = await sharp(filePath).metadata();
  return metadata;
}
