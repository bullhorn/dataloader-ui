// Angular
import { Component, OnInit } from '@angular/core';
// Vendor
import { FieldInteractionApi, FormUtils } from 'novo-elements';
// App
import { FileService } from '../../providers/file/file.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  form: any;
  fieldSets: any[];

  constructor(private fileService: FileService, private formUtils: FormUtils) {
  }

  /**
   * Auto set the Environment URLs based on the data center quick selection
   */
  private static onDataCenterChange(API: FieldInteractionApi): void {
    // Predefined URLs for known data centers
    const dataCenterUrls: any = {
      east: {
        authorizeUrl: 'https://auth.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest.bullhornstaffing.com/rest-services/login',
      },
      west: {
        authorizeUrl: 'https://auth-west.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-west.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-west.bullhornstaffing.com/rest-services/login',
      },
      bhnext: {
        authorizeUrl: 'https://auth9.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth9.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest9.bullhornstaffing.com/rest-services/login',
      },
      uk: {
        authorizeUrl: 'https://auth-emea.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-emea.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-emea.bullhornstaffing.com/rest-services/login',
      },
    };

    let currentValue: string = API.getActiveValue();
    if (dataCenterUrls[currentValue]) {
      let urls: any = dataCenterUrls[currentValue];
      for (let key in urls) {
        API.setValue(key, urls[key]);
      }
    }
  }

  ngOnInit(): void {
    this.setupForm();
    this.load();
  }

  load(): void {
    this.form.setValue(this.fileService.readSettings());
  }

  save(): void {
    this.fileService.writeSettings(this.form.value);
  }

  private setupForm(): void {
    let meta: any = {
      sectionHeaders: [{
        'label': 'Credentials',
        'name': 'credentials',
        'icon': 'bhi-user',
        'sortOrder': 10,
        'enabled': true,
      }, {
        'label': 'Environment URLs',
        'name': 'environmentUrls',
        'icon': 'bhi-tools',
        'sortOrder': 20,
        'enabled': true,
      }, {
        'label': 'Formatting',
        'name': 'formatting',
        'icon': 'bhi-configure-o',
        'sortOrder': 30,
        'enabled': true,
      }, {
        'label': 'Performance',
        'name': 'performance',
        'icon': 'bhi-dashboard-o',
        'sortOrder': 40,
        'enabled': true,
      }],
      fields: [{
        name: 'username',
        type: 'text',
        dataType: 'String',
        label: 'Username',
        required: true,
        description: 'Bullhorn User ID of the data loading user (a specialized user on the corp)',
        sortOrder: 11,
      }, {
        name: 'password',
        type: 'text',
        dataType: 'String',
        label: 'Password',
        required: true,
        description: 'Bullhorn Password of data loading user',
        sortOrder: 12,
      }, {
        name: 'clientId',
        type: 'text',
        dataType: 'String',
        label: 'Client ID',
        required: true,
        description: 'Required when making REST calls. To retrieve your clientId, contact Bullhorn Support.',
        sortOrder: 13,
      }, {
        name: 'clientSecret',
        type: 'text',
        dataType: 'String',
        label: 'Client Secret',
        required: true,
        description: 'Required when making REST calls. To retrieve your clientSecret, contact Bullhorn Support.',
        sortOrder: 14,
      }, {
        name: 'dataCenter',
        type: 'tiles',
        dataType: 'String',
        label: 'Data Center',
        required: true,
        description: 'The location of the Bullhorn REST server endpoints to use when loading data.',
        options: [
          { label: 'US East', value: 'east' },
          { label: 'US West', value: 'west' },
          { label: 'US BHNext', value: 'bhnext' },
          { label: 'UK', value: 'uk' },
          { label: 'Other', value: 'other' }],
        sortOrder: 21,
      }, {
        name: 'authorizeUrl',
        type: 'text',
        dataType: 'String',
        label: 'Authorize URL',
        required: true,
        description: 'The location of your Bullhorn authorization server.',
        sortOrder: 22,
      }, {
        name: 'tokenUrl',
        type: 'text',
        dataType: 'String',
        label: 'Token URL',
        required: true,
        description: 'The location of your Bullhorn REST token server.',
        sortOrder: 23,
      }, {
        name: 'loginUrl',
        type: 'text',
        dataType: 'String',
        label: 'Login URL',
        required: true,
        description: 'The location of your Bullhorn REST login server.',
        sortOrder: 24,
      }, {
        name: 'listDelimiter',
        type: 'text',
        dataType: 'String',
        label: 'List Delimiter',
        required: true,
        description: 'Used to separate individual values in a single field when that field supports multiple values. ' +
        'For example, when listDeliminator=;, multiple categories can be specified as: A;B;C. Commas can also be used ' +
        'as the list delimiter value, provided quotes are used around the value, such as: "A,B,C".',
        sortOrder: 31,
      }, {
        name: 'dateFormat',
        type: 'text',
        dataType: 'String',
        label: 'Date Format',
        required: true,
        description: 'Default value is MM/dd/yy HH:mm. ' +
        'Documentation: http://docs.oracle.com/javase/8/docs/api/java/text/SimpleDateFormat.html',
        sortOrder: 32,
      }, {
        name: 'numThreads',
        type: 'number',
        dataType: 'Integer',
        label: 'Number of Threads',
        required: true,
        description: 'Number of threads to concurrently upload rows. Min: 1, Max: 15.',
        sortOrder: 41,
        min: 1,
        max: 15,
      }],
    };

    this.fieldSets = this.formUtils.toFieldSets(meta, '$ USD', {}, { token: 'TOKEN' });
    this.fieldSets[2].controls[0].interactions = [
      { event: 'init', script: SettingsComponent.onDataCenterChange },
      { event: 'change', script: SettingsComponent.onDataCenterChange },
    ];
    this.form = this.formUtils.toFormGroupFromFieldset(this.fieldSets);
  }
}
