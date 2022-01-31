// Angular
import { Injectable } from '@angular/core';
// Vendor
// noinspection ES6UnusedImports
import { ipcRenderer, shell } from 'electron';

/**
 * If running `npm start`, this will grab the appropriate Electron imports in one place to hand to Angular.
 * If running `ng serve`, this will allow Electron imports to be null.
 */
@Injectable()
export class ElectronService {
  static LICENSE_VERSION = 1; // Version 1 = March 30, 2020

  app: any;
  csv: any;
  dialog: any;
  fs: any;
  fullName: any;
  getIp: any;
  ipcRenderer: any;
  os: any;
  path: any;
  process: any;
  rimraf: any;
  shell: any;
  spawn: any;
  username: any;

  /**
   * Conditional Imports of Electron Dependencies, so we can run in `ng serve` mode for dev testing.
   *
   * Use window.require to use the Electron provided version, not the version provided by webpack:
   * https://github.com/electron/electron/issues/7300
   */
  constructor() {
    if (ElectronService.isElectron()) {
      const { promisify } = require('util');
      this.app = window.require('@electron/remote').app;
      this.csv = window.require('fast-csv');
      this.dialog = window.require('@electron/remote').dialog;
      this.fs = window.require('fs');
      this.fullName = window.require('fullname');
      this.getIp = promisify(window.require('external-ip')());
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.os = window.require('os');
      this.path = window.require('path');
      this.process = window['process'];
      this.rimraf = window.require('rimraf');
      this.shell = window.require('electron').shell;
      this.spawn = window.require('child_process').spawn;
      this.username = window.require('username');
    }
  }

  /**
   * Returns the version of the UI from package.json when packaged
   *  - During testing using `npm start`, returns the Electron package.json version
   *  - During web-only testing, returns 'NEXT'
   */
  version(): string {
    return ElectronService.isElectron() ? this.app.getVersion() : 'NEXT';
  }

  static isElectron(): boolean {
    return !!window && !!window['process'] && !!window['process'].type;
  }
}
