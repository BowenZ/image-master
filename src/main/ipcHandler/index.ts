import { ChannelsEnum } from '../types';

function bindIPCEvent(ipcMain: Electron.IpcMain) {
  const ret = {
    on(
      channel: ChannelsEnum,
      handler: (event: Electron.IpcMainEvent, arg: any) => void
    ) {
      ipcMain.on(channel, handler);
      return ret;
    },
  };

  return ret;
}

export default bindIPCEvent;
