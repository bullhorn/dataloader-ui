// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
// Vendor
// App
import { DataloaderService } from '../../providers/dataloader/dataloader.service';
import { FileService } from '../../providers/file/file.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IResults } from '../../../interfaces/IResults';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnDestroy {
  running: boolean = true;
  results: IResults;
  output: string = '';
  previewData: IPreviewData;
  loadedPercent: number = 0.0;
  loadedLabel: string = '';

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private dataloaderService: DataloaderService,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    this.previewData = this.fileService.previewData;
    this.dataloaderService.onPrint(this.onPrint.bind(this));
    this.dataloaderService.onDone(this.onDone.bind(this));
    this.fileService.onResultsFileChange(this.onResultsFileChange.bind(this));
  }

  ngOnDestroy(): void {
    this.dataloaderService.unsubscribe();
    this.fileService.unsubscribe();
  }

  stop(): void {
    // TODO
  }

  openFile(filePath: string): void {
    this.fileService.openFile(filePath);
  }

  private onPrint(text: string): void {
    this.output = this.output.concat(text);
    this.changeDetectorRef.detectChanges();
  }

  private onDone(code: string): void {
    // TODO: Output System Notification and Long-Lived Toast
    new Notification('Loaded 1301 Candidate Records in XX:XX',
      { body: '  Inserted: 1202\n  Updated: 90\n  Failed: 9' });
    this.running = false;
    this.changeDetectorRef.detectChanges();
  }

  private onResultsFileChange(results: IResults): void {
    this.results = results;
    this.loadedPercent = (this.results.inserted + this.results.updated) / this.previewData.total;
    this.loadedLabel = (this.results.inserted + this.results.updated) + ' / ' + this.previewData.total + ' LOADED';
    this.changeDetectorRef.detectChanges();
  }
}
