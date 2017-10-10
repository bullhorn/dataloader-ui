// Angular
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// Vendor
import {
  CheckboxControl,
  FieldInteractionApi,
  FileControl,
  FormUtils,
  NovoFormGroup,
  NovoTableElement,
} from 'novo-elements';
// App
import { DataloaderService } from '../../providers/dataloader/dataloader.service';
import { FileService } from '../../providers/file/file.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit {
  inputFileForm: NovoFormGroup = null;
  inputFileControl: FileControl = null;
  inputFilePath = null;
  previewTable: any = {};

  @ViewChild('table') table: NovoTableElement;

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

  load(): void {
    this.dataloaderService.start(this.inputFilePath);
    this.router.navigate(['/results']);
  }

  private onFileSelected(fieldInteractionApi: FieldInteractionApi): void {
    if (fieldInteractionApi.form.value.file.length > 0) {
      this.inputFilePath = fieldInteractionApi.form.value.file[0].file.path;
      this.fileService.getCsvPreviewData(this.inputFilePath, this.onPreviewData.bind(this));
    } else {
      this.previewTable.rows = [];
    }
  }

  private onPreviewData(data: any): void {
    this.zone.run(() => {
      this.previewTable.rows = data;
    });
  }
}
