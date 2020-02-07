// Angular
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
// Vendor
import { NovoModalService, NovoToastService, } from 'novo-elements';
import * as Fuse from 'fuse.js';
// App
import { DataloaderService } from '../../services/dataloader/dataloader.service';
import { ExistField, Field, Meta, PreviewData, Run, Settings } from '../../../interfaces';
import { FileService } from '../../services/file/file.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { StepperComponent } from '../stepper/stepper.component';
import { DataloaderUtil, EntityUtil, Util } from '../../util';
import { SettingsModalComponent } from '../settings-modal/settings-modal.component';

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
  entityPickerModifiedByUser = false;

  private _entity = '';

  constructor(private fileService: FileService,
              private dataloaderService: DataloaderService,
              private modalService: NovoModalService,
              private toaster: NovoToastService,
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

  get numInvalidRows(): number {
    return !this.numSelectedRows ? 0 : this.tables.first.state.selected.reduce((acc, row) => {
      return acc + (this.isRowValid(row) ? 0 : 1);
    }, 0);
  }

  get mapColumnsTooltip(): string {
    return !this.numSelectedRows ? `No columns are mapped, select one or more columns to continue` :
      this.numInvalidRows ? `There are ${this.numInvalidRows} selected columns that are not mapped to a bullhorn field` : '';
  }

  get duplicateCheckValid(): boolean {
    return !this.existField.enabled || (this.duplicateCheckModel && this.duplicateCheckModel.length > 0);
  }

  get duplicateCheckTooltip(): string {
    return this.duplicateCheckValid ? 'Start uploading data into Bullhorn' : 'No duplicate check field selected';
  }

  isRowValid(row: any): boolean {
    return row.field && (!row.associatedEntityMeta || row.subfield);
  }

  next(filePath?: string): void {
    switch (this.stepper.selectedIndex) {
      case StepEnum.SelectFile:
        if (this.verifyCsvFile(filePath)) {
          this.filePath = filePath;
          this.fileName = Util.getFilenameFromPath(filePath);
          this.entity = EntityUtil.getEntityNameFromFile(filePath);
          this.entityPickerModifiedByUser = false;
          this.verifySettings();
          this.stepper.next();
        }
        break;
      case StepEnum.ChooseEntity:
        if (this.entity) {
          this.getMeta();
          this.stepper.next();
        } else {
          this.toaster.alert(LoadComponent.createAlertOptions({
            title: 'Choose Entity to Continue',
            message: 'Use the picker to select the bullhorn entity to load data for'
          }));
        }
        break;
      case StepEnum.MapColumns:
        if (this.numSelectedRows && !this.numInvalidRows) {
          this.run.previewData.entity = this.entity;
          this.run.previewData.columnMap = this.rows.reduce((acc, row) => {
            return Object.assign(acc, {
              [row.header]: this.tables.first.isSelected(row) ? row.subfield ? `${row.field.name}.${row.subfield.name}` : row.field.name : '',
            });
          }, {});
          this.setupDuplicateCheck();
          this.stepper.next();
        } else if (this.numSelectedRows) {
          this.toaster.alert(LoadComponent.createAlertOptions({
            title: `${this.numInvalidRows} Selected Columns Not Mapped`,
            message: `All selected columns must be mapped to a bullhorn field, including an associated field for associations`,
          }));
        }
        break;
      case StepEnum.DuplicateCheck:
        if (this.duplicateCheckValid) {
          if (this.verifySettings()) {
            if (this.existField.enabled) {
              const settings: Settings = this.fileService.readSettings();
              this.existField.fields = this.duplicateCheckModel.map(field => field.name);
              DataloaderUtil.setExistField(settings, this.existField);
              this.fileService.writeSettings(settings);
            }
            this.started.emit();
          }
        } else {
          this.toaster.alert(LoadComponent.createAlertOptions({
            title: `No Duplicate Check Fields Selected`,
            message: `Select field(s) to use when duplicate checking, or disable duplicate checking.`,
          }));
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
        this.ref.detectChanges();
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
        // TODO: Provide show hidden fields switch (readOnly == hidden)
        // this.meta.fields = this.meta.fields.filter(f => !f.readOnly);
      } catch (parseErr) {
        this.previous();
        this.modalService.open(SettingsModalComponent);
        this.modalService.open(InfoModalComponent, {
          title: 'Error Getting Field Map Settings',
          message: 'Check that your login credentials are valid and then try again',
        });
      }
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

      this.ref.detectChanges();
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
    const associatedEntityMeta = this.getAssociatedEntityMeta(fieldMeta);
    const subfieldMeta = associatedEntityMeta && LoadComponent.findMatchingFieldMeta(associatedEntityMeta, associatedFieldName);
    const subfield = subfieldMeta && LoadComponent.createPickerOptionFromFieldMeta(subfieldMeta);
    const subfieldPickerConfig = associatedEntityMeta && {
      format: '$label',
      minSearchLength: 0,
      options: (term) => {
        return new Promise((resolve) => {
          const options = LoadComponent.createPickerOptionsFromMeta(associatedEntityMeta);
          const exists = options.find(option => Util.equalsIgnoreCase(term, option.name) || Util.equalsIgnoreCase(term, option.label));
          if (term.length && !exists) {
            options.unshift({ name: term, label: term });
          }
          resolve(options);
        });
      },
    };
    return { associatedEntityMeta, subfieldMeta, subfield, subfieldPickerConfig };
  }

  // Handles converting composite fields into the associated entity format for simplicity
  private static getAssociatedEntityMeta(fieldMeta: Field): Meta {
    if (fieldMeta) {
      if (fieldMeta.associatedEntity) {
        return fieldMeta.associatedEntity;
      } else if (fieldMeta.fields) {
        return {
          entity: fieldMeta.dataType,
          label: fieldMeta.label,
          fields: fieldMeta.fields,
        };
      }
    }
    return null;
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

  private static createAlertOptions(options: Object): Object {
    return Object.assign({ icon: 'caution', theme: 'danger', position: 'growlTopRight', hideDelay: 7000 }, options);
  }
}
