// Angular
import { Component, OnInit } from '@angular/core';
// Vendor
import { FieldInteractionApi, FormUtils, NovoModalRef } from 'novo-elements';
// App
import { FileService } from '../../providers/file/file.service';
import { ISettings } from '../../../interfaces/ISettings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {
  form: any;
  fieldSets: any[];

  constructor(private fileService: FileService, private formUtils: FormUtils, private modalRef: NovoModalRef) {}

  private static removeExtraFields(value: ISettings): ISettings {
    const result: any = Object.assign({}, value);
    delete result.existFields;
    delete result.version;
    return result;
  }

  /**
   * Auto set the Environment URLs based on the data center quick selection
   */
  private static onDataCenterChange(API: FieldInteractionApi): void {
    // Predefined URLs for known data centers
    const dataCenterUrls: any = {
      waltham: {
        authorizeUrl: 'https://auth.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest.bullhornstaffing.com/rest-services/login',
      },
      east: {
        authorizeUrl: 'https://auth-east.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-east.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-east.bullhornstaffing.com/rest-services/login',
      },
      west: {
        authorizeUrl: 'https://auth-west.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-west.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-west.bullhornstaffing.com/rest-services/login',
      },
      west50: {
        authorizeUrl: 'https://auth-west50.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-west50.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-west50.bullhornstaffing.com/rest-services/login',
      },
      apac: {
        authorizeUrl: 'https://auth-apac.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-apac.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-apac.bullhornstaffing.com/rest-services/login',
      },
      uk: {
        authorizeUrl: 'https://auth-emea.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-emea.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-emea.bullhornstaffing.com/rest-services/login',
      },
      germany: {
        authorizeUrl: 'https://auth-ger.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-ger.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-ger.bullhornstaffing.com/rest-services/login',
      },
      bhnext: {
        authorizeUrl: 'https://auth9.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth9.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest9.bullhornstaffing.com/rest-services/login',
      },
      cls91: {
        authorizeUrl: 'https://auth-west9.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-west9.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-west9.bullhornstaffing.com/rest-services/login',
      },
      other: {
        authorizeUrl: '',
        tokenUrl: '',
        loginUrl: '',
      },
    };

    const currentValue: string = API.getActiveValue();
    if (dataCenterUrls[currentValue]) {
      const urls: any = dataCenterUrls[currentValue];
      for (const key in urls) {
        if (urls.hasOwnProperty(key)) {
          API.setValue(key, urls[key]);
        }
      }
    }
  }

  ngOnInit(): void {
    this.setupForm();
    this.load();
  }

  load(): void {
    this.form.setValue(SettingsModalComponent.removeExtraFields(this.fileService.readSettings()));
  }

  close(): void {
    this.modalRef.close();
  }

  save(): void {
    this.fileService.writeSettings(Object.assign(this.fileService.readSettings(), this.form.value));
    this.close();
  }

  private setupForm(): void {
    const meta: any = {
      sectionHeaders: [{
        label: 'Credentials',
        name: 'credentials',
        icon: 'bhi-credential',
        sortOrder: 10,
        enabled: true,
      }, {
        label: 'Environment URLs',
        name: 'environmentUrls',
        icon: 'bhi-globe',
        sortOrder: 20,
        enabled: true,
      }, {
        label: 'Formatting',
        name: 'formatting',
        icon: 'bhi-edit-o',
        sortOrder: 30,
        enabled: true,
      }, {
        label: 'Performance',
        name: 'performance',
        icon: 'bhi-dashboard-o',
        sortOrder: 40,
        enabled: true,
      }],
      fields: [{
        name: 'username',
        type: 'text',
        label: 'Username',
        required: true,
        description: 'Bullhorn User ID of the data loading user (a specialized user on the corp)',
        sortOrder: 11,
      }, {
        name: 'password',
        type: 'password',
        label: 'Password',
        required: true,
        description: 'Bullhorn Password of data loading user',
        sortOrder: 12,
      }, {
        name: 'clientId',
        type: 'text',
        label: 'Client ID',
        required: true,
        description: 'Required when making REST calls. To retrieve your clientId, contact Bullhorn Support.',
        sortOrder: 13,
      }, {
        name: 'clientSecret',
        type: 'password',
        label: 'Client Secret',
        required: true,
        description: 'Required when making REST calls. To retrieve your clientSecret, contact Bullhorn Support.',
        sortOrder: 14,
      }, {
        name: 'dataCenter',
        type: 'select',
        label: 'Data Center',
        required: true,
        description: 'The location of the Bullhorn REST server endpoints to use when loading data: ' +
          'http://bullhorn.github.io/Data-Center-URLs',
        options: [
          { label: 'U.S. East (Waltham) - CLS5, CLS2, CLS20', value: 'waltham' },
          { label: 'U.S. East - CLS40, CLS41, CLS42', value: 'east' },
          { label: 'U.S. West - CLS30, CLS31, CLS32, CLS33, CLS34', value: 'west' },
          { label: 'U.S. West - CLS50', value: 'west50' },
          { label: 'Asia Pacific - CLS60', value: 'apac' },
          { label: 'UK - CLS21, CLS22, CLS23', value: 'uk' },
          { label: 'Germany - CLS70', value: 'germany' },
          { label: 'BHNext', value: 'bhnext' },
          { label: 'CLS91', value: 'cls91' },
          { label: 'Other', value: 'other' }],
        sortOrder: 21,
      }, {
        name: 'authorizeUrl',
        type: 'text',
        label: 'Authorize URL',
        required: true,
        description: 'The location of your Bullhorn authorization server.',
        sortOrder: 22,
      }, {
        name: 'tokenUrl',
        type: 'text',
        label: 'Token URL',
        required: true,
        description: 'The location of your Bullhorn REST token server.',
        sortOrder: 23,
      }, {
        name: 'loginUrl',
        type: 'text',
        label: 'Login URL',
        required: true,
        description: 'The location of your Bullhorn REST login server.',
        sortOrder: 24,
      }, {
        name: 'listDelimiter',
        type: 'text',
        label: 'List Delimiter',
        required: true,
        description: 'Used to separate individual values in a single field when that field supports multiple values. ' +
          'For example, when listDeliminator=;, multiple categories can be specified as: A;B;C. Commas can also be used ' +
          'as the list delimiter value, provided quotes are used around the value, such as: "A,B,C".',
        sortOrder: 31,
      }, {
        name: 'dateFormat',
        type: 'text',
        label: 'Date Format',
        required: true,
        description: 'Default value is MM/dd/yy HH:mm. ' +
          'Documentation: http://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html',
        sortOrder: 32,
      }, {
        name: 'processEmptyAssociations',
        type: 'tiles',
        label: 'Process Empty Associations',
        required: true,
        description: 'If Yes then all To-Many association cells that are empty will remove any existing associations. ' +
          'Defaults to No, which will ignore empty cells.',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }],
        sortOrder: 33,
      }, {
        name: 'wildcardMatching',
        type: 'tiles',
        label: 'Wildcard Matching',
        required: true,
        description: 'If Yes then wildcards (*) can be used within a cell to search for multiple associations ' +
          'without having to list all of them explicitly. For example, "Java*" can be used to match ' +
          'skill entries like "Java" and "Javascript". For Search entities, instead of using literal matching, ' +
          'the full lucene syntax is supported. See all available search options here: ' +
          'https://lucene.apache.org/core/2_9_4/queryparsersyntax.html. For Query entities, (*) is is replaced with ' +
          '(%) and the full MSSQL \'like\' syntax is supported. See all available query options here: ' +
          'https://docs.microsoft.com/en-us/sql/t-sql/language-elements/like-transact-sql?view=sql-server-2017#arguments.',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }],
        sortOrder: 34,
      }, {
        name: 'singleByteEncoding',
        type: 'tiles',
        label: 'Single Byte Encoding',
        required: true,
        description: 'If Yes then CSV files will be read in using the ISO-8859-1 (single-byte) encoding. ' +
          'Defaults to No, which will read in CVS files using the UTF-8 (multi-byte) encoding. ' +
          'The single byte encoding covers only latin characters and some accented characters while ' +
          'UTF-8 covers all characters from all languages.',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }],
        sortOrder: 35,
      }, {
        name: 'numThreads',
        type: 'number',
        label: 'Number of Threads',
        required: true,
        description: 'Number of threads to concurrently upload rows. Min: 1, Max: 15.',
        min: 1,
        max: 15,
        sortOrder: 41,
      }, {
        name: 'caching',
        type: 'tiles',
        label: 'Caching',
        required: true,
        description: 'Makes loading data much faster by making as few rest calls as possible. Stores data client ' +
          'side so that the same data is not requested multiple times. Only in special circumstances would ' +
          'disabling caching make sense. The default is true, faster is better.',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }],
        sortOrder: 42,
      }],
    };

    this.fieldSets = this.formUtils.toFieldSets(meta, '$ USD', {}, { token: 'TOKEN' });
    this.fieldSets[2].controls[0].interactions = [
      { event: 'change', script: SettingsModalComponent.onDataCenterChange },
    ];
    this.form = this.formUtils.toFormGroupFromFieldset(this.fieldSets);
  }
}
