// Angular
import { Injectable } from '@angular/core';
// App
import { ElectronService } from '../electron/electron.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { ISettings } from '../../../interfaces/ISettings';
import { IResults } from '../../../interfaces/IResults';

@Injectable()
export class FileService {
  private settingsFile: string = 'settings.json';
  static RESULTS_FILE = './results.json';
  static SETTINGS_FILE = './settings.json';

  constructor(private electronService: ElectronService) {
  }

  readSettings(): ISettings {
    let settings: ISettings;
    if (ElectronService.isElectron()) {
      settings = JSON.parse(this.electronService.fs.readFileSync(FileService.SETTINGS_FILE, 'utf8'));
    } else {
      // Call with fake test data for running in `ng serve` mode
      settings = {
        username: 'jsmith',
        password: 'password!',
        clientId: '12345',
        clientSecret: '67890',
        dataCenter: 'west',
        authorizeUrl: '',
        tokenUrl: '',
        loginUrl: '',
        listDelimiter: ';',
        dateFormat: 'MM/dd/yyyy',
        numThreads: 15,
      };
    }
    return settings;
  }

  writeSettings(value: ISettings): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.writeFile(this.settingsFile, JSON.stringify(value, null, 2), (err) => {
        if (err) {
          return console.error(err); // tslint:disable-line:no-console
        }
      });
    }
  }

  /**
   * Returns the total number of rows and the first 100 rows of CSV data with the following format:
   *
   * {
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
   *
   * @param {string} filePath
   * @param onSuccess
   */
  getCsvPreviewData(filePath: string, onSuccess: (previewData: IPreviewData) => {}): void {
    if (ElectronService.isElectron()) {
      const MAX_ROWS: number = 100;
      let previewData: IPreviewData = {
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
          onSuccess(previewData);
        })
        .on('error', (error) => {
          console.error(error); // tslint:disable-line:no-console
        });
    } else {
      // Call with fake test data for running in `ng serve` mode
      onSuccess({
        total: 3,
        headers: ['firstName', 'lastName', 'email'],
        data: [{
          firstName: 'John',
          lastName: 'Smith',
          email: 'jsmith@example.com',
        }, {
          firstName: 'John',
          lastName: 'Doe',
          email: 'jdoe@example.com',
        }, {
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jdoe@example.com',
        }],
      });
    }
  }

  openFile(filePath: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.shell.showItemInFolder(filePath);
    }
  }

  onResultsFileChange(onChange: (results: IResults) => {}): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.watchFile(FileService.RESULTS_FILE, this.readResultsFile.bind(this, onChange));
    } else {
      // Call with fake test data for running in `ng serve` mode
      let fakeResults: IResults = {
        total: 0,
        success: 0,
        failure: 0,
      };
      setInterval(() => {
        fakeResults.total += 3;
        fakeResults.success += 2;
        fakeResults.failure += 1;
        onChange(fakeResults);
      }, 1000);
    }
  }

  unsubscribe() {
    if (ElectronService.isElectron()) {
      this.electronService.fs.unwatchFile(FileService.RESULTS_FILE);
    }
  }

  private readResultsFile(onChange: (results: IResults) => {}): void {
    let results: IResults = JSON.parse(this.electronService.fs.readFileSync(FileService.RESULTS_FILE, 'utf8'));
    onChange(results);
  }
}
