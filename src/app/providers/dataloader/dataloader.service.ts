// Angular
import { Injectable } from '@angular/core';
// App
import { DataloaderServiceFakes } from './dataloader.service.fakes';
import { ElectronService } from '../electron/electron.service';
import { FileService } from '../file/file.service';
import { Utils } from '../../utils/utils';
import { Error, PreviewData, Settings } from '../../../interfaces';

@Injectable()
export class DataloaderService {

  constructor(private electronService: ElectronService,
              private fileService: FileService) {
  }

  /**
   * Combines the filePath argument with all of the settings and sends it over to the main process for
   * using the Data Loader to load the given csv file in the correct directory.
   *
   * Saves off the previewData for the history.
   *
   * @param {PreviewData} previewData
   */
  load(previewData: PreviewData): void {
    if (ElectronService.isElectron()) {
      const settings: Settings = this.fileService.readSettings();
      const resultsFilePath: string = this.fileService.initializeResultsFile(previewData);
      this.electronService.ipcRenderer.send('start', Utils.loadArgs(settings, previewData, resultsFilePath));
    }
  }

  /**
   * Checks the login for the given credentials.
   */
  login(settings: Settings): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.send('start', Utils.loginArgs(settings));
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
  onPrint(callback: (text: string) => void, caller: 'load' | 'login'): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on('print', (event, text) => callback(text));
    } else if (caller === 'load') {
      DataloaderServiceFakes.generateFakePrintLoadCallbacks(callback);
    } else if (caller === 'login') {
      DataloaderServiceFakes.generateFakePrintLoginCallback(callback);
    }
  }

  /**
   * Subscribe to the done message from the Data Loader CLI
   */
  onDone(callback: (text: string) => void, caller: 'load' | 'login'): void {
    if (ElectronService.isElectron()) {
      this.electronService.ipcRenderer.on('done', (event, text) => callback(text));
    } else if (caller === 'load') {
      DataloaderServiceFakes.generateFakeDoneLoadCallback(callback);
    } else if (caller === 'login') {
      DataloaderServiceFakes.generateFakeDoneLoginCallback(callback);
    }
  }

  /**
   * Subscribe to messages from the main process that the user should be notified about.
   *
   * @param {(error: IError) => void} errorCallback - Generic error callback
   * @param {(error: IError) => void} missingJavaCallback - Specific callback for missing Java on the command line
   * @param {() => void} aboutCallback - Shows the about dialog
   */
  onMessages(errorCallback: (error: Error) => void, missingJavaCallback: (error: Error) => void, aboutCallback: () => void): void {
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
}
