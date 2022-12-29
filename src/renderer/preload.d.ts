import { ChannelsEnum } from 'main/types';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: ChannelsEnum, ...args: unknown[]): void;
        on(
          channel: ChannelsEnum,
          func: (...args: unknown[]) => void
        ): (() => void) | undefined;
        once(channel: ChannelsEnum, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};
