// Angular
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
// Vendor
import { NovoModalService, } from 'novo-elements';
import * as Fuse from 'fuse.js';
// App
import { DataloaderService } from '../../services/dataloader/dataloader.service';
import { ExistField, Field, Meta, PreviewData, Run, Settings } from '../../../interfaces';
import { FileService } from '../../services/file/file.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { StepperComponent } from '../stepper/stepper.component';
import { DataloaderUtil, EntityUtil, Util } from '../../util';

enum StepEnum {
  SelectFile,
  ChooseEntity,
  MapColumns,
  DuplicateCheck,
}

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

  icon = '';
  theme = '';
  fileName = '';
  filePath = '';
  totalRows = '';
  meta: Meta = null;
  existField: ExistField;
  metaJson: string;
  entityPickerConfig = { options: EntityUtil.ENTITY_NAMES };
  fieldPickerConfig = { format: '$label', options: [] };
  rows: any[];
  columns: any[];
  displayedColumns: string[];
  duplicateCheckEnabledTileOptions = [{ label: 'Enable Duplicate Check', value: true }, { label: 'Disable (Always Insert)', value: false }];
  duplicateCheckFieldsPickerConfig = { format: '$label', options: [] };
  duplicateCheckModel: { name: string, label: string }[] = [];
  backupEnabled = false;
  stepEnum: typeof StepEnum = StepEnum;

  private _entity = '';

  constructor(private fileService: FileService,
              private dataloaderService: DataloaderService,
              private modalService: NovoModalService,
              private zone: NgZone,
              private ref: ChangeDetectorRef) {
    this.columns = [
      { id: 'header', label: 'Column Header', enabled: true, template: 'textCell' },
      { id: 'sample', label: 'Sample Data', enabled: true, template: 'textCell' },
      { id: 'field', label: 'Bullhorn Field', enabled: true, template: 'fieldCell' },
      { id: 'subfield', label: 'Association Field', enabled: true, template: 'subfieldCell' },
    ];
    this.displayedColumns = ['selection', 'header', 'sample', 'field', 'subfield'];
  }

  set entity(entity: string) {
    this._entity = entity;
    this.theme = this._entity ? EntityUtil.getThemeForFilename(this._entity) : '';
    this.icon = this._entity ? EntityUtil.getIconForFilename(this._entity) : '';
  }

  get entity(): string {
    return this._entity;
  }

  get numSelectedRows(): number {
    return this.tables.first ? this.tables.first.state.selected.length : 0;
  }

  next(filePath?: string): void {
    switch (this.stepper.selectedIndex) {
      case StepEnum.SelectFile:
        if (this.verifyCsvFile(filePath)) {
          this.filePath = filePath;
          this.fileName = Util.getFilenameFromPath(filePath);
          this.entity = EntityUtil.getEntityNameFromFile(filePath);
          this.verifySettings();
          this.stepper.next();
        }
        break;
      case StepEnum.ChooseEntity:
        this.getMeta();
        this.stepper.next();
        break;
      case StepEnum.MapColumns:
        this.setupDuplicateCheck();
        this.stepper.next();
        break;
      case StepEnum.DuplicateCheck:
        if (this.verifySettings()) {
          const settings: Settings = this.fileService.readSettings();
          this.existField.fields = this.duplicateCheckModel.map(field => field.name);
          DataloaderUtil.setExistField(settings, this.existField);
          this.fileService.writeSettings(settings);
          this.started.emit();
        }
        break;
    }
  }

  previous(): void {
    switch (this.stepper.selectedIndex) {
      case StepEnum.DuplicateCheck:
        this.duplicateCheckFieldsPickerConfig.options = []; // Clear duplicate check data
        break;
      case StepEnum.MapColumns:
        this.rows = null; // Clear column mapping table
        break;
      case StepEnum.ChooseEntity:
        this.run.previewData = null; // Clear file data
        break;
    }
    this.stepper.previous();
  }

  onFieldMappingChanged(event: any, tableValue: any) {
    tableValue.fieldMeta = event && event.data ? this.meta.fields.find((field) => field.name === event.data.name) : null;
    Object.assign(tableValue, LoadComponent.getSubfieldData(tableValue.fieldMeta));
  }

  onSubfieldMappingChanged($event: any, tableValue: any) {
    // TODO: handle any string entry by adding it to the list of options with an identifier key
    //  may have to listen to events on the entry box for the picker, or create custom picker options call.
    console.log('$event:', $event);
    console.log('tableValue:', tableValue);
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

  // Once the CLI process is done, we should have the entire string
  private onMetaDone(): void {
    this.zone.run(() => {
      this.dataloaderService.unsubscribe();
      try {
        this.meta = JSON.parse(this.metaJson);
        // Ignore all hidden fields for now (fields that are read only in meta) - TODO: provide switch for this
        this.meta.fields = this.meta.fields.filter(f => !f.readOnly);
      } catch (parseErr) {
        this.modalService.open(InfoModalComponent, {
          title: 'Error Retrieving Meta!',
          message: parseErr,
        });
      }
      // TODO: Validate that selected fields are filled in and are not duplicates before loading
      this.fieldPickerConfig.options = LoadComponent.createPickerOptionsFromMeta(this.meta);
      // Kick off preview data from the CSV file, and wait to render table until it's finished reading
      this.fileService.getCsvPreviewData(this.filePath, this.onPreviewData.bind(this), this.onPreviewDataError.bind(this));
    });
  }

  // Get CSV file data and match it up with meta
  private onPreviewData(previewData: PreviewData): void {
    this.zone.run(() => {
      this.run.previewData = previewData;
      this.totalRows = Util.getAbbreviatedNumber(this.run.previewData.total);
      this.existField = DataloaderUtil.getExistField(this.fileService.readSettings(), this.entity);
      this.rows = this.run.previewData.headers.map(header => {
        const sampleData: Object = this.run.previewData.data.find((data) => data[header]);
        const [fieldName, associatedFieldName] = header.split('.');
        const fieldMeta = LoadComponent.findMatchingFieldMeta(this.meta, fieldName);
        return Object.assign({
          id: header,
          header: header,
          sample: sampleData ? sampleData[header] : '',
          field: fieldMeta ? LoadComponent.createPickerOptionFromFieldMeta(fieldMeta) : null,
          fieldMeta,
        }, LoadComponent.getSubfieldData(fieldMeta, associatedFieldName));
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

  private setupDuplicateCheck(): void {
    // The picker deals with values in the format: { name: string, label: string } while the existField data stored is names only
    this.duplicateCheckFieldsPickerConfig.options = this.tables.first.state.selected.map((row) => row.field);
    this.duplicateCheckModel = this.duplicateCheckFieldsPickerConfig.options
      .filter(option => option && this.existField.fields.includes(option.name));
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

  private static getSubfieldData(fieldMeta: Field, associatedFieldName?: string): Object {
    const associatedEntityMeta = fieldMeta && fieldMeta.associatedEntity;
    const subfieldMeta = associatedEntityMeta && LoadComponent.findMatchingFieldMeta(associatedEntityMeta, associatedFieldName);
    const subfield = subfieldMeta && LoadComponent.createPickerOptionFromFieldMeta(subfieldMeta);
    const subfieldPickerConfig = associatedEntityMeta && {
      format: '$label',
      options: LoadComponent.createPickerOptionsFromMeta(associatedEntityMeta),
    };
    return { associatedEntityMeta, subfieldMeta, subfield, subfieldPickerConfig };
  }

  private static findMatchingFieldMeta(meta: Meta, fieldName?: string): Field | null {
    let results = [];
    if (fieldName) {
      const fuzzySearch = new Fuse(meta.fields, { keys: ['name', 'label'] });
      results = fuzzySearch.search(fieldName);
    }
    return results.length ? results[0] : null;
  }

  private static createPickerOptionsFromMeta(meta: Meta): { name: string, label: string }[] {
    return meta && meta.fields ? meta.fields.map((field) => {
      return LoadComponent.createPickerOptionFromFieldMeta(field);
    }) : null;
  }

  private static createPickerOptionFromFieldMeta(field: Field): { name: string, label: string } {
    return { name: field.name, label: field.label ? `${field.label} (${field.name})` : field.name };
  }
}
