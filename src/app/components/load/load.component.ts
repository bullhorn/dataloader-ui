// Angular
import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// Vendor
import { FieldInteractionApi, FileControl, FormUtils, NovoFormGroup, } from 'novo-elements';
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
  inputFileForm: NovoFormGroup = null;
  inputFileControl: FileControl = null;
  inputFilePath = null;
  previewData: IPreviewData = null;
  previewTable: any = {};

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
    this.inputFileControl = new FileControl({
      key: 'file',
      name: 'file',
      label: 'CSV Input File',
      value: null,
      multiple: false,
      interactions: [{ event: 'change', script: this.onFileSelected.bind(this) }],
    });
    this.inputFileForm = this.formUtils.toFormGroup([this.inputFileControl]);

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
      this.inputFilePath = API.form.value.file[0].file.path;
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
    });
  }
}
