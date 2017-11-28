// Angular
import { Injectable } from '@angular/core';
// App
import { ElectronService } from '../electron/electron.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { ISettings } from '../../../interfaces/ISettings';
import { IResults } from '../../../interfaces/IResults';

@Injectable()
export class FileService {
  public static DATALOADER_ROOT = '../dataloader/';
  public static RESULTS_FILE = FileService.DATALOADER_ROOT + 'results.json';
  public static SETTINGS_FILE = './settings.json';

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
      this.electronService.fs.writeFile(FileService.SETTINGS_FILE, JSON.stringify(value, null, 2), (err) => {
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
        total: 1131,
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
      this.electronService.shell.showItemInFolder(FileService.DATALOADER_ROOT + filePath);
    }
  }

  // TODO: Move fakes out to STATIC file.service.fakes.ts
  onResultsFileChange(onChange: (results: IResults) => {}): void {
    if (ElectronService.isElectron()) {
      let options = { persistent: true, interval: 500 };
      this.electronService.fs.watchFile(FileService.RESULTS_FILE, options, this.readResultsFile.bind(this, onChange));
    } else {
      // Call with fake test data for running in `ng serve` mode
      let fakeResults: IResults = {
        processed: 0,
        inserted: 0,
        updated: 0,
        deleted: 0,
        failed: 0,
        successFile: '/Users/nathandickerson/Source/dataloader/results/Candidate_load_2017-11-21_07.20.06_success.csv',
        failureFile: '/Users/nathandickerson/Source/dataloader/results/Candidate_load_2017-11-21_07.20.06_failure.csv',
        logFile: '/Users/nathandickerson/Source/dataloader/log/dataloader_2017-11-20_08.22.21.log',
        startTime: 1511182001000,
        durationMsec: 0,
        errors: [],
      };
      setInterval(() => {
        fakeResults.processed += 6;
        fakeResults.inserted += 3;
        fakeResults.updated += 2;
        fakeResults.failed += 1;
        fakeResults.durationMsec += 1000;
        fakeResults.errors.push({
          row: fakeResults.failed,
          id: fakeResults.failed + 111,
          message: 'com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Bogus\''
        });
        onChange(fakeResults);
      }, 500);
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
