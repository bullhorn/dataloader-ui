import * as e from 'electron';
import { ChildProcess, spawn } from 'child_process';
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { getMenuTemplate } from './menu';

const electron = e.remote ? e.remote : e;

// The --serve argument will run electron in development mode
const args: string[] = process.argv.slice(1);
const serve: boolean = args.some((arg) => arg === '--serve');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow = null;

// Keep a global reference to the single dataloader process that we spawn/kill
let dataloaderProcess: ChildProcess = null;

function createWindow(): void {
  mainWindow = new electron.BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 640,
    minHeight: 440,
    webPreferences: {
      nodeIntegration: true,
    }
  });
  const menu: Electron.Menu = electron.Menu.buildFromTemplate(getMenuTemplate(mainWindow));
  electron.Menu.setApplicationMenu(menu);
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  if (serve) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    // Dereference the window object.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.on('ready', createWindow);

// Quit when all windows are closed.
electron.app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Inter-process Communication with DataLoader CLI
 *
 * Incoming events from renderer process:
 *  - start(params: string[]): kick off CLI with given arguments array
 *
 * Outgoing events to renderer process:
 *  - print(text: string): line of text output from CLI
 *  - done(error: string): CLI is finished, with error text only if there was an error
 */
electron.ipcMain.on('start', (event: Electron.IpcMainEvent, params: string[]) => {
  const userDataDir: string = serve ? path.resolve('userData') : electron.app.getPath('userData');
  const dataloaderDir: string = serve ?
    path.resolve('dataloader') :
    path.join(electron.app.getAppPath(), 'dataloader').replace('app.asar', 'app.asar.unpacked');

  // Locate the jar file
  const jarFiles: string[] = glob.sync('dataloader-*.jar', { cwd: dataloaderDir });
  if (!jarFiles.length) {
    event.sender.send('error', {
      title: 'Data Loader CLI is Missing!',
      message: `Something went wrong with the app system directory. Cannot locate dataloader.jar file in directory: ${dataloaderDir}`,
    });
    return;
  }

  // Copy over the properties file if it does not already exist in the user's data directory
  const orig: string = path.join(dataloaderDir, 'dataloader.properties');
  const dest: string = path.join(userDataDir, 'dataloader.properties');
  if (fs.existsSync(orig) && !fs.existsSync(dest)) {
    fs.writeFileSync(dest, fs.readFileSync(orig));
  }

  // Output Data Loader version info
  const version: string = path.basename(jarFiles[0], '.jar').split('-')[1];
  event.sender.send('print', `Data Loader CLI v${version}\n`);

  // Execute dataloader in separate process
  params.unshift('-jar', path.join(dataloaderDir, jarFiles[0]));
  dataloaderProcess = spawn('java', params, {
    cwd: userDataDir,
    detached: true,
  });

  dataloaderProcess.stdout.on('data', (data) => {
    event.sender.send('print', data.toString());
  });
  dataloaderProcess.stderr.on('data', (data) => {
    event.sender.send('print', data.toString());
  });
  dataloaderProcess.on('close', () => {
    event.sender.send('done', '');
  });
  dataloaderProcess.on('error', (err) => {
    event.sender.send('missing-java', { title: err.name, message: err.message });
  });
});

electron.ipcMain.on('stop', () => {
  if (dataloaderProcess) {
    dataloaderProcess.kill('SIGINT');
  }
});
