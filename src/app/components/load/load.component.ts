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
      }],
    };

    this.fieldSets = this.formUtils.toFieldSets(meta, '$ USD', {}, { token: 'TOKEN' });
    this.fieldSets[0].controls[0].interactions = [
      { event: 'change', script: this.onFileSelected.bind(this) },
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

  private onFileSelected(API: FieldInteractionApi): void {
    if (API.form.value.file.length > 0) {
      this.inputFilePath = API.form.value.file[0].file.path || API.form.value.file[0].file.name;
      this.fileService.getCsvPreviewData(this.inputFilePath, this.onPreviewData.bind(this));
    } else {
      this.previewData = null;
      this.previewTable.columns = [];
      this.previewTable.rows = [];
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
