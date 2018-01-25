import { app, BrowserWindow, dialog, shell } from 'electron';
import * as path from 'path';

export let menuTemplate: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'Edit',
    submenu: [{
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    }, {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }]
  },
  {
    label: 'View',
    submenu: [{
      label: 'Toggle Full Screen',
      accelerator: (() => {
        if (process.platform === 'darwin') {
          return 'Ctrl+Command+F'
        } else {
          return 'F11'
        }
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
        }
      }
    }, {
      type: 'separator'
    }, {
      label: 'Results Files',
      click: () => {
        shell.showItemInFolder(path.join(app.getPath('userData'), '/results'));
      }
    }, {
      label: 'Log Files',
      click: () => {
        shell.showItemInFolder(path.join(app.getPath('userData'), '/log'));
      }
    }, {
      label: 'Example Files',
      click: () => {
        shell.showItemInFolder(path.join(app.getAppPath(), 'dataloader', 'examples', 'load', 'Appointment.csv').replace('app.asar', 'app.asar.unpacked'));
      }
    }, {
      type: 'separator'
    }, {
      label: 'Developer',
      submenu: [{
        label: 'Toggle Developer Tools',
        accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Alt+Command+I'
          } else {
            return 'Ctrl+Shift+I'
          }
        })(),
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.webContents.toggleDevTools();
          }
        }
      }]
    }]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'About',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          const options = {
            type: 'info',
            title: 'DataLoader UI',
            buttons: ['Close'],
            message: 'DataLoader UI Version: 1.0.0 - BETA.\n DataLoader Version: 3.7.1'
          };
          dialog.showMessageBox(focusedWindow, options, () => {
          })
        }
      }
    }, {
      type: 'separator'
    }, {
      label: 'Wiki',
      click: () => {
        shell.openExternal('http://github.com/bullhorn/dataloader/wiki')
      }
    }]
  }];

// Use standard menu submenu for the mac's app menu item
if (process.platform === 'darwin') {
  const name: string = app.getName();
  menuTemplate.unshift(
    {
      label: name,
      submenu: [{
        label: `About ${name}`,
        role: 'about'
      }, {
        type: 'separator'
      }, {
        label: 'Services',
        role: 'services',
        submenu: []
      }, {
        type: 'separator'
      }, {
        label: `Hide ${name}`,
        accelerator: 'Command+H',
        role: 'hide'
      }, {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      }, {
        label: 'Show All',
        role: 'unhide'
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        }
      }]
    }
  );
}

