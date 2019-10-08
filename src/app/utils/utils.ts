// Vendor
import * as moment from 'moment';
// App
import { Duration, ExistField, Field, Meta, PreviewData, Settings } from '../../interfaces';

export class Utils {

  /**
   * Given a settings object with dataloader properties and a filename to load, this method returns CLI args
   *
   * @param settings the settings object with properties set by the user
   * @param {PreviewData} previewData data about the user entered input file
   * @param resultsFilePath the path to generate for the results file
   * @returns {string[]} the array of arguments to pass to the CLI
   */
  static loadArgs(settings: Settings, previewData: PreviewData, resultsFilePath: string): string[] {
    let args: string[] = this.baseArgs(settings);
    args = args.concat('listDelimiter', settings.listDelimiter);
    args = args.concat('dateFormat', settings.dateFormat);
    args = args.concat('processEmptyAssociations', settings.processEmptyAssociations ? 'true' : 'false');
    args = args.concat('wildcardMatching', settings.wildcardMatching ? 'true' : 'false');
    args = args.concat('singleByteEncoding', settings.singleByteEncoding ? 'true' : 'false');
    args = args.concat('executeFormTriggers', settings.executeFormTriggers ? 'true' : 'false');
    args = args.concat('numThreads', settings.numThreads.toString());
    args = args.concat('caching', settings.caching ? 'true' : 'false');
    args = args.concat('resultsFileEnabled', 'true');
    args = args.concat('resultsFilePath', resultsFilePath);
    args = args.concat('resultsFileWriteIntervalMsec', '500');
    args = args.concat(Utils.createExistFieldArgs(settings, previewData.filePath));
    args = args.concat('load', previewData.filePath);
    return args;
  }

  static loginArgs(settings: Settings): string[] {
    return this.baseArgs(settings).concat('login');
  }

  static metaArgs(settings: Settings, previewData: PreviewData): string[] {
    const entity = Utils.getEntityNameFromFile(previewData.filePath);
    return this.baseArgs(settings).concat('meta', entity);
  }

  static baseArgs(settings: Settings): string[] {
    let args: string[] = [];
    args = args.concat('username', settings.username);
    args = args.concat('password', settings.password);
    args = args.concat('clientId', settings.clientId);
    args = args.concat('clientSecret', settings.clientSecret);
    args = args.concat('authorizeUrl', settings.authorizeUrl);
    args = args.concat('loginUrl', settings.loginUrl);
    args = args.concat('tokenUrl', settings.tokenUrl);
    return args;
  }

  static createExistFieldArgs(settings: Settings, filePath: string): string[] {
    let args: string[] = [];
    if (settings.existFields) {
      const entity: string = Utils.getEntityNameFromFile(filePath);
      const existField: ExistField = Utils.getExistField(settings, entity);
      if (existField.enabled && Array.isArray(existField.fields) && existField.fields.length) {
        args = args.concat(entity + 'ExistField', existField.fields.join(','));
      }
    }
    return args;
  }

  static get ENTITY_ICONS(): any {
    return {
      Appointment: 'appointment',
      Candidate: 'candidate',
      CandidateCertification: 'certification',
      CandidateEducation: 'education',
      CandidateReference: 'users',
      CandidateWorkHistory: 'job',
      ClientContact: 'person',
      ClientCorporation: 'company',
      CustomObject: 'custom-objects',
      DistributionList: 'users',
      JobOrder: 'job',
      Lead: 'lead',
      Note: 'note',
      Opportunity: 'opportunity',
      Placement: 'star',
      Task: 'check-o',
      Tearsheet: 'tearsheet',
      JobSubmission: 'star-o',
      Sendout: 'sendout',
      PlacementChangeRequest: 'republish',
    };
  }

  static get ENTITY_THEMES(): any {
    return {
      ClientCorporation: 'company',
      Candidate: 'candidate',
      Lead: 'lead',
      ClientContact: 'contact',
      Opportunity: 'opportunity',
      JobOrder: 'job',
      Submission: 'submission',
      Sendout: 'sendout',
      Placement: 'placement',
      Note: 'note',
    };
  }

  static get ENTITY_NAMES(): string[] {
    return [
      'Appointment',
      'AppointmentAttendee',
      'Candidate',
      'CandidateCertification',
      'CandidateEducation',
      'CandidateReference',
      'CandidateWorkHistory',
      'ClientContact',
      'ClientCorporation',
      'HousingComplex',
      'JobOrder',
      'JobSubmission',
      'Lead',
      'Note',
      'NoteEntity',
      'Opportunity',
      'Placement',
      'PlacementCommission',
      'Sendout',
      'Task',
      'Tearsheet',
      'ClientCorporationCustomObjectInstance1',
      'ClientCorporationCustomObjectInstance2',
      'ClientCorporationCustomObjectInstance3',
      'ClientCorporationCustomObjectInstance4',
      'ClientCorporationCustomObjectInstance5',
      'ClientCorporationCustomObjectInstance6',
      'ClientCorporationCustomObjectInstance7',
      'ClientCorporationCustomObjectInstance8',
      'ClientCorporationCustomObjectInstance9',
      'ClientCorporationCustomObjectInstance10',
      'JobOrderCustomObjectInstance1',
      'JobOrderCustomObjectInstance2',
      'JobOrderCustomObjectInstance3',
      'JobOrderCustomObjectInstance4',
      'JobOrderCustomObjectInstance5',
      'JobOrderCustomObjectInstance6',
      'JobOrderCustomObjectInstance7',
      'JobOrderCustomObjectInstance8',
      'JobOrderCustomObjectInstance9',
      'JobOrderCustomObjectInstance10',
      'OpportunityCustomObjectInstance1',
      'OpportunityCustomObjectInstance2',
      'OpportunityCustomObjectInstance3',
      'OpportunityCustomObjectInstance4',
      'OpportunityCustomObjectInstance5',
      'OpportunityCustomObjectInstance6',
      'OpportunityCustomObjectInstance7',
      'OpportunityCustomObjectInstance8',
      'OpportunityCustomObjectInstance9',
      'OpportunityCustomObjectInstance10',
      'PersonCustomObjectInstance1',
      'PersonCustomObjectInstance2',
      'PersonCustomObjectInstance3',
      'PersonCustomObjectInstance4',
      'PersonCustomObjectInstance5',
      'PersonCustomObjectInstance6',
      'PersonCustomObjectInstance7',
      'PersonCustomObjectInstance8',
      'PersonCustomObjectInstance9',
      'PersonCustomObjectInstance10',
      'PlacementCustomObjectInstance1',
      'PlacementCustomObjectInstance2',
      'PlacementCustomObjectInstance3',
      'PlacementCustomObjectInstance4',
      'PlacementCustomObjectInstance5',
      'PlacementCustomObjectInstance6',
      'PlacementCustomObjectInstance7',
      'PlacementCustomObjectInstance8',
      'PlacementCustomObjectInstance9',
      'PlacementCustomObjectInstance10',
    ];
  }

  // CSV Data comes back as a JSON array, where each object contains key/value pairs with headers as keys
  static createColumnConfig(data: any[], meta: Meta): any[] {
    const firstRow: string[] = data[0];
    return Object.keys(firstRow).map(key => {
      const field: Field = meta.fields.find((f) => f.name === key);
      return field ?
        { name: key, title: `${field.label} (${key})` } :
        { name: key, title: key };
    });
  }

  static getIconForFilename(filePath: string, useBhiPrefix: boolean = true): string {
    let icon = 'circle';
    let entityName: string = Utils.getEntityNameFromFile(filePath);
    if (entityName.includes('CustomObject')) {
      entityName = 'CustomObject';
    }
    if (entityName && Utils.ENTITY_ICONS[entityName]) {
      icon = Utils.ENTITY_ICONS[entityName];
    }
    if (useBhiPrefix) {
      icon = 'bhi-' + icon;
    }
    return icon;
  }

  static getThemeForFilename(filePath: string): string {
    let theme = 'note';
    const entityName: string = Utils.getEntityNameFromFile(filePath);
    if (entityName && Utils.ENTITY_THEMES[entityName]) {
      theme = Utils.ENTITY_THEMES[entityName];
    }
    return theme;
  }

  static getEntityNameFromFile(filePath: string): string {
    const fileName: string = Utils.getFilenameFromPath(filePath);
    let bestMatch = '';
    Utils.ENTITY_NAMES.forEach((entityName) => {
      if (fileName.toUpperCase().startsWith(entityName.toUpperCase())) {
        if (bestMatch.length < entityName.length) {
          // longer name is better
          bestMatch = entityName;
        }
      }
    });
    return bestMatch;
  }

  static getFilenameFromPath(filePath: string): string {
    return filePath.replace(/^.*[\\\/]/, '');
  }

  static msecToHMS(milliseconds: number): string {
    const date: Date = new Date(null);
    date.setMilliseconds(milliseconds ? milliseconds : 0);
    return date.toISOString().substr(11, 8);
  }

  static getStartDateString(startTime: number): string {
    return moment(startTime).format('M/D/YY');
  }

  static getExistField(settings: Settings, entity: string): ExistField {
    let existField: ExistField = {
      entity: entity,
      enabled: false,
      fields: [],
    };
    if (Array.isArray(settings.existFields)) {
      const existing: ExistField = settings.existFields.find((ef: ExistField) => ef.entity === entity);
      if (existing) {
        existField = Object.assign({}, existing);
      }
    }
    return existField;
  }

  static setExistField(settings: Settings, existField: ExistField): void {
    if (!settings.existFields) {
      settings.existFields = [];
    }
    const index: number = settings.existFields.findIndex((ef: ExistField) => ef.entity === existField.entity);
    if (index > -1) {
      settings.existFields[index] = existField;
    } else {
      settings.existFields.push(existField);
    }
  }

  static getExistFieldOptions(previewData: PreviewData): any[] {
    let options: any[] = [];
    if (previewData && previewData.headers) {
      options = previewData.headers.map((header) => {
        return { label: header, value: header };
      });
    }
    return options;
  }

  static getDurationString(durationMsec: number): string {
    const formatStr: string = durationMsec < 3600000 ? 'm[m] s[s]' : 'd[d] h[h] m[m]';
    const duration: Duration = moment.duration(durationMsec) as Duration;
    return duration.format(formatStr);
  }

  /**
   * Transform a number to it's abbreviated notation (without rounding)
   * Examples:
   *         199 =>    199
   *        1200 =>   1.2k
   *   125000000 => 125.0m
   */
  static getAbbreviatedNumber(num: number): string {
    if (num < 1000) {
      return num.toString();
    } else {
      let d: number | undefined;
      let letter = '';
      if (num < 1000000) {
        d = 1000;
        letter = 'k';
      } else if (num < 1000000000) {
        d = 1000000;
        letter = 'm';
      } else {
        d = 1000000000;
        letter = 'b';
      }
      num /= d;
      if (Number.isInteger(num)) {
        return `${num}.0${letter}`;
      } else {
        const numStr: string = num.toString();
        const substrTo: number = numStr.indexOf('.') + 2;
        return `${numStr.substr(0, substrTo)}${letter}`;
      }
    }
  }

  static addMetaToHeaders(headers: string[], meta: Meta): string[] {
    return headers.map((header) => {
      const field: Field = meta.fields.find((f) => f.name === header);
      return field ? `${field.label} (${header})` : header;
    });
  }
}
