// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
// Vendor
// App
import { DataloaderService } from '../../providers/dataloader/dataloader.service';
import { FileService } from '../../providers/file/file.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IResults } from '../../../interfaces/IResults';
import { Utils } from '../../utils/utils';

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
  loaded: number = 0;
  loadedPercent: number = 0.0;
  loadedLabel: string = '';
  duration: string = '00:00:00';
  entity: string = '';
  icon: string = '';
  theme: string = '';
  fileName: string = '';
  errorTable: any = {};

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private dataloaderService: DataloaderService,
              private fileService: FileService) {
  }

  ngOnInit(): void {
    this.previewData = this.fileService.previewData;
    if (this.previewData) {
      this.entity = Utils.getEntityNameFromFile(this.previewData.filePath);
      this.icon = Utils.getIconForFilename(this.previewData.filePath, false);
      this.theme = Utils.getThemeForFilename(this.previewData.filePath);
      this.fileName = Utils.getFilenameFromPath(this.previewData.filePath);
    }
    this.errorTable = {
      columns: [{
        title: 'Row',
        name: 'row',
      }, {
        title: 'ID',
        name: 'id',
      }, {
        title: 'Message',
        name: 'message',
      }],
      rows: [],
      config: {
        sorting: true,
        filtering: true,
        ordering: true,
        resizing: true,
      },
    };
    this.dataloaderService.onPrint(this.onPrint.bind(this));
    this.dataloaderService.onDone(this.onDone.bind(this));
    this.fileService.onResultsFileChange(this.onResultsFileChange.bind(this));
  }

  ngOnDestroy(): void {
    this.dataloaderService.unsubscribe();
    this.fileService.unsubscribe();
  }

  stop(): void {
    this.dataloaderService.stop();
  }

  openFile(filePath: string): void {
    this.fileService.openFile(filePath);
  }

  private onPrint(text: string): void {
    this.output = this.output.concat(text);
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  private onDone(text: string): void {
    this.output = this.output.concat(text);
    let options: any = {};
    if (this.results) {
      options = { body: `${this.results.inserted} Added, ${this.results.updated} Updated, ${this.results.failed} Errors` };
    }
    new Notification(`Loaded ${this.loaded} / ${this.previewData.total} ${this.entity} Records in ${this.duration}`, options); // tslint:disable-line
    this.running = false;
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }

  private onResultsFileChange(results: IResults): void {
    if (results && results.durationMsec) {
      this.results = results;
      this.duration = Utils.msecToHMS(this.results.durationMsec);
      if (results.errors) {
        this.errorTable.rows = results.errors.slice();
      }
      this.loaded = this.results.processed;
      if (this.previewData && this.previewData.total) {
        this.loadedPercent = this.loaded / this.previewData.total;
        this.loadedLabel = this.loaded + ' / ' + this.previewData.total + ' LOADED';
      }
    }
    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }
  }
}
