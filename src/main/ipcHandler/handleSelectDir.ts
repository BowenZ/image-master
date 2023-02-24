import { dialog } from 'electron';
import { ChannelsEnum } from '../types';

export default async function handleSelectDir(
  event: Electron.IpcMainEvent,
  arg: any
) {
  dialog
    .showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
    })
    .then((result) => {
      console.log('====result====', result);
      if (!result.canceled && result.filePaths.length) {
        event.sender.send(ChannelsEnum.SELECT_DIR, result.filePaths[0]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
