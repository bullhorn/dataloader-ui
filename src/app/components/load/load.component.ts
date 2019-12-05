// Angular
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
// Vendor
import { FieldInteractionApi, FormUtils, NovoFieldset, NovoFormGroup, NovoModalService, } from 'novo-elements';
// App
import { DataloaderService } from '../../services/dataloader/dataloader.service';
import { ExistField, Field, Meta, PreviewData, Run, Settings } from '../../../interfaces';
import { FileService } from '../../services/file/file.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { StepperComponent } from '../stepper/stepper.component';
import { DataloaderUtil, EntityUtil, Util } from '../../util';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.scss'],
})
export class LoadComponent {
  @Input() run: Run;
  @Output() started = new EventEmitter();
  @ViewChild('stepper') private stepper: StepperComponent;
  @ViewChildren('table') tables: QueryList<any>;
  entity = '';
  icon = '';
  theme = '';
  fileName = '';
  filePath: string = null;
  meta: Meta = null;
  existField: ExistField;
  metaJson: string;
  entityPickerConfig = { options: EntityUtil.ENTITY_NAMES };
  fieldNamesWithLabels: { name: string, label: string }[];
  fieldPickerConfig: { options: { name: string, label: string }[] };
  rows: { header: string, sample: string, field: string, subfield: string }[]; // TODO: Type me
  columns: any[];
  displayedColumns: string[];
  duplicateCheckForm: NovoFormGroup;
  duplicateCheckFieldSets: NovoFieldset[];

  constructor(private fileService: FileService,
              private dataloaderService: DataloaderService,
              private modalService: NovoModalService,
              private formUtils: FormUtils,
              private zone: NgZone,
              private ref: ChangeDetectorRef) {
    this.columns = [
      { id: 'header', label: 'Column Header', enabled: true, type: 'text' },
      { id: 'sample', label: 'Sample Data', enabled: true, type: 'text' },
      { id: 'field', label: 'Bullhorn Field', enabled: true, type: 'text', template: 'fieldCell' },
      { id: 'subfield', label: 'Sub Field', enabled: true, type: 'text', template: 'subfieldCell' },
    ];
    this.displayedColumns = ['selection', 'header', 'sample', 'field', 'subfield'];
  }

  get numSelectedRows(): number {
    return this.tables.first ? this.tables.first.state.selected.length : 0;
  }

  onFileSelected(filePath: string): void {
    if (this.verifyCsvFile(filePath)) {
      this.filePath = filePath;
      this.fileName = Util.getFilenameFromPath(filePath);
      this.entity = EntityUtil.getEntityNameFromFile(filePath);
      this.verifySettings();
      this.stepper.next();
    }
  }

  onEntitySelected() {
    this.getMeta();
    this.stepper.next();
  }

  onColumnsMapped() {
    this.setupDuplicateCheckForm();
    this.stepper.next();
  }

  onLoad(): void {
    if (this.verifySettings()) {
      const settings: Settings = this.fileService.readSettings();
      DataloaderUtil.setExistField(settings, this.existField);
      this.fileService.writeSettings(settings);
      this.started.emit();
    }
  }

  onPrevious(): void {
    if (this.stepper.selectedIndex <= 3) {
      this.duplicateCheckForm = null; // Clear form data
    }
    if (this.stepper.selectedIndex <= 2) {
      this.rows = null; // Clear table data
    }
    if (this.stepper.selectedIndex <= 1) {
      this.run.previewData = null; // Clear file data
    }
    this.stepper.previous();
  }

  private getMeta(): void {
    this.meta = null;
    this.metaJson = '';
    this.dataloaderService.onPrint(this.onMetaPrint.bind(this), 'meta');
    this.dataloaderService.onDone(this.onMetaDone.bind(this), 'meta');
    this.dataloaderService.meta(this.entity);
  }

  /**
   * The CLI responds by returning the entire meta JSON object as a single printout to stdout, which may take multiple
   * electron buffers due to buffer length restrictions between the main and renderer processes.
   */
  private onMetaPrint(metaJsonPartial: string): void {
    this.metaJson += metaJsonPartial;
  }

  // Once the process is done, we should have the entire string
  private onMetaDone(): void {
    this.zone.run(() => {
      this.dataloaderService.unsubscribe();
      try {
        this.meta = JSON.parse(this.metaJson);
      } catch (parseErr) {
        this.modalService.open(InfoModalComponent, {
          title: 'Error Retrieving Meta!',
          message: parseErr,
        });
      }
      this.fileService.getCsvPreviewData(this.filePath, this.onPreviewData.bind(this), this.onPreviewDataError.bind(this));
      this.fieldNamesWithLabels = this.meta.fields.map((field) => {
        return { name: field.name, label: field.label ? `${field.label} (${field.name})` : field.name };
      });
      this.fieldPickerConfig = { options: this.fieldNamesWithLabels };
      // TODO: create the subfield picker config for each subfield in the table
    });
  }

  // Get the file information, then enrich it with field names from meta data
  private onPreviewData(previewData: PreviewData): void {
    this.zone.run(() => {
      this.run.previewData = previewData;
      this.existField = DataloaderUtil.getExistField(this.fileService.readSettings(), this.entity);
      this.rows = this.run.previewData.headers.map(header => {
        const firstNonEmptyData: Object = this.run.previewData.data.find((data) => data[header]);
        const field: Field = this.meta.fields.find((f) => Util.noCaseCompare(header, f.name) || Util.noCaseCompare(header, f.label));
        return {
          id: header,
          header: header,
          sample: firstNonEmptyData ? firstNonEmptyData[header] : '',
          field: field ? field.name : '',
          subfield: '',
        };
      });

      // Start out all columns in the file as selected
      setTimeout(() => {
        this.tables.forEach((table) => {
          table.dataSource.data.forEach((item) => {
            table.selectRow(item);
          });
        });
      });

      this.ref.markForCheck();
    });
  }

  private onPreviewDataError(message: string): void {
    this.zone.run(() => {
      this.modalService.open(InfoModalComponent, { title: 'Error Parsing Input File', message });
    });
  }

  private setupDuplicateCheckForm(): void {
    const duplicateCheckFormMeta: any = {
      fields: [{
        name: 'enabled',
        type: 'tiles',
        label: 'Enable',
        options: [
          { label: 'No', value: 'no' },
          { label: 'Yes', value: 'yes' },
        ],
        defaultValue: 'no',
        sortOrder: 1,
      }, {
        name: 'fields',
        type: 'chips',
        label: 'Fields',
        options: this.fieldNamesWithLabels.filter((field) => this.tables.first.state.selected.find((row) => row.field === field.name)),
        sortOrder: 2,
      }],
    };

    this.duplicateCheckFieldSets = this.formUtils.toFieldSets(duplicateCheckFormMeta, '$ USD', {}, { token: 'TOKEN' });
    this.duplicateCheckFieldSets[0].controls[0].interactions = [
      { event: 'init', script: this.onDuplicateCheckEnabledInit.bind(this) },
      { event: 'change', script: this.onDuplicateCheckEnabledChange.bind(this) },
    ];
    this.duplicateCheckFieldSets[0].controls[1].interactions = [
      { event: 'change', script: this.onDuplicateCheckFieldsChange.bind(this) },
    ];
    this.duplicateCheckForm = this.formUtils.toFormGroupFromFieldset(this.duplicateCheckFieldSets);
  }

  private onDuplicateCheckEnabledInit(API: FieldInteractionApi): void {
    API.setValue(API.currentKey, this.existField.enabled ? 'yes' : 'no');
  }

  private onDuplicateCheckEnabledChange(API: FieldInteractionApi): void {
    this.existField.enabled = API.getActiveValue() === 'yes';
    this.existField.enabled ? API.show('fields') : API.hide('fields');
    if (this.existField.enabled) {
      API.setValue('fields', this.existField.fields);
    }
  }

  private onDuplicateCheckFieldsChange(API: FieldInteractionApi): void {
    if (this.existField.enabled) {
      this.existField.fields = API.getActiveValue() ? API.getActiveValue() : [];
    }
  }

  private verifySettings(): boolean {
    const settings: Settings = this.fileService.readSettings();
    if (!settings.username || !settings.password || !settings.clientId || !settings.clientSecret) {
      this.modalService.open(InfoModalComponent, {
        title: 'Missing Login Credentials',
        message: 'Open settings and fill out credentials before continuing to load data',
      });
      return false;
    }
    return true;
  }

  private verifyCsvFile(filepath: string): boolean {
    const extension = filepath.split('.').pop();
    if (extension !== 'csv') {
      this.modalService.open(InfoModalComponent, {
        title: 'Unsupported File Extension',
        message: `Files with the '${extension}' extension are not supported, only CSV files.
                  Save your spreadsheet data in the .csv file format before loading.`,
      });
      return false;
    }
    return true;
  }
}
