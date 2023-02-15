import getImgInfo from '../imgProcessor/getImgInfo';
import { ChannelsEnum } from '../types';

export default async function handleGetImgInfo(
  event: Electron.IpcMainEvent,
  arg: any
) {
  console.log('====handleGetImgInfo====', arg);
  const imgInfo = await getImgInfo(arg.filePath);
  event.reply(ChannelsEnum.GET_IMAGE_INFO, {
    info: imgInfo,
  });
}
