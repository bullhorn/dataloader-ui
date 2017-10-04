// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
// Vendor
// App
import { DataloaderService } from '../../providers/dataloader/dataloader.service';
import { ElectronService } from '../../providers/electron/electron.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnDestroy {

  outputFiles = [{
    name: 'Successful Records',
    records: 103,
    filePath: 'dataloader/results/ClientCorporation_load_2017-04-26_07.25.27_success.csv',
    dateCreated: 'April 26, 7.25 AM',
    icon: 'bhi-certification',
  }, {
    name: 'Failed Records',
    records: 5,
    filePath: 'dataloader/results/ClientCorporation_load_2017-04-26_07.25.27_failure.csv',
    dateCreated: 'April 26, 7.25 AM',
    icon: 'bhi-caution',
  }, {
    name: 'Log File',
    records: 108,
    errors: 5,
    warnings: 18,
    filePath: 'dataloader/log/dataloader_2017-04-26_07.25.27.log',
    dateCreated: 'April 26, 7.25 AM',
    icon: 'bhi-note',
  }];

  constructor(private electronService: ElectronService,
              private dataloaderService: DataloaderService) {
  }

  ngOnInit(): void {
    this.dataloaderService.onPrint(this.onPrint);
  }

  ngOnDestroy(): void {
    this.dataloaderService.removePrintListeners();
  }

  private openFile(filePath: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.shell.showItemInFolder(filePath);
    }
  }

  private onPrint(text: string): void {
    console.log('text:', text);
  }

  // onLoadProcessFinished(code: any): void {
  //   this.response = code.toString();
  //   this.changeRef.detectChanges();
  // }
  //
  // captureResponse(code: any): void {
  //   let myNotification: any = new Notification('Load Status:', { body: code });
  //   this.response = code.toString();
  //   this.changeRef.detectChanges();
  // }
}