// App
import { ExistField, PreviewData, Settings } from '../../interfaces';

export class DataloaderUtil {

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

    if (settings.existFields) {
      const existField: ExistField = DataloaderUtil.getExistField(settings, previewData.entity);
      if (existField.enabled && Array.isArray(existField.fields) && existField.fields.length) {
        args = args.concat(previewData.entity + 'ExistField', existField.fields.join(','));
      }
    }

    if (previewData.columnMap) {
      Object.keys(previewData.columnMap).forEach(key => {
        if (key !== previewData.columnMap[key]) {
          args = args.concat(`${key}Column`, `${previewData.columnMap[key]}`);
        }
      });
    }

    args = args.concat('entity', previewData.entity);
    args = args.concat('load', previewData.filePath);
    console.log('args:', args);
    return args;
  }

  static loginArgs(settings: Settings): string[] {
    return this.baseArgs(settings).concat('login');
  }

  static metaArgs(settings: Settings, entity: string): string[] {
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
}
