import { app, BrowserWindow, shell } from 'electron';
import * as path from 'path';

export function getMenuTemplate(mainWindow: BrowserWindow): Electron.MenuItemConstructorOptions[] {
  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectAll',
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F';
            } else {
              return 'F11';
            }
          })(),
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Results Files',
          click: () => {
            shell.showItemInFolder(path.join(app.getPath('userData'), '/results'));
          },
        },
        {
          label: 'Log Files',
          click: () => {
            shell.showItemInFolder(path.join(app.getPath('userData'), '/log'));
          },
        },
        {
          label: 'Example Files',
          click: () => {
            shell.showItemInFolder(
              path
                .join(app.getAppPath(), 'dataloader', 'examples', 'load', 'Appointment.csv')
                .replace('app.asar', 'app.asar.unpacked'),
            );
          },
        },
        {
          // Eventually either remove the developer option, or extend it to provide the log file location for even more testing
          type: 'separator',
        },
        {
          label: 'Developer',
          submenu: [
            {
              label: 'Toggle Developer Tools',
              accelerator: (() => {
                if (process.platform === 'darwin') {
                  return 'Alt+Command+I';
                } else {
                  return 'Ctrl+Shift+I';
                }
              })(),
              click: (item, focusedWindow) => {
                if (focusedWindow) {
                  focusedWindow.webContents.toggleDevTools();
                }
              },
            },
          ],
        },
      ],
    },
    {
      label: 'Help',
      role: 'help',
      submenu: [
        {
          label: 'About',
          click: () => {
            mainWindow.webContents.send('about');
          },
        },
        {
          label: 'Wiki',
          click: () => {
            shell.openExternal('http://github.com/bullhorn/dataloader/wiki');
          },
        },
      ],
    },
  ];

  // Use standard menu submenu for the mac's app menu item
  if (process.platform === 'darwin') {
    menuTemplate.unshift({
      label: app.name,
      submenu: [
        {
          label: `About ${app.name}`,
          role: 'about',
        },
        {
          type: 'separator',
        },
        {
          label: 'Services',
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${app.name}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Alt+H',
          role: 'hideOthers',
        },
        {
          label: 'Show All',
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    });
  }

  return menuTemplate;
}
