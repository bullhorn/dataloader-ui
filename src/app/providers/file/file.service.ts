// Angular
import { Injectable } from '@angular/core';
// App
import { ElectronService } from '../electron/electron.service';
import { FileServiceFakes } from './file.service.fakes';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IResults } from '../../../interfaces/IResults';
import { ISettings } from '../../../interfaces/ISettings';

@Injectable()
export class FileService {
  public static DATALOADER_ROOT = '../dataloader/';
  public static RESULTS_FILE = FileService.DATALOADER_ROOT + 'results.json';
  public static SETTINGS_FILE = './settings.json';

  constructor(private electronService: ElectronService) {
  }

  readSettings(): ISettings {
    if (ElectronService.isElectron()) {
      return JSON.parse(this.electronService.fs.readFileSync(FileService.SETTINGS_FILE, 'utf8'));
    } else {
      return FileServiceFakes.SETTINGS;
    }
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
      onSuccess(FileServiceFakes.PREVIEW_DATA);
    }
  }

  openFile(filePath: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.shell.showItemInFolder(FileService.DATALOADER_ROOT + filePath);
    }
  }

  onResultsFileChange(onChange: (results: IResults) => {}): void {
    if (ElectronService.isElectron()) {
      let options = { persistent: true, interval: 500 };
      this.electronService.fs.watchFile(FileService.RESULTS_FILE, options, this.readResultsFile.bind(this, onChange));
    } else {
      FileServiceFakes.generateFakeResults(onChange);
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
