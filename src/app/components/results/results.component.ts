// Angular
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
// Vendor
// App
import { FileService } from '../../providers/file/file.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IResults } from '../../../interfaces/IResults';
import { Utils } from '../../utils/utils';
import { IRun } from '../../../interfaces/IRun';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit {
  @Input() running: boolean = false;
  @Output() stopped = new EventEmitter();
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

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
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
        paging: {
          current: 1,
          itemsPerPage: 10,
        },
      },
    };
  }

  stop(): void {
    this.stopped.emit();
  }

  openFile(filePath: string): void {
    this.fileService.openFile(filePath);
  }

  @Input('run')
  set run(value: IRun) {
    if (value) {
      this.setPreviewData(value.previewData);
      this.setResults(value.results);
      this.output = value.output;
    }
  }

  /**
   * Sets the previewData object and any data derived from the previewData
   */
  private setPreviewData(previewData: IPreviewData): void {
    this.previewData = previewData;
    if (this.previewData) {
      this.entity = Utils.getEntityNameFromFile(this.previewData.filePath);
      this.icon = Utils.getIconForFilename(this.previewData.filePath, false);
      this.theme = Utils.getThemeForFilename(this.previewData.filePath);
      this.fileName = Utils.getFilenameFromPath(this.previewData.filePath);
    }
  }

  /**
   * Sets the results object and any data derived from the results
   */
  private setResults(results: IResults): void {
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
}
