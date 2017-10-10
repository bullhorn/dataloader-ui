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
    this.subscribe('print', callback);
  }

  /**
   * Subscribe to the done message from the DataLoader CLI
   */
  onDone(callback: (code: string) => void): void {
    this.subscribe('done', callback);
  }

  /**
   * Unsubscribe from all events from the DataLoader CLI
   */
  unsubscribe(): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.removeAllListeners('print');
      this.electronService.ipcRenderer.removeAllListeners('done');
    }
  }

  /**
   * Subscribe to real time printouts from the DataLoader CLI
   */
  private subscribe(channel: string, callback: (text: string) => void): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on(channel, (event, text) => {
        callback(text);
      });
    }
  }
}
