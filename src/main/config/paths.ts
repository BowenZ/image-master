import { app } from 'electron';
import path from 'path';

export const imgBakDirPath = path.join(app.getPath('userData'), 'tmp');
