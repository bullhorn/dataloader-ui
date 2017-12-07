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
  duration: string = '';
  entity: string = '';
  icon: string = '';
  theme: string = '';
  fileName: string = '';

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
    this.changeDetectorRef.detectChanges();
  }

  private onDone(code: number): void {
    // TODO: Set DataLoader Icon in System Notification
    new Notification(`Loaded ${this.loaded} / ${this.previewData.total} ${this.entity} Records in ${this.duration}`,
      { body: `${this.results.inserted} Added, ${this.results.updated} Edited, ${this.results.failed} Errors` });
    this.running = false;
    this.changeDetectorRef.detectChanges();
  }

  private onResultsFileChange(results: IResults): void {
    if (results && results.durationMsec) {
      this.results = results;
      this.duration = Utils.msecToHMS(this.results.durationMsec);
      this.loaded = this.results.inserted + this.results.updated;
      if (this.previewData && this.previewData.total) {
        this.loadedPercent = this.loaded / this.previewData.total;
        this.loadedLabel = this.loaded + ' / ' + this.previewData.total + ' LOADED';
      }
      this.changeDetectorRef.detectChanges();
    }
  }
}
