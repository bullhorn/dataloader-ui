import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as log from 'electron-log';
import * as remoteMain from '@electron/remote/main';
import { ChildProcess, spawn } from 'child_process';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';
import { getMenuTemplate } from './menu';

// Initialize the UI thread
remoteMain.initialize();

// The --serve argument will run electron in development mode
const args: string[] = process.argv.slice(1);
const serve: boolean = args.some((arg) => arg === '--serve');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow = null;

// Keep a global reference to the single dataloader process that we spawn/kill
let dataloaderProcess: ChildProcess = null;

function createWindow(): void {
  // Let the auto-updater run in the background, auto-install new updates
  // and install when the app quits.
  log.transports.file.level = 'info';
  autoUpdater.logger = log;
  autoUpdater.checkForUpdatesAndNotify(); // TODO: .then() the promise and allow popup to be shown

  // Create the Chromium window and load the Angular app
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });
  const menu: Electron.Menu = Menu.buildFromTemplate(getMenuTemplate(mainWindow));
  Menu.setApplicationMenu(menu);
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  remoteMain.enable(mainWindow.webContents);

  if (serve) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    // Dereference the Chromium window object that is being closed
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
 *  - 'start': kick off CLI with given command line arguments
 *
 * Outgoing events to renderer process:
 *  - 'print': provides a line of text output from CLI
 *  - 'done': notification that the CLI process has completed
 *  - 'error': generic notification to the UI
 *  - 'missing-java': specific notification that java is missing
 */
ipcMain.on('start', (event: Electron.IpcMainEvent, params: string[]) => {
  log.info(`Start: received ${params.length} params`);
  let stdOutput = false;

  // Version check for triaging any java related issues
  const javaVersionCheckProcess: ChildProcess = spawn('java', ['-version']);
  javaVersionCheckProcess.stderr.on('data', function (data) {
    log.info(`Java Version Check:`, data.toString());
  });

  // Locate the user and application directories
  const userDataDir: string = serve ? path.resolve('userData') : app.getPath('userData');
  const dataloaderDir: string = serve ?
    path.resolve('dataloader') :
    path.join(app.getAppPath(), 'dataloader').replace('app.asar', 'app.asar.unpacked');
  log.info(`Resolved User Data location:`, userDataDir);
  log.info(`Resolved Data Loader location:`, dataloaderDir);

  // Locate the jar file in the application directory
  const jarFiles: string[] = glob.sync('dataloader-*.jar', { cwd: dataloaderDir });
  if (!jarFiles.length) {
    event.sender.send('error', {
      title: 'Data Loader CLI is Missing!',
      message: `Something went wrong with the app system directory. Cannot locate dataloader.jar file in directory: ${dataloaderDir}`,
    });
    return;
  }
  log.info(`Resolved Jar File:`, jarFiles[0]);

  // Copy over the properties file if it does not already exist in the user's data directory
  const orig: string = path.join(dataloaderDir, 'dataloader.properties');
  const dest: string = path.join(userDataDir, 'dataloader.properties');
  if (fs.existsSync(orig) && !fs.existsSync(dest)) {
    log.info(`Copying dataloader.properties file from dataloader to user directory...`);
    fs.writeFileSync(dest, fs.readFileSync(orig));
    log.info(`...Finished copying properties file`);
  }

  // Workaround for Java on Windows not redirecting stdout
  const lastParam = params[params.length - 1];
  const isLogin = lastParam === 'login';
  const isMeta = params[params.length - 2] === 'meta';
  const outputFile = isLogin ? 'login.txt' : isMeta ? 'meta.json' : null;

  // Output Data Loader version info when loading, except when retrieving meta
  if (!isMeta) {
    const version: string = path.basename(jarFiles[0], '.jar').split('-')[1];
    event.sender.send('print', `Data Loader CLI v${version}\n`);
  }

  // Execute dataloader jar in a separate process
  params.unshift('-jar', path.join(dataloaderDir, jarFiles[0]));
  dataloaderProcess = spawn('java', params, {
    cwd: userDataDir,
    detached: true,
  });
  log.info(`Spawned dataloader process with pid:`, dataloaderProcess.pid);

  // Subscribe to all java process events
  dataloaderProcess.stdout.on('data', (data) => {
    log.info(`Process StdOut:`, data.toString());
    event.sender.send('print', data.toString());
    stdOutput = true;
  });
  dataloaderProcess.stderr.on('data', (data) => {
    log.error(`Process StdErr:`, data.toString());
    event.sender.send('print', data.toString());
    event.sender.send('error', {
      title: 'Technical Error Executing Java',
      message: 'This may be due to the version of Java on your machine.' +
        ' Ensure that you have the latest version of Java 1.8 installed,' +
        ' and there are no other competing Java versions installed on your machine.' +
        '\n\nActual error:' + data.toString(),
    });
  });
  dataloaderProcess.on('close', () => {
    log.info(`Process closed - sending 'done' signal to UI`);
    event.sender.send('done', '');
  });
  dataloaderProcess.on('error', (err) => {
    log.error(`Process error: ${err.name} - sending 'missing-java' signal to UI`);
    event.sender.send('missing-java', { title: err.name, message: err.message });
  });
  dataloaderProcess.on('exit', (code, signal) => {
    // In the event of the command returning without any stdout received,
    // read the output file and send through as if it were printed to stdout.
    if (outputFile && !stdOutput) {
      const outputFilePath = path.join(userDataDir, outputFile);
      try {
        log.info(`StdOut is missing. Reading temporary output file: ${outputFilePath}`);
        const outputFileContents = fs.readFileSync(outputFilePath).toString();
        log.info(`Temporary output file Contents: ${outputFileContents}`);
        event.sender.send('print', outputFileContents);
        log.info(`Deleting temporary output file: ${outputFilePath}`);
        fs.unlinkSync(outputFilePath);
      } catch (e) {
        log.warn(`Error reading/deleting temporary file: ${outputFilePath}: ${e}`);
      }
    }
    log.info(`Process exit. code: ${code}, signal: ${signal}`);
  });
  dataloaderProcess.on('message', (message, sendHandle) => {
    log.warn(`Process message: ${message}, sendHandle: ${sendHandle}`);
  });
  dataloaderProcess.on('disconnect', () => {
    log.error(`Process disconnected`);
  });
});

ipcMain.on('stop', () => {
  log.info(`Received STOP command. Dataloader Process running:`, !!dataloaderProcess);
  if (dataloaderProcess) {
    log.info(`Sending SIGINT kill command to process:`, dataloaderProcess.pid);
    dataloaderProcess.kill('SIGINT');
  }
});
