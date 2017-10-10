// Angular
import { Injectable } from '@angular/core';
// App
import { ElectronService } from '../electron/electron.service';
import { Utils } from '../../utils/utils';

@Injectable()
export class FileService {
  private settingsFile: string = 'settings.json';

  constructor(private electronService: ElectronService) {
  }

  readSettings(): any {
    let settings: any = {};
    if (ElectronService.isElectron()) {
      settings = JSON.parse(this.electronService.fs.readFileSync('settings.json', 'utf8'));
    }
    return settings;
  }

  writeSettings(value: any): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.writeFile(this.settingsFile, JSON.stringify(value, null, 2), (err) => {
        if (err) {
          return console.error(err); // tslint:disable-line:no-console
        }
      });
    }
  }

  getCsvPreviewData(filePath: string, onSuccess: any): void {
    if (ElectronService.isElectron()) {
      let rowCount: number = 0;
      let previewData: any[] = [];
      let options: any = {
        headers: true,
      };

      let csvStream: any = this.electronService.csv.fromPath(filePath, options)
        .on('data', (row) => {
          previewData.push(row);
          ++rowCount;
          if (rowCount >= 3) {
            csvStream.pause();
            csvStream.unpipe();
            onSuccess(Utils.swapColumnsAndRows(previewData));
          }
        })
        .on('end', () => {
          onSuccess(Utils.swapColumnsAndRows(previewData));
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
