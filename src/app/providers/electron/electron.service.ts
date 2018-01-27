// Angular
import { Injectable } from '@angular/core';
// Vendor
import { ipcRenderer, shell } from 'electron'; // tslint:disable-line

/**
 * If running `npm start`, this will grab the appropriate Electron imports in one place to hand to Angular.
 * If running `ng serve`, this will allow Electron imports to be null.
 */
@Injectable()
export class ElectronService {
  app: any;
  csv: any;
  fs: any;
  ipcRenderer: any;
  os: any;
  process: any;
  shell: any;
  spawn: any;

  /**
   * Conditional Imports of Electron Dependencies, so we can run in `ng serve` mode for dev testing.
   *
   * Using window.require to use the Electron provided version, not the version provided by webpack:
   * https://github.com/electron/electron/issues/7300
   */
  constructor() {
    if (ElectronService.isElectron()) {
      this.app = window.require('electron').remote.app;
      this.csv = window.require('fast-csv');
      this.fs = window.require('fs');
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.os = window.require('os');
      this.process = window['process'];
      this.shell = window.require('electron').shell;
      this.spawn = window.require('child_process').spawn;
    }
  }

  static isElectron(): void {
    return window && window['process'] && window['process'].type;
  }
}
