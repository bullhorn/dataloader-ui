// Angular
import { Injectable } from '@angular/core';
// App
import { ElectronService } from '../electron/electron.service';
import { FileService } from '../file/file.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { Utils } from '../../utils/utils';
import { DataloaderServiceFakes } from './dataloader.service.fakes';

@Injectable()
export class DataloaderService {

  constructor(private electronService: ElectronService,
              private fileService: FileService) {
  }

  /**
   * Combines the filePath argument with all of the settings and sends it over to the main process for
   * executing the DataLoader in the correct directory.
   *
   * Saves off the previewData for the history.
   *
   * @param {IPreviewData} previewData
   */
  start(previewData: IPreviewData): void {
    if (ElectronService.isElectron()) {
      let settings: any = this.fileService.readSettings();
      let resultsFilePath: string = this.fileService.initializeResultsFile(previewData);
      let args: string[] = Utils.createArgs(settings, previewData, resultsFilePath);
      this.electronService.ipcRenderer.send('start', args);
    }
  }

  /**
   * Stops the dataloader java process, same as pressing CTRL+C
   */
  stop(): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.send('stop');
    }
  }

  /**
   * Subscribe to real time printouts from the DataLoader CLI
   */
  onPrint(callback: (text: string) => void): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on('print', (event, text) => callback(text));
    } else {
      DataloaderServiceFakes.generateFakePrintCallbacks(callback);
    }
  }

  /**
   * Subscribe to the done message from the DataLoader CLI
   */
  onDone(callback: (text: string) => void): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on('done', (event, text) => callback(text));
    } else {
      DataloaderServiceFakes.generateFakeDoneCallback(callback);
    }
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
}
