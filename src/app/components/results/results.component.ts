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

  ngOnChanges(): void {
    this.loaded = this.results ? this.results.processed : 0;
    this.duration = this.results ? Utils.msecToHMS(this.results.durationMsec) : '---';
    this.errorTable.rows = this.results && this.results.errors ? this.results.errors.slice() : [];

    if (this.previewData) {
      this.total = Utils.getAbbreviatedNumber(this.previewData.total);
      this.loadedPercent = this.loaded / this.previewData.total;
      this.loadedLabel = this.loaded.toLocaleString() + ' / ' + this.previewData.total.toLocaleString() + ' LOADED';
      this.fileName = Utils.getFilenameFromPath(this.previewData.filePath);
      this.entity = Utils.getEntityNameFromFile(this.previewData.filePath);
      this.icon = Utils.getIconForFilename(this.previewData.filePath, false);
      this.theme = Utils.getThemeForFilename(this.previewData.filePath);
    }
  }

  stop(): void {
    this.stopped.emit();
  }

  openFile(filePath: string): void {
    this.fileService.openFile(filePath);
  }
}
