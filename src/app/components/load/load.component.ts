// Angular
import { Component, OnInit, ChangeDetectorRef, ElementRef, NgZone, ViewChild } from '@angular/core';
// Vendor
import { FormUtils, FileControl, CheckboxControl, NovoTableElement } from 'novo-elements';
// App
import { ElectronService } from '../../providers/electron.service';
import { FieldInteractionApi } from 'novo-elements/src/elements/form/FieldInteractionApi';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
  response = 'nothing yet';
  previewTable: any = {};
  fileForm = {};
  fileControl = {};
  filePath = null;
  saving = false;
  results = false;

  // TODO: Move to ResultsComponent
  outputFiles = [{
    name: 'Successful Records',
    records: 103,
    filePath: 'dataloader/results/ClientCorporation_load_2017-04-26_07.25.27_success.csv',
    dateCreated: 'April 26, 7.25 AM',
    icon: 'bhi-certification',
  }, {
    name: 'Failed Records',
    records: 5,
    filePath: 'dataloader/results/ClientCorporation_load_2017-04-26_07.25.27_failure.csv',
    dateCreated: 'April 26, 7.25 AM',
    icon: 'bhi-caution',
  }, {
    name: 'Log File',
    records: 108,
    errors: 5,
    warnings: 18,
    filePath: 'dataloader/log/dataloader_2017-04-26_07.25.27.log',
    dateCreated: 'April 26, 7.25 AM',
    icon: 'bhi-note',
  }];

  @ViewChild('table') table: NovoTableElement;

  constructor(private electronService: ElectronService,
              private zone: NgZone,
              private changeRef: ChangeDetectorRef,
              private formUtils: FormUtils) {
  }

  ngOnInit(): void {
    this.setupForm();
  }

  // TODO: Move to CsvReader utility
  getCsvPreviewData(filePath: string, successCallback: any): any {
    let rowCount: number = 0;
    let previewData: any[] = [];
    let options: any = {
      headers: true,
    };

    if (this.electronService.isElectron()) {
      let csvStream: any = this.electronService.csv.fromPath(filePath, options)
        .on('data', (row) => {
          previewData.push(row);
          ++rowCount;
          if (rowCount >= 3) {
            csvStream.pause();
            csvStream.unpipe();
            successCallback(previewData);
          }
        })
        .on('end', () => {
          successCallback(previewData);
        })
        .on('error', (error) => {
          // noinspection TsLint
          console.error(error);
        });
    }
    return previewData;
  }

  // TODO: Pass this Callback to the CsvReader utility
  onFileParsed(data: any): void {
    this.zone.run(() => {
      this.previewTable.rows = this.swapColumnsAndRows(data);
      this.table.setTableEdit();
    });
  }

  // TODO: Move to CsvReader utility
  swapColumnsAndRows(data: any[]): any[] {
    let swapped: any[] = [];

    let rowCount: number = 0;
    for (const row of data) {

      let colCount: number = 0;
      for (const col in row) {
        if (rowCount === 0) {
          let entry: any = { column: col };

          // TODO: Logic here to create meaningful default
          if (colCount === 0) {
            entry.duplicateCheck = true;
          } else {
            entry.duplicateCheck = false;
          }

          swapped.push(entry);
        }
        let swappedRow: any[] = swapped[colCount];
        swappedRow['row_' + (rowCount + 1)] = row[col];
        colCount++;
      }
      rowCount++;
    }

    return swapped;
  }

  setupForm(): void {
    let onFileControlChange: any = (fieldInteractionApi: FieldInteractionApi) => {
      if (fieldInteractionApi.form.value.file.length > 0) {
        this.filePath = fieldInteractionApi.form.value.file[0].file.path;
        this.getCsvPreviewData(this.filePath, this.onFileParsed.bind(this));
      } else {
        this.previewTable.rows = [];
      }
    };

    this.fileControl = new FileControl({
      key: 'file',
      name: 'file',
      label: 'CSV Input File',
      value: null,
      multiple: false,
      interactions: [{ event: 'change', script: onFileControlChange }],
    });
    this.fileForm = this.formUtils.toFormGroup([this.fileControl]);

    this.previewTable = {
      columns: [
        {
          title: 'Duplicate Check',
          name: 'duplicateCheck',
          ordering: true,
          filtering: true,
          editor: new CheckboxControl({ key: 'duplicateCheck' }),
        },
        { title: 'Column', name: 'column', ordering: true, filtering: true },
        { title: 'Row 1', name: 'row_1', ordering: true, filtering: true },
        { title: 'Row 2', name: 'row_2', ordering: true, filtering: true },
        { title: 'Row 3', name: 'row_3', ordering: true, filtering: true },
      ],
      rows: [],
      config: {
        paging: {
          current: 1,
          itemsPerPage: 10,
          onPageChange: (event) => {
            this.previewTable.config.paging.current = event.page;
            this.previewTable.config.paging.itemsPerPage = event.itemsPerPage;
          },
        },
        sorting: true,
        filtering: true,
        ordering: true,
        resizing: true,
      },
    };
  }

  // TODO: Move to ResultsComponent
  openFile(filePath: string): void {
    if (this.electronService.isElectron()) {
      this.electronService.shell.showItemInFolder(filePath);
    }
  }

  load(): void {
    this.saving = true;
    this.response = 'Loading...';

    // TODO: Move the calling of DataLoader to a Utility that takes just the CLI arguments and fills in the settings
    if (this.electronService.isElectron()) {
      let settings: any = JSON.parse(this.electronService.fs.readFileSync('settings.json', 'utf8'));
      let params: string[] = [];
      params = params.concat(['username', settings.username]);
      params = params.concat(['password', settings.password]);
      params = params.concat(['clientId', settings.clientId]);
      params = params.concat(['clientSecret', settings.clientSecret]);
      params = params.concat(['listDelimiter', settings.listDelimiter]);
      params = params.concat(['dateFormat', settings.dateFormat]);
      // TODO: set data center urls - Make the SettingsComponent do this
      // if (params.dataCenter === 'west') {
      //     params = params.concat(['dateFormat', settings.dateFormat]);
      // }
      params = params.concat(['load', this.filePath]);

      // TODO: Save the dataloader cli location in config
      this.electronService.process.chdir('../dataloader/');

      const loadProcess: any = this.electronService.spawn('dataloader', params);
      loadProcess.stdout.on('data', this.captureResponse.bind(this));
      loadProcess.stdout.on('data', (data) => {
        // noinspection TsLint
        console.log(`stdout: ${data}`);
      });

      loadProcess.stderr.on('data', this.captureResponse.bind(this));
      loadProcess.stderr.on('data', (data) => {
        // noinspection TsLint
        console.error(`stderr: ${data}`);
      });

      loadProcess.on('close', this.onLoadProcessFinished.bind(this));
    }
  }

  onLoadProcessFinished(code: any): void {
    this.saving = false;
    this.results = true;
    this.response = code.toString();
    this.changeRef.detectChanges();
  }

  captureResponse(code: any): void {
    let myNotification: any = new Notification('LS response', { body: code });
    this.response = code.toString();
    this.changeRef.detectChanges();
  }
}
