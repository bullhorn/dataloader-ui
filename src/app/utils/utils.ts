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
    args = args.concat(['load', filePath]);
    return args;
  }

  static get ENTITY_ICONS(): any {
    return {
      Appointment: 'appointment',
      Candidate: 'candidate',
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
      JobSubmission: 'star-o',
      Sendout: 'sendout',
      PlacementChangeRequest: 'republish'
    };
  }

  static getIcon(longName: string): string {
    return this.ENTITY_ICONS[longName];
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
}
