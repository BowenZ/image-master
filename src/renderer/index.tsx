import { ChannelsEnum } from 'main/types';
import { createRoot } from 'react-dom/client';
import 'windi.css';
import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);

console.log('====window.electron====', window.electron);
if (window.electron) {
  // calling IPC exposed from preload script
  window.electron.ipcRenderer.once(ChannelsEnum.EXAMPLE, (arg) => {
    // eslint-disable-next-line no-console
    console.log('renderer:', arg);
  });
  window.electron.ipcRenderer.sendMessage(ChannelsEnum.EXAMPLE, ['ping']);
}
