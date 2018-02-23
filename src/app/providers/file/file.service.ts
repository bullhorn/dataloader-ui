// Angular
import { Injectable } from '@angular/core';
// Vendor
import * as path from 'path';
// App
import { ElectronService } from '../electron/electron.service';
import { FileServiceFakes } from './file.service.fakes';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IResults } from '../../../interfaces/IResults';
import { IRun } from '../../../interfaces/IRun';
import { ISettings } from '../../../interfaces/ISettings';
import { environment } from '../../../environments/environment';

@Injectable()
export class FileService {
  // The last file preview is stored here for access by all components
  previewData: IPreviewData;

  private defaultSettings: ISettings = {
    username: '',
    password: '',
    clientId: '',
    clientSecret: '',
    dataCenter: 'bhnext',
    listDelimiter: ';',
    dateFormat: 'MM/dd/yy HH:mm',
    authorizeUrl: '',
    loginUrl: '',
    tokenUrl: '',
    numThreads: 15,
  };
  private userDataDir: string;
  private runDir: string;
  private resultsFile: string;
  private settingsFile: string;

  constructor(private electronService: ElectronService) {
    if (ElectronService.isElectron()) {
      this.userDataDir = environment.production ? this.electronService.app.getPath('userData') : 'userData';
      this.settingsFile = path.join(this.userDataDir, 'settings.json');
    }
  }

  /**
   * Creates a directory for the current run and a place for the results.json file to be output by Data Loader.
   *
   * @param {IPreviewData} previewData the preview data to save in the current run folder
   * @returns {string} the results filepath for Data Loader to use when outputting results
   */
  initializeResultsFile(previewData: IPreviewData): string {
    if (ElectronService.isElectron()) {
      // Create directory for the run where the dir name is the current timestamp
      let date: Date = new Date();
      let timestamp: string = date.getTime().toString();
      this.runDir = path.join(this.userDataDir, 'runs', timestamp);
      this.resultsFile = path.join(this.runDir, 'results.json');

      // Save off previewData for this run
      this.electronService.fs.mkdirSync(this.runDir);
      this.writePreviewData(previewData, path.join(this.runDir, 'previewData.json'));
    }
    return this.resultsFile;
  }

  readSettings(): ISettings {
    if (ElectronService.isElectron()) {
      if (this.electronService.fs.existsSync(this.settingsFile)) {
        return JSON.parse(this.electronService.fs.readFileSync(this.settingsFile, 'utf8'));
      } else {
        return this.defaultSettings;
      }
    } else {
      return FileServiceFakes.SETTINGS;
    }
  }

  writeSettings(settings: ISettings): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, 2));
    }
  }

  /**
   * Returns the total number of rows and the first 100 rows of CSV data with the following format:
   *
   * {
   *    filePath: 'Path/to/Candidate.csv',
   *    total: 12345,
   *    headers: ['firstName', 'lastName'],
   *    data: [{
   *        firstName: 'Jack',
   *        lastName: 'Ryan'
   *      }, {
   *        firstName: 'Jill',
   *        lastName: 'Bryan'
   *    }]
   * }
   */
  getCsvPreviewData(filePath: string, onSuccess: (previewData: IPreviewData) => {}): void {
    if (ElectronService.isElectron()) {
      const MAX_ROWS: number = 100;
      let previewData: IPreviewData = {
        filePath: filePath,
        total: 0,
        headers: [],
        data: [],
      };

      this.electronService.csv.fromPath(filePath, { headers: true, })
        .on('data', (row) => {
          previewData.total++;
          if (previewData.headers.length === 0) {
            previewData.headers = Object.keys(row);
          }
          if (previewData.total <= MAX_ROWS) {
            previewData.data.push(row);
          }
        })
        .on('end', () => {
          this.previewData = previewData;
          onSuccess(previewData);
        })
        .on('error', (error) => {
          console.error(error); // tslint:disable-line:no-console
        });
    } else {
      this.previewData = FileServiceFakes.PREVIEW_DATA;
      onSuccess(FileServiceFakes.PREVIEW_DATA);
    }
  }

  writePreviewData(previewData: IPreviewData, filePath: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.writeFileSync(filePath, JSON.stringify(previewData, null, 2));
    }
  }

  getAllRuns(): IRun[] {
    return FileServiceFakes.FAKE_RUNS;
  }

  openFile(filePath: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.shell.showItemInFolder(path.join(this.userDataDir, filePath));
    }
  }

  onResultsFileChange(onChange: (results: IResults) => {}): void {
    if (ElectronService.isElectron()) {
      let options: { persistent?: boolean; interval?: number; } = { persistent: true, interval: 500 };
      this.electronService.fs.watchFile(this.resultsFile, options, this.readResultsFile.bind(this, onChange));
    } else {
      FileServiceFakes.generateFakeResults(onChange);
    }
  }

  unsubscribe(): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.unwatchFile(this.resultsFile);
    }
  }

  private readResultsFile(onChange: (results: IResults) => {}): void {
    this.electronService.fs.readFile(this.resultsFile, 'utf8', (err, data) => {
      if (!err) {
        let results: IResults = JSON.parse(data);
        onChange(results);
      }
    });
  }
}
