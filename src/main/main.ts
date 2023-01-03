/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import url from 'url';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, session } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { ChannelsEnum, ImgProcessModeEnum, ImgStatusEnum } from './types';
import compressImg from './imgProcessor/compressImg';
import { Schemas } from './common/network';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on(ChannelsEnum.EXAMPLE, async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply(ChannelsEnum.EXAMPLE, msgTemplate('pong'));
});

const compressImageBakList: {
  originalFileBuffer: Buffer | null;
  originalFilePath: string;
  sourcePath: string;
  destinationPath: string;
}[] = [];

ipcMain.on(
  ChannelsEnum.COMPRESS_IMAGE,
  async (
    event,
    arg: {
      filePathList: string[];
      quality?: [number, number];
      mode?: ImgProcessModeEnum;
    }
  ) => {
    console.log('====ipc-compress-img====', arg);
    const { filePathList, quality, mode } = arg;
    if (!filePathList?.length) {
      event.reply(ChannelsEnum.COMPRESS_IMAGE, {
        status: ImgStatusEnum.ERROR,
      });
      return;
    }

    for (const sourcePath of filePathList) {
      try {
        event.sender.send(ChannelsEnum.COMPRESS_IMAGE, {
          status: ImgStatusEnum.PROCESSING,
          sourcePath,
        });
        console.log('====开始压缩====', sourcePath);
        const compressResult = await compressImg(sourcePath, {
          quality,
          mode,
        });
        compressImageBakList.push(compressResult);
        console.log('====压缩成功====', sourcePath, compressResult);
        const { destinationPath } = compressResult;
        const destinationSize = fs.statSync(destinationPath).size;
        const originalSize = fs.statSync(sourcePath).size;

        if (destinationSize > originalSize) {
          fs.copyFileSync(sourcePath, destinationPath);
        }
        event.sender.send(ChannelsEnum.COMPRESS_IMAGE, {
          // 图片状态
          status: ImgStatusEnum.SUCCESS,
          // 源文件地址
          sourcePath,
          // 原始文件地址（若为替换压缩，则地址为备份的文件，若是新建压缩，地址为源文件地址）
          originalFilePath: compressResult.sourcePath,
          // 处理后的图片地址
          destinationPath,
          // 处理后的图片大小
          destinationSize: Math.min(destinationSize, originalSize),
        });
      } catch (err) {
        console.log('====压缩失败====', sourcePath, err);
        event.sender.send(ChannelsEnum.COMPRESS_IMAGE, {
          status: ImgStatusEnum.ERROR,
          sourcePath,
        });
      }
    }
  }
);

ipcMain.on(ChannelsEnum.REVERT_IMAGE, async (event, arg) => {
  console.log('====图片还原====', arg);
  console.log('====compressImageBakList====', compressImageBakList);
  const { oldFilePath } = arg;
  const bakFileData = compressImageBakList.find(
    (item) => item.originalFilePath === oldFilePath
  );
  if (bakFileData && bakFileData.originalFileBuffer) {
    fs.writeFileSync(oldFilePath, bakFileData.originalFileBuffer);
    const sourceSize = fs.statSync(bakFileData.sourcePath).size;
    event.reply(ChannelsEnum.REVERT_IMAGE, {
      status: ImgStatusEnum.REVERTED,
      sourcePath: bakFileData.sourcePath,
      sourceSize,
    });
  }
});

ipcMain.on(ChannelsEnum.COMPARE_IMAGE, async (event, arg) => {
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
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      // webSecurity: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    // 这个需要在app.ready触发之后使用
    const { defaultSession } = session;
    defaultSession.protocol.registerFileProtocol(
      Schemas.fileResourceProtocol,
      (request, callback) => {
        console.log('====request====', request);
        const filePath = url.fileURLToPath(
          `file://${request.url.slice(
            `${Schemas.fileResourceProtocol}://`.length
          )}`
        );
        // eslint-disable-next-line promise/no-callback-in-promise
        callback({
          path: filePath,
        });
      }
    );

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
