// Angular
import { Injectable } from '@angular/core';
// App
import { DataloaderServiceFakes } from './dataloader.service.fakes';
import { ElectronService } from '../electron/electron.service';
import { FileService } from '../file/file.service';
import { IError } from '../../../interfaces/IError';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { Utils } from '../../utils/utils';

@Injectable()
export class DataloaderService {

  constructor(private electronService: ElectronService,
              private fileService: FileService) {
  }

  /**
   * Combines the filePath argument with all of the settings and sends it over to the main process for
   * executing the Data Loader in the correct directory.
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
   * Subscribe to real time printouts from the Data Loader CLI
   */
  onPrint(callback: (text: string) => void): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on('print', (event, text) => callback(text));
    } else {
      DataloaderServiceFakes.generateFakePrintCallbacks(callback);
    }
  }

  /**
   * Subscribe to the done message from the Data Loader CLI
   */
  onDone(callback: (text: string) => void): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on('done', (event, text) => callback(text));
    } else {
      DataloaderServiceFakes.generateFakeDoneCallback(callback);
    }
  }

  /**
   * Subscribe to messages from the main process that the user should be notified about.
   *
   * @param {(error: IError) => void} errorCallback - Generic error callback
   * @param {(error: IError) => void} missingJavaCallback - Specific callback for missing Java on the command line
   * @param {() => void} aboutCallback - Shows the about dialog
   */
  onMessages(errorCallback: (error: IError) => void, missingJavaCallback: (error: IError) => void, aboutCallback: () => void): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on('error', (event, error) => errorCallback(error));
      this.electronService.ipcRenderer.on('missing-java', (event, error) => missingJavaCallback(error));
      this.electronService.ipcRenderer.on('about', () => aboutCallback());
    } else {
      DataloaderServiceFakes.generateFakeErrorCallback(errorCallback);
      DataloaderServiceFakes.generateFakeMissingJavaCallback(missingJavaCallback);
    }
  }

  /**
   * Unsubscribe from all events from the Data Loader CLI
   */
  unsubscribe(): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.removeAllListeners('print');
      this.electronService.ipcRenderer.removeAllListeners('done');
    }
  }

  /**
   * Returns the version of the UI from package.json
   */
  version(): string {
    return ElectronService.isElectron() ? this.electronService.app.getVersion() : 'NEXT';
  }
}
