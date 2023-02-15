import { app, BrowserWindow } from 'electron';
import path from 'path';
import { resolveHtmlPath } from '../util';

export default async function handleCompareImage(
  event: Electron.IpcMainEvent,
  arg: {
    oldFilePath: string;
    newFilePath: string;
  }
) {
  console.log('====图片对比====', arg);
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  win.loadURL(
    `${resolveHtmlPath(
      'index.html'
    )}#/img-compare?oldFilePath=${encodeURIComponent(
      arg.oldFilePath
    )}&newFilePath=${encodeURIComponent(arg.newFilePath)}`
  );
}
