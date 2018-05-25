// Angular
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
// App
import { FileService } from '../../providers/file/file.service';
import { Utils } from '../../utils/utils';
import { IRun } from '../../../interfaces/IRun';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnChanges {
  @Input() run: IRun;
  @Input() running: boolean = false;
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
    if (this.run.previewData) {
      this.fileName = Utils.getFilenameFromPath(this.run.previewData.filePath);
      this.entity = Utils.getEntityNameFromFile(this.fileName);
      this.icon = Utils.getIconForFilename(this.fileName, false);
      this.theme = Utils.getThemeForFilename(this.fileName);
      if (this.run.previewData.total) {
        this.total = Utils.getAbbreviatedNumber(this.run.previewData.total);
        this.loadedPercent = this.loaded / this.run.previewData.total;
        this.loadedLabel = this.loaded + ' / ' + this.run.previewData.total + ' LOADED';
      }
    }
    if (this.run.results) {
      this.duration = Utils.msecToHMS(this.run.results.durationMsec);
      this.loaded = this.run.results.processed;
      if (this.run.results.errors) {
        this.errorTable.rows = this.run.results.errors.slice();
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
