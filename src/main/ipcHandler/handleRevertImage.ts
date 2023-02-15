import fs from 'fs';
import dataStore from '../dataStore';
import { ChannelsEnum, ImgStatusEnum } from '../types';

export default async function handleRevertImage(
  event: Electron.IpcMainEvent,
  arg: {
    oldFilePath: string;
  }
) {
  console.log('====图片还原====', arg);
  console.log('====compressImageBakList====', dataStore.compressImageBakList);
  const { oldFilePath } = arg;
  const bakFileData = dataStore.compressImageBakList.find(
    (item) => item.originalFilePath === oldFilePath
  );
  if (bakFileData?.sourcePath) {
    fs.copyFileSync(
      bakFileData.sourcePath,
      oldFilePath,
      fs.constants.COPYFILE_FICLONE
    );
    const destinationSize = fs.statSync(bakFileData.sourcePath).size;
    fs.rmSync(bakFileData.sourcePath);
    event.reply(ChannelsEnum.REVERT_IMAGE, {
      status: ImgStatusEnum.REVERTED,
      destinationPath: bakFileData.originalFilePath,
      destinationSize,
    });
  }
}
