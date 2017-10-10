// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
// Vendor
// App
import { DataloaderService } from '../../providers/dataloader/dataloader.service';
import { FileService } from '../../providers/file/file.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnDestroy {
  running: boolean = false;
  output: string = '';
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

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private dataloaderService: DataloaderService,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    this.dataloaderService.onPrint(this.onPrint.bind(this));
    this.dataloaderService.onDone(this.onDone.bind(this));
  }

  ngOnDestroy(): void {
    this.dataloaderService.unsubscribe();
  }

  stop(): void {
    // TODO
  }

  private openFile(filePath: string): void {
    this.fileService.openFile(filePath);
  }

  private onPrint(text: string): void {
    this.output = this.output.concat(text);
    this.changeDetectorRef.detectChanges();
  }

  private onDone(code: string): void {
    let notification: Notification = new Notification('Loaded 1301 Candidate Records in XX:XX',
      { body: '  Inserted: 1202\n  Updated: 90\n  Failed: 9' });
  }
}
