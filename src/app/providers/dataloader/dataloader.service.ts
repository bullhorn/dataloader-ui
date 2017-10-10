// Angular
import { Injectable } from '@angular/core';
// App
import { ElectronService } from '../electron/electron.service';
import { FileService } from '../file/file.service';
import { Utils } from '../../utils/utils';

@Injectable()
export class DataloaderService {

  constructor(private electronService: ElectronService, private fileService: FileService) {
  }

  /**
   * Combines the filePath argument with all of the settings and sends it over to the main process for
   * executing the DataLoader in the correct directory.
   *
   * @param {string} filePath the file provided by the user
   */
  start(filePath: string): void {
    if (ElectronService.isElectron()) {
      let settings: any = this.fileService.readSettings();
      let args: string[] = Utils.createArgs(settings, filePath);
      this.electronService.ipcRenderer.send('start', args);
    }
  }

  /**
   * Subscribe to real time printouts from the DataLoader CLI
   */
  onPrint(callback: (text: string) => void): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on('print', (event, text) => {
        callback(text);
      });
    }
  }

  /**
   * Unsubscribe from printouts from the DataLoader CLI
   */
  removePrintListeners(): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.removeAllListeners('print');
    }
  }
}
