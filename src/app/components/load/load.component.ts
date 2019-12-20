// Angular
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
// Vendor
import { NovoModalService, } from 'novo-elements';
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
  fieldNamesWithLabels: { name: string, label: string }[];
  fieldPickerConfig = { format: '$label', options: [] };
  rows: any[];
  columns: any[];
  displayedColumns: string[];
  duplicateCheckEnabledTileOptions = [{ label: 'Enable Duplicate Check', value: true }, { label: 'Disable (Always Insert)', value: false }];
  duplicateCheckFieldsPickerConfig = { format: '$label', options: [] };
  backupEnabled = false;
  stepEnum: typeof StepEnum = StepEnum;

  private _entity = '';

  constructor(private fileService: FileService,
              private dataloaderService: DataloaderService,
              private modalService: NovoModalService,
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

  onDuplicateCheckEnabledChanged(enabled: boolean): void {
    console.log('enabled:', enabled);
    console.log('this.existField:', this.existField);
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
      this.fieldNamesWithLabels = this.meta.fields.map((field) => {
        return { name: field.name, label: field.label ? `${field.label} (${field.name})` : field.name };
      });
      this.fieldPickerConfig.options = this.fieldNamesWithLabels;
      // TODO: create the subfield picker config for each subfield in the table

      // Kick off preview data from the CSV file, and wait to render table until it's finished reading
      this.fileService.getCsvPreviewData(this.filePath, this.onPreviewData.bind(this), this.onPreviewDataError.bind(this));
    });
  }

  // Get the file information, then enrich it with field names from meta data
  private onPreviewData(previewData: PreviewData): void {
    this.zone.run(() => {
      this.run.previewData = previewData;
      this.totalRows = Util.getAbbreviatedNumber(this.run.previewData.total);
      this.existField = DataloaderUtil.getExistField(this.fileService.readSettings(), this.entity);
      this.rows = this.run.previewData.headers.map(header => {
        // Get sample data - the first non-empty cell out of the rows read in
        const firstNonEmptyData: Object = this.run.previewData.data.find((data) => data[header]);

        // Look up the base name of the header in meta (without the association)
        // TODO: Improve this search using the longest possible match, for either field name or field label
        const [fieldName, associatedFieldName] = header.split('.');
        const field: Field = this.meta.fields
          .find((f) => Util.noCaseCompare(fieldName, f.name) || Util.noCaseCompare(fieldName, f.label));
        const autoMatchedFieldName = field ? field.name : '';
        // TODO: Clean this up so that subfields can reuse, except that there is no complete list, any string is allowed
        // associatedFieldName = field.associatedEntity ? field.associatedEntity.fields[0].name : associatedFieldName;

        console.log('field:', field);
        let fieldLabel = '';
        if (field) {
          const findResult = this.fieldNamesWithLabels.find((f) => f.name === autoMatchedFieldName);
          fieldLabel = findResult ? findResult.label : field.label;
        }

        return {
          id: header,
          header: header,
          sample: firstNonEmptyData ? firstNonEmptyData[header] : '',
          field: fieldLabel ? { name: autoMatchedFieldName, label: fieldLabel } : null,
          subfield: associatedFieldName,
          fieldMeta: field,
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

  private setupDuplicateCheck(): void {
    // The list is populated with the values from the table's field picker column since the format is: { name: string, label: string }
    this.duplicateCheckFieldsPickerConfig.options = this.tables.first.state.selected.map((row) => row.field);
    console.log('this.duplicateCheckFieldsPickerConfig:', this.duplicateCheckFieldsPickerConfig);
    // TODO: Modify the existField data by comparing the field name to possible field names since the field labels will change
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

  onChanged($event: any, tableValue: any) {
    console.log('$event:', $event);
    console.log('tableValue:', tableValue);
  }
}
