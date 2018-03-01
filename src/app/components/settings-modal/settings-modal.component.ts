// NG
import { Component, OnInit } from '@angular/core';

// Vendor
import { FieldInteractionApi, FormUtils, NovoModalRef } from 'novo-elements';

// APP
import { FileService } from '../../providers/file/file.service';
import { ISettings } from '../../../interfaces/ISettings';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {
  meta: any;
  form: any;
  fieldSets: any;

  constructor(private modalRef: NovoModalRef, private fileService: FileService, private formUtils: FormUtils) { }

  private static removeExistingFields(value: ISettings): ISettings {
    let result: any = Object.assign({}, value);
    delete result.existFields;
    return result;
  }

  /**
   * Auto set the Environment URLs based on the data center quick selection
   */
  private static onDataCenterChange(API: FieldInteractionApi): void {
    // Predefined URLs for known data centers
    const dataCenterUrls: any = {
      bhnext: {
        authorizeUrl: 'https://auth9.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth9.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest9.bullhornstaffing.com/rest-services/login',
      },
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
      uk: {
        authorizeUrl: 'https://auth-emea.bullhornstaffing.com/oauth/authorize',
        tokenUrl: 'https://auth-emea.bullhornstaffing.com/oauth/token',
        loginUrl: 'https://rest-emea.bullhornstaffing.com/rest-services/login',
      },
      other: {
        authorizeUrl: '',
        tokenUrl: '',
        loginUrl: '',
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

  close(): void {
    this.modalRef.close();
  }

  load(): void {
    this.form.setValue(SettingsModalComponent.removeExistingFields(this.fileService.readSettings()));
    this.hideAllFields();
    this.form.controls.username.hidden = false;
    this.form.controls.password.hidden = false;
    this.form.controls.clientId.hidden = false;
    this.form.controls.clientSecret.hidden = false;
  }

  save(): void {
    this.fileService.writeSettings(this.form.value);
  }

  showSection(section: any): void {
    this.hideAllFields();
    for (let control of section.controls) {
      this.form.controls[control.key].hidden = false;
    }
  }

  hideAllFields(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.controls[key].hidden = true;
    });
  }

  private setupForm(): void {
    this.meta = {
      sectionHeaders: [{
        name: 'credentials',
        sortOrder: 10,
        enabled: true,
      }, {
        name: 'environmentUrls',
        sortOrder: 20,
        enabled: true,
      }, {
        name: 'formatting',
        sortOrder: 30,
        enabled: true,
      }, {
        name: 'performance',
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
        type: 'tiles',
        label: 'Data Center',
        required: true,
        description: 'The location of the Bullhorn REST server endpoints to use when loading data.',
        options: [
          { label: 'US BHNext', value: 'bhnext' },
          { label: 'US East', value: 'east' },
          { label: 'US West', value: 'west' },
          { label: 'UK', value: 'uk' },
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
        name: 'numThreads',
        type: 'number',
        label: 'Number of Threads',
        required: true,
        description: 'Number of threads to concurrently upload rows. Min: 1, Max: 15.',
        sortOrder: 41,
        min: 1,
        max: 15,
      }],
    };

    this.fieldSets = this.formUtils.toFieldSets(this.meta, '$ USD', {}, { token: 'TOKEN' });
    this.fieldSets[2].controls[0].interactions = [
      { event: 'init', script: SettingsModalComponent.onDataCenterChange },
      { event: 'change', script: SettingsModalComponent.onDataCenterChange },
    ];
    this.form = this.formUtils.toFormGroupFromFieldset(this.fieldSets);
  }
}
