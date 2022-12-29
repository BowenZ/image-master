import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ChannelsEnum } from './types';

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    sendMessage(channel: ChannelsEnum, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: ChannelsEnum, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: ChannelsEnum, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
});
