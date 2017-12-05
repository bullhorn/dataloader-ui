import { app, BrowserWindow, ipcMain } from 'electron';
import { ChildProcess, spawn } from 'child_process';

// The --serve argument will run electron in development mode
const args: string[] = process.argv.slice(1);
const serve: boolean = args.some((arg) => arg === '--serve');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow = null;

// Keep a global reference to the single dataloader process that we spawn/kill
let dataloaderProcess: ChildProcess = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
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
 * Incoming events:
 *  - start(params: string[]): kick off CLI with given arguments array
 *
 * Outgoing events:
 *  - data(text: string): line of text output from CLI
 *  - close(code: number): CLI is finished
 */
ipcMain.on('start', (event: Electron.Event, params: string[]) => {
  // TODO: Save the dataloader cli location in config
  // Execute dataloader in separate process
  params.unshift('-jar', 'target/dataloader-3.7.1-SNAPSHOT.jar');
  dataloaderProcess = spawn('java', params, {
    cwd: '../dataloader',
    detached: true
  });

  dataloaderProcess.stdout.on('data', (data) => {
    event.sender.send('print', data.toString());
  });
  dataloaderProcess.stderr.on('data', (data) => {
    event.sender.send('print', data.toString());
  });
  dataloaderProcess.on('close', (code) => {
    event.sender.send('done', code);
  });
});

ipcMain.on('stop', () => {
  if (dataloaderProcess) {
    dataloaderProcess.kill('SIGINT');
  }
});
