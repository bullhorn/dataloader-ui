// Angular
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Vendor
import { FieldInteractionApi, FormUtils, } from 'novo-elements';
// App
import { DataloaderService } from '../../providers/dataloader/dataloader.service';
import { FileService } from '../../providers/file/file.service';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
  form: any;
  fieldSets: any[];
  previewTable: any = {};
  inputFilePath = null;
  previewData: IPreviewData = null;
  icon: string = '';
  theme: string = '';
  fileName: string = '';

  constructor(private dataloaderService: DataloaderService,
              private fileService: FileService,
              private zone: NgZone,
              private router: Router,
              private formUtils: FormUtils) {
  }

  ngOnInit(): void {
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
        name: 'duplicateCheck',
        type: 'tiles',
        label: 'Duplicate Check',
        description: 'Enables checking against selected fields in order to update existing records instead of inserting duplicate records.',
        options: [
          { label: 'No', value: 'no' },
          { label: 'Yes', value: 'yes' },
        ],
        defaultValue: 'no',
        sortOrder: 2,
      }],
    };

    this.fieldSets = this.formUtils.toFieldSets(meta, '$ USD', {}, { token: 'TOKEN' });
    this.fieldSets[0].controls[0].interactions = [
      { event: 'init', script: this.onFileChange.bind(this) },
      { event: 'change', script: this.onFileChange.bind(this) },
    ];
    this.fieldSets[0].controls[1].interactions = [
      { event: 'init', script: this.onDuplicateCheckChange.bind(this) },
      { event: 'change', script: this.onDuplicateCheckChange.bind(this) },
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
    this.dataloaderService.start(this.inputFilePath);
    this.router.navigate(['/results']);
  }

  private onFileChange(API: FieldInteractionApi): void {
    let selectedFiles: any = API.form.value.file;
    if (selectedFiles.length) {
      this.inputFilePath = selectedFiles[0].file.path || selectedFiles[0].file.name;
      this.fileService.getCsvPreviewData(this.inputFilePath, this.onPreviewData.bind(this));
    } else {
      this.previewData = null;
      this.previewTable.columns = [];
      this.previewTable.rows = [];
    }

    API.getControl('duplicateCheck').setReadOnly(selectedFiles.length === 0);
  }

  private onDuplicateCheckChange(API: FieldInteractionApi): void {
    let value: any = API.form.value.duplicateCheck;
    if (value === 'yes') {
      let existFieldsMeta: any = {
        name: 'existFields',
        type: 'chips',
        label: 'Duplicate Check Fields',
        description: 'Fields to compare against in order to insert vs. update vs. insert.',
        options: this.previewData.headers.map((header) => {
          return {
            label: header,
            value: header,
          };
        }),
        sortOrder: 3,
      };
      API.addControl('duplicateCheck', existFieldsMeta, FieldInteractionApi.FIELD_POSITIONS.BOTTOM_OF_FORM);
    } else {
      API.removeControl('existFields');
    }
  }

  private onPreviewData(previewData: IPreviewData): void {
    this.zone.run(() => {
      this.previewData = previewData;
      this.previewTable.columns = Utils.createColumnConfig(previewData.data);
      this.previewTable.rows = previewData.data;
      this.icon = Utils.getIconForFilename(this.inputFilePath);
      this.theme = Utils.getThemeForFilename(this.inputFilePath);
      this.fileName = Utils.getFilenameFromPath(this.inputFilePath);
    });
  }
}
