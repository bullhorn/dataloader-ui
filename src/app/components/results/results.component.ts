// Angular
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
// Vendor
import * as Chart from 'chart.js';
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
  success: number = 0;
  errors: number = 0;
  inProgress: number = 0;
  loadedPercent: number = 0.0;
  total: string = '';
  duration: string = '00:00:00';
  entity: string = '';
  icon: string = '';
  theme: string = '';
  fileName: string = '';
  errorTable: any = {};
  donutChart: Chart;

  constructor(private fileService: FileService) {
  }

  ngOnInit(): void {
    this.donutChart = new Chart('donutChart', {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: [
            '#8cc152',
            '#da4453',
            '#f4f4f4',
          ],
        }],
        labels: [
          'Loaded',
          'Errors',
          'In Progress',
        ],
      },
    });

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
    this.success = this.results ? this.results.inserted + this.results.updated : 0;
    this.errors = this.results && this.results.errors ? this.results.errors.length : 0;
    this.duration = this.results ? Utils.msecToHMS(this.results.durationMsec) : '---';
    this.errorTable.rows = this.results && this.results.errors ? this.results.errors.slice() : [];

    if (this.previewData) {
      this.total = Utils.getAbbreviatedNumber(this.previewData.total);
      this.inProgress = this.previewData.total - this.loaded;
      this.loadedPercent = this.loaded / this.previewData.total;
      this.fileName = Utils.getFilenameFromPath(this.previewData.filePath);
      this.entity = Utils.getEntityNameFromFile(this.previewData.filePath);
      this.icon = Utils.getIconForFilename(this.previewData.filePath, false);
      this.theme = Utils.getThemeForFilename(this.previewData.filePath);
    }

    if (this.donutChart) {
      this.donutChart.data.datasets[0].data = [this.success, this.errors, this.inProgress];
      this.donutChart.update();
    }
  }

  stop(): void {
    this.stopped.emit();
  }

  openFile(filePath: string): void {
    this.fileService.openFile(filePath);
  }
}
