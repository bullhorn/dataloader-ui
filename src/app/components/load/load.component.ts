// NG
import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
// Vendor
import { FieldInteractionApi, FormUtils, NovoFile } from 'novo-elements';
import { TranslateService } from '@ngx-translate/core';
// App
import { DataloaderService } from '../../providers/dataloader/dataloader.service';
import { FileService } from '../../providers/file/file.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IExistField, ISettings } from '../../../interfaces/ISettings';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-load',
  template: `
    <app-load-header [stepNumber]="stepNumber"></app-load-header>
    <div class="load-body-wrapper">
      <div class="step-1a-wrapper" *ngIf="stepNumber === 1 && !form.controls.file.value">
        <i class="bhi-dropzone"></i>
        <h2>{{ 'DRAG_AND_DROP.HEADING' | translate }}</h2>
        <span>{{ 'DRAG_AND_DROP.SUB_HEADING_1' | translate }}</span>
        <input type="file" id="file" class="input-file" accept=".csv, .xls, .xlsx">
        <label class="file-upload-link" for="file">{{ 'DRAG_AND_DROP.SUB_HEADING_2' | translate }}</label>
        <span>{{ 'DRAG_AND_DROP.SUB_HEADING_3' | translate }}</span>
      </div>
      <div class="step-1b-wrapper" *ngIf="stepNumber === 1 && form.controls.file.value">
        <div class="form-wrapper">
          <novo-dynamic-form class="load-form"
                             layout="vertical"
                             [fieldsets]="fieldSets"
                             [(form)]="form"></novo-dynamic-form>
        </div>
        <div class="footer-wrapper" *ngIf="previewData">
          <button theme="primary"
                  class="preview-button"
                  (click)="preview()"
                  icon="next">{{ 'PREVIEW' | translate }}</button>
        </div>
      </div>
      <div class="step-2-wrapper" *ngIf="stepNumber === 2">
        <div class="preview">
          <novo-table [theme]="theme"
                      [rows]="previewTable.rows"
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
        <div class="footer-wrapper">
          <button theme="secondary"
                  class="back-button"
                  (click)="back()">{{ 'BACK' | translate }}</button>
          <button theme="primary"
                  class="load-button"
                  (click)="load()"
                  icon="next">{{ 'LOAD' | translate }}</button>
        </div>
      </div>
      <div class="step-3-wrapper" *ngIf="stepNumber === 3">
        <!--<app-results></app-results>-->
      </div>
    </div>
  `,
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit, AfterViewInit {
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
  stepNumber: number = 1;
  file: any;
  selectFileTranslations: any = {};

  constructor(private dataloaderService: DataloaderService,
              private fileService: FileService,
              private zone: NgZone,
              private formUtils: FormUtils,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.translate.get([
      'NO',
      'YES',
      'SELECTED_FILE',
      'DUPLICATE_CHECK',
      'DUPLICATE_CHECK_DESC',
      'DUPLICATE_CHECK_COLS',
      'DUPLICATE_CHECK_COLS_DESC',
    ]).subscribe((res) => {
      this.selectFileTranslations.no = res.NO;
      this.selectFileTranslations.yes = res.YES;
      this.selectFileTranslations.selectedFile = res.SELECTED_FILE;
      this.selectFileTranslations.duplicateCheck = res.DUPLICATE_CHECK;
      this.selectFileTranslations.duplicateCheckDesc = res.DUPLICATE_CHECK_DESC;
      this.selectFileTranslations.duplicateCheckCols = res.DUPLICATE_CHECK_COLS;
      this.selectFileTranslations.duplicateCheckColsDesc = res.DUPLICATE_CHECK_COLS_DESC;

      let meta: any = {
        fields: [
          {
            name: 'file',
            type: 'file',
            sortOrder: 1,
            label: this.selectFileTranslations.selectedFile,
          },
          {
            name: 'enabled',
            type: 'tiles',
            label: this.selectFileTranslations.duplicateCheck,
            description: this.selectFileTranslations.duplicateCheckDesc,
            options: [
              { label: this.selectFileTranslations.no, value: 'no' },
              { label: this.selectFileTranslations.yes, value: 'yes' },
            ],
            defaultValue: 'no',
            sortOrder: 2,
          },
          {
            name: 'fields',
            type: 'chips',
            label: this.selectFileTranslations.duplicateCheckCols,
            description: this.selectFileTranslations.duplicateCheckColsDesc,
            options: [],
            sortOrder: 3,
          },
        ],
      };
      this.fieldSets = this.formUtils.toFieldSets(meta, '$ USD', {}, { token: 'TOKEN' });
      this.fieldSets[0].controls[0].layoutOptions.download = false;
      this.fieldSets[0].controls[0].layoutOptions.labelStyle = 'no-box';
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
    });
    this.settings = this.fileService.readSettings();
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

  ngAfterViewInit(): void {
    const allowedFileTypes: string[] = [
      '.csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const fileInput: any = document.querySelectorAll('.input-file')[0];
    fileInput.addEventListener('change', (): void => {
      if (fileInput.files && fileInput.files.length && allowedFileTypes.includes(fileInput.files[0].type)) {
        this.form.controls.file.setValue([ new NovoFile(fileInput.files[0]) ]);
      }
    });
  }

  preview(): void {
    Utils.setExistField(this.settings, this.existField);
    this.fileService.writeSettings(this.settings);
    this.dataloaderService.start(this.previewData);
    // TODO: Navigate inside the start method callback
    setTimeout(() => {
      this.stepNumber = 2;
    }, 300);
  }

  load(): void {
    this.stepNumber = 3;
  }

  private onFileChange(API: FieldInteractionApi): void {
    if (!this.fieldInteractionApi) {
      this.fieldInteractionApi = API;
    }
    const selectedFiles: any = API.form.value.file;
    if (selectedFiles.length) {
      this.inputFilePath = selectedFiles[0].file.path || selectedFiles[0].file.name;
      this.fileService.getCsvPreviewData(this.inputFilePath, this.onPreviewData.bind(this));
      API.show('enabled');
    } else {
      this.previewData = null;
      this.previewTable.columns = this.previewTable.rows = [];
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
      this.existField.fields = API.form.value.fields || [];
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
