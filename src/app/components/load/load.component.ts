// Angular
import { Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
// Vendor
import { FieldInteractionApi, FormUtils, NovoFormGroup, NovoModalService, } from 'novo-elements';
import { NovoFieldset } from 'novo-elements/elements/form/FormInterfaces';
// App
import { DataloaderService } from '../../services/dataloader/dataloader.service';
import { ExistField, Meta, PreviewData, Run, Settings } from '../../../interfaces';
import { FileService } from '../../services/file/file.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Utils } from '../../utils/utils';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent implements OnInit, OnDestroy {
  @Input() run: Run;
  @Output() started = new EventEmitter();
  form: NovoFormGroup;
  fieldSets: NovoFieldset[];
  previewTable: any = {};
  inputFilePath = null;
  entity = '';
  icon = '';
  theme = '';
  fileName = '';
  existField: ExistField;
  fieldInteractionApi: FieldInteractionApi;
  previewDataWithoutMeta: PreviewData;
  metaJson: string;

  // TODO: Break this single form apart into multiple form steps
  constructor(private fileService: FileService,
              private dataloaderService: DataloaderService,
              private modalService: NovoModalService,
              private zone: NgZone,
              private formUtils: FormUtils) {
  }

  ngOnInit(): void {
    this.setupForm();
  }

  ngOnDestroy(): void {
    if (!this.run.running && this.run.previewData) {
      this.run.previewData = null;
    }
  }

  browse(): void {
    console.log('browsing...');
  }

  load(): void {
    const settings: Settings = this.fileService.readSettings();
    if (!settings.username || !settings.password || !settings.clientId || !settings.clientSecret) {
      this.modalService.open(InfoModalComponent, {
        title: 'Missing Login Credentials',
        message: 'Open settings and fill out credentials before loading data',
      });
    } else {
      Utils.setExistField(settings, this.existField);
      this.fileService.writeSettings(settings);
      this.started.emit();
    }
  }

  private setupForm(): void {
    const meta: any = {
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
        description: 'The columns to check against in order to update existing records.',
        options: [],
        sortOrder: 3,
      }],
    };

    this.fieldSets = this.formUtils.toFieldSets(meta, '$ USD', {}, { token: 'TOKEN' });
    this.fieldSets[0].controls[0].layoutOptions.download = false;
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

  private onFileChange(API: FieldInteractionApi): void {
    if (!this.fieldInteractionApi) {
      this.fieldInteractionApi = API;
    }
    const selectedFiles: any = API.form.value.file;
    if (selectedFiles && selectedFiles.length) {
      this.inputFilePath = selectedFiles[0].file.path || selectedFiles[0].file.name;
      this.fileService.getCsvPreviewData(this.inputFilePath, this.onPreviewData.bind(this), this.onPreviewDataError.bind(this));
      API.show('enabled');
    } else {
      this.run.previewData = null;
      this.previewTable.columns = [];
      this.previewTable.rows = [];
      API.hide('enabled');
      API.hide('fields');
    }
  }

  private onEnabledChange(API: FieldInteractionApi): void {
    if (this.run.previewData) {
      this.existField.enabled = API.form.value.enabled === 'yes';
      if (this.existField.enabled) {
        API.modifyPickerConfig('fields', { options: Utils.getExistFieldOptions(this.run.previewData) });
        API.setValue('fields', this.existField.fields);
        API.show('fields');
      } else {
        API.hide('fields');
      }
    }
  }

  private onFieldsChange(API: FieldInteractionApi): void {
    if (this.run.previewData && this.existField.enabled) {
      if (API.form.value.fields) {
        this.existField.fields = API.form.value.fields;
      } else {
        this.existField.fields = [];
      }
    }
  }

  // Get the file information, then enrich it with field names from meta data
  private onPreviewData(previewData: PreviewData): void {
    console.log('Got preview Data - getting meta now....');
    this.previewDataWithoutMeta = previewData;
    this.entity = Utils.getEntityNameFromFile(this.inputFilePath);
    this.icon = Utils.getIconForFilename(this.inputFilePath);
    this.theme = Utils.getThemeForFilename(this.inputFilePath);
    this.fileName = Utils.getFilenameFromPath(this.inputFilePath);

    // TODO: Produce a better waiting state, like: "Retrieving field map data for this private label..."
    //  Allow the user to click a stop button, in order to skip this part if they wish (or if it breaks).
    this.getMeta();
  }

  private onPreviewDataError(message: string): void {
    this.zone.run(() => {
      this.modalService.open(InfoModalComponent, { title: 'Error Parsing Input File', message });
    });
  }

  private getMeta(): void {
    this.metaJson = '';
    this.dataloaderService.onPrint(this.onMetaPrint.bind(this), 'meta');
    this.dataloaderService.onDone(this.onMetaDone.bind(this), 'meta');
    this.dataloaderService.meta(this.previewDataWithoutMeta);
  }

  // The CLI responds by returning the entire meta JSON object as a single printout to stdout, which might take multiple
  // electron buffers due to buffer length restrictions between the main and renderer processes.
  private onMetaPrint(metaJsonPartial: string): void {
    this.metaJson += metaJsonPartial;
  }

  // Once the process is done, we should have the entire string
  private onMetaDone(): void {
    this.zone.run(() => {
      this.dataloaderService.unsubscribe();
      try {
        const meta: Meta = JSON.parse(this.metaJson);
        this.run.previewData = this.previewDataWithoutMeta;
        this.run.previewData.headers = Utils.addMetaToHeaders(this.run.previewData.headers, meta);
        this.previewDataWithoutMeta = undefined;
        this.previewTable.columns = Utils.createColumnConfig(this.run.previewData.data, meta);
        this.previewTable.rows = this.run.previewData.data;
        this.existField = Utils.getExistField(this.fileService.readSettings(), this.entity);
        this.fieldInteractionApi.setValue('enabled', this.existField.enabled ? 'yes' : 'no');
      } catch (parseErr) {
        // TODO: If this fails, it's probably bad credentials. Check for bad credential output:
        //  ERROR: com.bullhornsdk.data.exception.RestApiException: Failed to create rest session
        this.modalService.open(InfoModalComponent, {
          title: 'Error Retrieving Meta!',
          message: this.metaJson,
        });
      }
    });
  }
}
