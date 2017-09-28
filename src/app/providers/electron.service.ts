import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, shell } from 'electron';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as csv from 'fast-csv';

// Required to satisfy Typescript not knowing about the Electron provided 'window.require'
declare global {
  interface Window {
    require: any;
  }
}

/**
 * If running `npm start`, this will grab the appropriate Electron imports in one place to hand to Angular.
 * If running `ng serve`, this will allow Electron imports to be null.
 */
@Injectable()
export class ElectronService {

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
    if (this.isElectron()) {
      this.csv = window.require('fast-csv');
      this.fs = window.require('fs');
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.os = window.require('os');
      this.process = window['process'];
      this.shell = window.require('electron').shell;
      this.spawn = window.require('child_process').spawn;
    }
  }

  isElectron = () => {
    return window && window['process'] && window['process'].type;
  }
}
