// Angular
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
// Vendor
import * as Chart from 'chart.js';
// App
import { FileService } from '../../services/file/file.service';
import { PreviewData, Results } from '../../../interfaces';
import { Utils } from '../../utils/utils';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { NovoModalService } from 'novo-elements';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent implements OnInit, OnChanges {
  @Input() runDirectory: string;
  @Input() previewData: PreviewData;
  @Input() results: Results;
  @Input() output: string;
  @Input() running: boolean;
  @Output() stopped = new EventEmitter();
  loaded = 0;
  success = 0;
  errors = 0;
  inProgress = 0;
  loadedPercent = 0.0;
  total = '';
  startDate = '';
  duration = '00:00:00';
  entity = '';
  icon = '';
  theme = '';
  fileName = '';
  errorTable: any = {};
  donutChart: Chart;
  @ViewChild('overviewTab') private overviewTab: any;

  constructor(private fileService: FileService,
              private modalService: NovoModalService) {
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
      options: {
        tooltips: { enabled: false },
        hover: { mode: null },
        legend: {
          onClick: () => {}, // disable default data hiding feature
        },
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
    this.startDate = this.results ? Utils.getStartDateString(this.results.startTime) : '';
    this.duration = this.results ? Utils.msecToHMS(this.results.durationMsec) : '';
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

    if (!this.output) {
      this.overviewTab.select();
    }
  }

  stop(): void {
    this.modalService.open(ConfirmModalComponent, {
      headerText: 'Are you sure?',
      subheaderText: 'This will immediately stop the Data Loader from loading records. ' +
        'Consult results files afterwards to see which records were loaded.',
      buttonColor: 'negative',
      confirmButtonText: 'stop',
      confirmButtonIcon: 'times',
    }).onClosed.then((response) => {
      if (response) {
        this.stopped.emit();
      }
    });
  }

  openFile(filePath: string): void {
    this.fileService.openFile(filePath);
  }

  openInputFile(filePath: string): void {
    this.fileService.openFile(filePath, false);
  }

  delete() {
    this.modalService.open(ConfirmModalComponent, {
      headerText: 'Are you sure?',
      subheaderText: 'This run will be deleted from the run history. ' +
        'This will not affect any data in Bullhorn or any files on your computer. ' +
        'Log files and results files from this run will remain in the log file / results file directories.',
      buttonColor: 'negative',
      confirmButtonText: 'delete',
      confirmButtonIcon: 'delete',
    }).onClosed.then((response) => {
      if (response) {
        this.fileService.deleteRun(this.runDirectory);
      }
    });
  }
}
