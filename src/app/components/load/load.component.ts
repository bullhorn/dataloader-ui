// NG
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Vendor
import { FieldInteractionApi, FormUtils, } from 'novo-elements';
// App
import { DataloaderService } from '../../providers/dataloader/dataloader.service';
import { FileService } from '../../providers/file/file.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { Utils } from '../../utils/utils';
import { IExistField, ISettings } from '../../../interfaces/ISettings';

@Component({
  selector: 'app-load',
  template: `
    <section class="load">
      <novo-dynamic-form class="load-form" [fieldsets]="fieldSets" [(form)]="form"></novo-dynamic-form>
      <div class="preview" *ngIf="previewData">
        <novo-table [theme]="theme" [rows]="previewTable.rows"
                    [columns]="previewTable.columns"
                    [config]="previewTable.config">
          <novo-table-header class="table-header">
            <i class="header-icon" [class]="icon"></i>
            <div class="header-titles">
              <h1>{{ fileName }} - {{ previewData.total }} Rows</h1>
            </div>
          </novo-table-header>
        </novo-table>
      </div>
      <footer>
        <button theme="primary" class="load-button" [disabled]="!previewData" (click)="load()" icon="upload">Load</button>
      </footer>
    </section>
  `,
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
  form: any;
  fieldSets: any[];
  previewTable: any = {};
  inputFilePath = null;
  previewData: IPreviewData = null;
  entity: string = '';
  icon: string = '';
  theme: string = '';
  fileName: string = '';
  settings: ISettings;
  existField: IExistField;
  fieldInteractionApi: FieldInteractionApi;

  constructor(private dataloaderService: DataloaderService,
              private fileService: FileService,
              private zone: NgZone,
              private router: Router,
              private formUtils: FormUtils) {
  }

  ngOnInit(): void {
    this.settings = this.fileService.readSettings();
    this.setupForm();
  }

  setupForm(): void {
    let meta: any = {
      fields: [{
        name: 'file',
        type: 'file',
        label: 'CSV Input File',
        sortOrder: 1,
      }, {
        name: 'enabled',
        type: 'tiles',
        label: 'Duplicate Check',
        description: 'Enables checking against selected fields in order to update existing records instead of inserting duplicate records.',
        options: [
          { label: 'No', value: 'no' },
          { label: 'Yes', value: 'yes' },
        ],
        defaultValue: 'no',
        sortOrder: 2,
      }, {
        name: 'fields',
        type: 'chips',
        label: 'Duplicate Check Columns',
        description: 'The columns to check agaist in order to update existing records.',
        options: [],
        sortOrder: 3,
      }],
    };

    this.fieldSets = this.formUtils.toFieldSets(meta, '$ USD', {}, { token: 'TOKEN' });
    this.fieldSets[0].controls[0].interactions = [
      { event: 'init', script: this.onFileChange.bind(this) },
      { event: 'change', script: this.onFileChange.bind(this) },
    ];
    this.fieldSets[0].controls[1].interactions = [
      { event: 'change', script: this.onEnabledChange.bind(this) },
    ];
    this.fieldSets[0].controls[2].interactions = [
      { event: 'change', script: this.onFieldsChange.bind(this) },
    ];
    this.form = this.formUtils.toFormGroupFromFieldset(this.fieldSets);

    this.previewTable = {
      columns: [],
      rows: [],
      config: {
        sorting: true,
        filtering: true,
        ordering: true,
        resizing: true,
      },
    };
  }

  load(): void {
    Utils.setExistField(this.settings, this.existField);
    this.fileService.writeSettings(this.settings);
    this.dataloaderService.start(this.previewData);
    // TODO: Navigate inside the start method callback
    setTimeout(() => {
      this.router.navigate(['/results']);
    }, 300);
  }

  private onFileChange(API: FieldInteractionApi): void {
    if (!this.fieldInteractionApi) {
      this.fieldInteractionApi = API;
    }
    let selectedFiles: any = API.form.value.file;
    if (selectedFiles.length) {
      this.inputFilePath = selectedFiles[0].file.path || selectedFiles[0].file.name;
      this.fileService.getCsvPreviewData(this.inputFilePath, this.onPreviewData.bind(this));
      API.show('enabled');
    } else {
      this.previewData = null;
      this.previewTable.columns = [];
      this.previewTable.rows = [];
      API.hide('enabled');
      API.hide('fields');
    }
  }

  private onEnabledChange(API: FieldInteractionApi): void {
    if (this.previewData) {
      this.existField.enabled = API.form.value.enabled === 'yes';
      if (this.existField.enabled) {
        API.modifyPickerConfig('fields', { options: Utils.getExistFieldOptions(this.previewData) });
        API.setValue('fields', this.existField.fields);
        API.show('fields');
      } else {
        API.hide('fields');
      }
    }
  }

  private onFieldsChange(API: FieldInteractionApi): void {
    if (this.previewData && this.existField.enabled) {
      if (API.form.value.fields) {
        this.existField.fields = API.form.value.fields;
      } else {
        this.existField.fields = [];
      }
    }
  }

  private onPreviewData(previewData: IPreviewData): void {
    this.zone.run(() => {
      this.previewData = previewData;
      this.previewTable.columns = Utils.createColumnConfig(previewData.data);
      this.previewTable.rows = previewData.data;
      this.entity = Utils.getEntityNameFromFile(this.inputFilePath);
      this.icon = Utils.getIconForFilename(this.inputFilePath);
      this.theme = Utils.getThemeForFilename(this.inputFilePath);
      this.fileName = Utils.getFilenameFromPath(this.inputFilePath);
      this.existField = Utils.getExistField(this.settings, this.entity);
      this.fieldInteractionApi.setValue('enabled', this.existField.enabled ? 'yes' : 'no');
    });
  }
}
