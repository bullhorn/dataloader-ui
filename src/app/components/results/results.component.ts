// Angular
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
// Vendor
import * as Chart from 'chart.js';
// App
import { FileService } from '../../services/file/file.service';
import { PreviewData, Results } from '../../../interfaces';
import { EntityUtil, Util } from '../../util';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { BaseRenderer, NovoModalService } from 'novo-elements';

@Component({
  selector: 'error-details',
  template: `
    <strong>Message</strong>
    <p>{{ data.message }}</p>
    <strong>Tips to Resolve</strong>
    <p>{{ data.tipsToResolve }}</p>
  `,
})
export class ErrorDetailsComponent extends BaseRenderer {}

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
  @Input() parsingResumes: boolean;
  @Output() stopped = new EventEmitter();
  @ViewChild('overviewTab', { static: false }) private overviewTab: any;
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
  resumeRows: any[];
  resumeColumns = [
    { id: 'id', label: 'Candidate ID', template: 'idCell', sortable: true, filterable: true },
    { id: 'name', label: 'Candidate Name', type: 'text', sortable: true, filterable: true },
    { id: 'fileName', label: 'File Name', type: 'text', sortable: true, filterable: true },
    { id: 'fileExtension', label: 'File Type', type: 'text', sortable: true, filterable: true },
  ];
  resumeDisplayedColumns = this.resumeColumns.map(col => col.id);

  constructor(private fileService: FileService,
              private modalService: NovoModalService,
              private ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (this.parsingResumes) {
      this.icon = 'resume';
      this.theme = 'candidate';
    }

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
        title: 'Error',
        name: 'title',
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
        hasDetails: true,
        detailsRenderer: ErrorDetailsComponent,
      },
    };
  }

  ngOnChanges(): void {
    if (this.parsingResumes) {
      if (!this.resumeRows) {
        this.resumeRows = [{
          id: 5114,
          name: 'Burt Bacharrat',
          fileName: 'Burt-resume.pdf',
          fileExtension: 'PDF',
        }, {
          id: 5115,
          name: 'Zach Ringlestone',
          fileName: 'zach-resume.docx',
          fileExtension: 'DOCX',
        }, {
          id: 5117,
          name: 'Jenny Otterway',
          fileName: 'jennifer.otterway.pdf',
          fileExtension: 'PDF',
        }];
      }

      this.ref.detectChanges();
    }

    this.loaded = this.results ? this.results.processed : 0;
    this.success = this.results ? this.results.inserted + this.results.updated + this.results.skipped : 0;
    this.errors = this.results && this.results.errors ? this.results.errors.length : 0;
    this.startDate = this.results ? Util.getStartDateString(this.results.startTime) : '';
    this.duration = this.results ? Util.msecToHMS(this.results.durationMsec) : '';
    this.errorTable.rows = this.results && this.results.errors ? this.results.errors.slice() : [];

    if (this.previewData) {
      this.total = Util.getAbbreviatedNumber(this.previewData.total);
      this.inProgress = this.previewData.total - this.loaded;
      this.loadedPercent = this.loaded / this.previewData.total;
      this.fileName = Util.getFilenameFromPath(this.previewData.filePath);
      this.entity = EntityUtil.getEntityNameFromFile(this.previewData.entity || this.previewData.filePath);
      this.icon = EntityUtil.getIconForFilename(this.previewData.filePath, false);
      this.theme = EntityUtil.getThemeForFilename(this.previewData.filePath);
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

  revertChanges() {

  }
}
