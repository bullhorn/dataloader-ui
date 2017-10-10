// Angular
import { Injectable } from '@angular/core';
// App
import { ElectronService } from '../electron/electron.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { ISettings } from '../../../interfaces/ISettings';

@Injectable()
export class FileService {
  private settingsFile: string = 'settings.json';

  constructor(private electronService: ElectronService) {
  }

  readSettings(): ISettings {
    let settings: any = {};
    if (ElectronService.isElectron()) {
      settings = JSON.parse(this.electronService.fs.readFileSync('settings.json', 'utf8'));
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
      let maxRows: number = 100;
      let previewData: IPreviewData = {
        total: 0,
        data: [],
      };

      this.electronService.csv.fromPath(filePath, { headers: true, })
        .on('data', (row) => {
          previewData.total++;
          if (previewData.total <= maxRows) {
            previewData.data.push(row);
          }
        })
        .on('end', () => {
          onSuccess(previewData);
        })
        .on('error', (error) => {
          console.error(error); // tslint:disable-line:no-console
        });
    }
  }

  openFile(filePath: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.shell.showItemInFolder(filePath);
    }
  }
}
