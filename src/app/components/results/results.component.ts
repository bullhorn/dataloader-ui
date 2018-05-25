// Angular
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
// App
import { FileService } from '../../providers/file/file.service';
import { Utils } from '../../utils/utils';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IResults } from '../../../interfaces/IResults';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnChanges {
  @Input() previewData: IPreviewData;
  @Input() results: IResults;
  @Input() output: string;
  @Input() running: boolean;
  @Output() stopped = new EventEmitter();
  loaded: number = 0;
  loadedPercent: number = 0.0;
  loadedLabel: string = '';
  total: string = '';
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

  // TODO: Fix the inconsistent counts when the results data is not present (zero out?)
  ngOnChanges(): void {
    if (this.previewData) {
      this.fileName = Utils.getFilenameFromPath(this.previewData.filePath);
      this.entity = Utils.getEntityNameFromFile(this.fileName);
      this.icon = Utils.getIconForFilename(this.fileName, false);
      this.theme = Utils.getThemeForFilename(this.fileName);
      if (this.previewData.total) {
        this.total = Utils.getAbbreviatedNumber(this.previewData.total);
        this.loadedPercent = this.loaded / this.previewData.total;
        this.loadedLabel = this.loaded + ' / ' + this.previewData.total + ' LOADED';
      }
    }
    if (this.results) {
      this.duration = Utils.msecToHMS(this.results.durationMsec);
      this.loaded = this.results.processed;
      if (this.results.errors) {
        this.errorTable.rows = this.results.errors.slice();
      }
    }
  }

  stop(): void {
    this.stopped.emit();
  }

  openFile(filePath: string): void {
    this.fileService.openFile(filePath);
  }
}
