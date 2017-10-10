// Angular
import { Injectable } from '@angular/core';
// App
import { ElectronService } from '../electron/electron.service';
import { Utils } from '../../utils/utils';

@Injectable()
export class FileService {

  constructor(private electronService: ElectronService) {
  }

  getSettings(): any {
    return JSON.parse(this.electronService.fs.readFileSync('settings.json', 'utf8'));
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
}
