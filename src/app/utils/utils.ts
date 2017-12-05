// App
import { ISettings } from '../../interfaces/ISettings';

export class Utils {

  /**
   * Given a settings object with dataloader properties and a filename to load, this method returns CLI args
   *
   * @param settings the settings object with properties set by the user
   * @param {string} filePath the path to the file to load
   * @returns {string[]} the array of arguments to pass to the CLI
   */
  static createArgs(settings: ISettings, filePath: string): string[] {
    let args: string[] = [];
    args = args.concat(['username', settings.username]);
    args = args.concat(['password', settings.password]);
    args = args.concat(['clientId', settings.clientId]);
    args = args.concat(['clientSecret', settings.clientSecret]);
    args = args.concat(['authorizeUrl', settings.authorizeUrl]);
    args = args.concat(['loginUrl', settings.loginUrl]);
    args = args.concat(['tokenUrl', settings.tokenUrl]);
    args = args.concat(['listDelimiter', settings.listDelimiter]);
    args = args.concat(['dateFormat', settings.dateFormat]);
    args = args.concat(['numThreads', settings.numThreads.toString()]);
    args = args.concat(['resultsFileEnabled', 'true']);
    args = args.concat(['resultsFilePath', './results.json']);
    args = args.concat(['resultsFileWriteIntervalMsec', '500']);
    args = args.concat(['load', filePath]);
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

  static createColumnConfig(data: any[]): any[] {
    let columnConfig: any[] = [];

    for (let key in data[0]) {
      columnConfig.push({
        name: key,
        title: key,
      });
    }

    return columnConfig;
  }

  static getIconForFilename(filePath: string): string {
    let icon: string = 'circle';
    let entityName: string = Utils.getEntityNameFromFile(filePath);
    if (entityName.includes('CustomObject')) {
      entityName = 'CustomObject';
    }
    if (entityName && Utils.ENTITY_ICONS[entityName]) {
      icon = Utils.ENTITY_ICONS[entityName];
    }
    return 'bhi-' + icon;
  }

  static getThemeForFilename(filePath: string): string {
    let theme: string = 'note';
    let entityName: string = Utils.getEntityNameFromFile(filePath);
    if (entityName && Utils.ENTITY_THEMES[entityName]) {
      theme = Utils.ENTITY_THEMES[entityName];
    }
    return theme;
  }

  static getEntityNameFromFile(filePath: string): string {
    let fileName: string = Utils.getFilenameFromPath(filePath);
    let bestMatch: string = '';
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
    let date = new Date(null);
    date.setMilliseconds(milliseconds);
    return date.toISOString().substr(11, 8);
  }
}
