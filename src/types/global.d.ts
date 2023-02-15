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

  export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
  };

  type Nullable<T> = T | null;
  type Recordable<T = any> = Record<string, T>;
  interface ReadonlyRecordable<T = any> {
    readonly [key: string]: T;
  }
  interface Indexable<T = any> {
    [key: string]: T;
  }
  type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
  };
  type TimeoutHandle = ReturnType<typeof setTimeout>;
  type IntervalHandle = ReturnType<typeof setInterval>;

  interface ChangeEvent extends Event {
    target: HTMLInputElement;
  }

  interface WheelEvent {
    path?: EventTarget[];
  }
}

export {};
