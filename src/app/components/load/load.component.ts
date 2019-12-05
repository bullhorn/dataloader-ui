// Angular
import { Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
// Vendor
import { NovoModalService, } from 'novo-elements';
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
  entity = '';
  icon = '';
  theme = '';
  fileName = '';
  filePath: string = null;
  meta: Meta = null;
  existField: ExistField;
  metaJson: string;
  entityPickerConfig = { options: EntityUtil.ENTITY_NAMES };
  fieldPickerConfig: { options: { name: string, label: string }[] };
  rows: any[];
  columns: any[];
  displayedColumns: string[];

  constructor(private fileService: FileService,
              private dataloaderService: DataloaderService,
              private modalService: NovoModalService,
              private zone: NgZone) {
    this.columns = [
      { id: 'header', label: 'Column Header', enabled: true, type: 'text' },
      { id: 'sample', label: 'Sample Data', enabled: true, type: 'text' },
      { id: 'field', label: 'Bullhorn Field', enabled: true, type: 'text', template: 'fieldCell' },
      { id: 'subfield', label: 'Sub Field', enabled: true, type: 'text', template: 'subfieldCell' },
    ];
    this.displayedColumns = ['selection', 'header', 'sample', 'field', 'subfield'];
  }

  onFileSelected(filePath: string): void {
    this.filePath = filePath;
    this.fileName = Util.getFilenameFromPath(filePath);
    this.entity = EntityUtil.getEntityNameFromFile(filePath);
    this.verifySettings();
    this.stepper.next();
  }

  onEntitySelected() {
    this.getMeta();
    this.stepper.next();
  }

  onColumnsMapped() {
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

  private getMeta(): void {
    this.meta = null;
    this.metaJson = '';
    this.dataloaderService.onPrint(this.onMetaPrint.bind(this), 'meta');
    this.dataloaderService.onDone(this.onMetaDone.bind(this), 'meta');
    this.dataloaderService.meta(this.entity);
  }

  // The CLI responds by returning the entire meta JSON object as a single printout to stdout, which may take multiple
  // electron buffers due to buffer length restrictions between the main and renderer processes.
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
    });
  }

  // Get the file information, then enrich it with field names from meta data
  private onPreviewData(previewData: PreviewData): void {
    this.zone.run(() => {
      this.run.previewData = previewData;
      this.fieldPickerConfig = {
        options: this.meta.fields.map((field) => {
          return { name: field.name, label: field.label ? `${field.label} (${field.name})` : field.name };
        })
      };
      this.createRows();
    });
  }

  private onPreviewDataError(message: string): void {
    this.zone.run(() => {
      this.modalService.open(InfoModalComponent, { title: 'Error Parsing Input File', message });
    });
  }

  private createRows(): void {
    this.existField = DataloaderUtil.getExistField(this.fileService.readSettings(), this.entity);
    this.rows = this.run.previewData.headers.map(header => {
      const firstNonEmptyData: Object = this.run.previewData.data.find((data) => data[header]);
      const field: Field = this.meta.fields.find((f) => Util.noCaseCompare(header, f.name) || Util.noCaseCompare(header, f.label));
      return {
        id: header,
        duplicateCheck: this.existField.enabled ? this.existField.fields.includes(header) : false,
        header: header,
        sample: firstNonEmptyData ? firstNonEmptyData[header] : '',
        field: field ? field.name : '',
        subfield: '',
        _selected: true,
      };
    });
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
}
