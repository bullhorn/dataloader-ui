const { app, BrowserWindow, ipcMain } = require('electron');
const spawn = require('child_process').spawn;

const path = require('path');
const url = require('url');

//./dataloader load examples/load/ClientCorporation.csv
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
    // Create the browser window.
    win = new BrowserWindow({ width: 1200, height: 780 });

    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, './index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

function handleSubmission() {
    let response;
    ipcMain.on('load', (event, argument) => {
        // process.chdir('../dataloader-ui/dataloader');
        console.log(`changing directories to get into dataloader: ${process.cwd()}`);
        // const basic_load = spawn('./dataloader', ['load', 'examples/load/ClientCorporation.csv']);
        //
        // basic_load.stdout.on('data', (data) => {
        //     console.log(`stdout: ${data}`);
        // });
        //
        // basic_load.stderr.on('data', (data) => {
        //     console.log(`stderr: ${data}`);
        // });
        // basic_load.on('close', function(code) {
        //     console.log('closing code: ' + code);
        //     debugger;
        //     response = code;
        //     //Here you can get the exit code of the script
        // });
        const ls = spawn('ls');

        ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        ls.on('close', function(code) {
            console.log('closing code: ' + code);
            debugger;
            return response = code;
            //Here you can get the exit code of the script
        });
    });
    return 'sample response';
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow();
    handleSubmission();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
