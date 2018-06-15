import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { ChildProcess, spawn } from 'child_process';
import { glob } from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { menuTemplate } from './menu';
import * as dotenv from 'dotenv';
import * as request from 'request';
import { ILevel } from './IMessage';

dotenv.config();

// The --serve argument will run electron in development mode
const args: string[] = process.argv.slice(1);
const serve: boolean = args.some((arg) => arg === '--serve');

// The path to the application's user data folder and Data Loader CLI
const userDataDir: string = serve ? path.resolve('userData') : app.getPath('userData');
const dataloaderDir: string = serve ? path.resolve('dataloader') : path.join(app.getAppPath(), 'dataloader').replace('app.asar', 'app.asar.unpacked');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow = null;

// Keep a global reference to the single dataloader process that we spawn/kill
let dataloaderProcess: ChildProcess = null;

// Creates the chromium browser window and points to the Angular app
function createWindow(): void {
  const menu: Electron.Menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({ width: 800, height: 600, minWidth: 640, minHeight: 440 });
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
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
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
 *  - message(message: IMessage): Log/Warning/Error messages to display to the user
 */
ipcMain.on('start', (event: Electron.Event, params: string[]) => {
  // Locate the jar file
  const jarFiles: string[] = glob.sync('dataloader-*.jar', { cwd: dataloaderDir });
  if (!jarFiles.length) {
    return event.sender.send('message', {
      level: ILevel.Error,
      title: 'Data Loader CLI is Missing!',
      message: `Something went wrong with the app system directory. Cannot locate dataloader.jar file in directory: ${dataloaderDir}`,
    });
  }

  // Copy over the properties file if it does not already exist in the user's data directory
  const orig: string = path.join(dataloaderDir, 'dataloader.properties');
  const dest: string = path.join(userDataDir, 'dataloader.properties');
  if (fs.existsSync(orig) && !fs.existsSync(dest)) {
    fs.writeFileSync(dest, fs.readFileSync(orig));
  }

  // Output Data Loader version info
  let version: string = path.basename(jarFiles[0], '.jar').split('-')[1];
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
});

ipcMain.on('stop', () => {
  if (dataloaderProcess) {
    dataloaderProcess.kill('SIGINT');
  }
});

ipcMain.on('checkForUpdates', (event: Electron.Event) => {
  const GH_TOKEN: string = process.env.GH_DATALOADER_TOKEN;
  const BASE_URL: string = `https://${GH_TOKEN}:@api.github.com/repos/bullhorn/dataloader-ui`;

  if (!GH_TOKEN) {
    return event.sender.send('message', {
      level: ILevel.Error,
      title: 'Error Checking for New Version',
      message: `ERROR: cannot check for latest Data Loader UI release - missing the 'GH_DATALOADER_TOKEN' environment variable.`,
    });
  }

  const latestReleaseAssets: any = {
    url: `${BASE_URL}/releases/latest`,
    headers: {
      'User-Agent': 'Data Loader UI Downloader',
    },
  };

  request(latestReleaseAssets, (error, response, bodyString) => {
    if (error) {
      return event.sender.send('message', {
        level: ILevel.Error,
        title: 'Error Checking for New Version',
        message: `Cannot contact the Data Loader UI repo - ${error}`,
      });
    }

    event.sender.send('message', {
      level: ILevel.Log,
      message: 'Checking for new release of the Data Loader App...',
    });

    const body: any = JSON.parse(bodyString);
    if (!body.tag_name) {
      return event.sender.send('message', {
        level: ILevel.Error,
        title: 'Error Checking for New Version',
        message: `Cannot access the latest release of the Data Loader UI repo.`,
      });
    }

    const version: string = body.tag_name.slice(1); // `v1.2.3` minus the `v`

    if (app.getVersion() === version) {
      return event.sender.send('message', {
        level: ILevel.Log,
        message: `The Data Loader App is up to date. Latest release version: ${version}...`,
      });
    }

    event.sender.send('message', {
      level: ILevel.Log,
      message: `Downloading new version of the Data Loader App: ${version}...`,
    });

    const installer: string = process.platform === 'darwin' ? `dataloader-ui-${version}.dmg` : `dataloader-ui-setup-${version}.exe`;
    const filePath: string = path.join(userDataDir, installer);
    if (fs.existsSync(filePath)) {
      event.sender.send('message', {
        level: ILevel.Log,
        message: `Version ${version} has already been downloaded to: ${filePath}`,
      });
      event.sender.send('update', { version, filePath });
    }

    const assetID: number = body.assets.find((asset) => asset.name === installer).id;
    if (!assetID) {
      return event.sender.send('message', {
        level: ILevel.Error,
        title: 'Error Downloading New Version',
        message: `Cannot download the latest installer file - ${installer}`,
      });
    }

    const downloadInstaller: any = {
      url: `${BASE_URL}/releases/assets/${assetID}`,
      headers: {
        'Accept': 'application/octet-stream',
        'User-Agent': 'Data Loader UI Downloader',
      },
      encoding: null, // we want a buffer and not a string
    };

    request.get(downloadInstaller)
      .pipe(fs.createWriteStream(filePath))
      .on('finish', () => {
        event.sender.send('message', {
          level: ILevel.Log,
          message: `Finished downloading version ${version} to: ${filePath}`,
        });
        event.sender.send('update', { version, filePath });
      })
      .on('error', (err) => {
        return event.sender.send('message', {
          level: ILevel.Error,
          title: 'Error Downloading New Version',
          message: `Cannot download the latest installer file - ${err}`,
        });
      });
  });
});
