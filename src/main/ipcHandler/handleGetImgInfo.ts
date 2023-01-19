import getImgInfo from '../imgProcessor/getImgInfo';
import { ChannelsEnum } from '../types';

export default async function handleGetImgInfo(event, args) {
  console.log('====handleGetImgInfo====', args);
  const imgInfo = getImgInfo(args.filePath);
  event.reply(ChannelsEnum.GET_IMAGE_INFO, {
    info: imgInfo,
  });
}
