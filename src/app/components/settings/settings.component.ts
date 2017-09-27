import { Component, OnInit } from '@angular/core';
import { FormUtils, TextBoxControl, TilesControl } from 'novo-elements';
import { ElectronService } from '../../providers/electron.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  form: any;
  formControls: any[];
  private settingsFile: string;

  constructor(private electronService: ElectronService, private formUtils: FormUtils) {
    this.settingsFile = 'settings.json';
  }

  ngOnInit(): void {
    this.setupForm();
    this.load();
  }

  load(): void {
    if (this.electronService.fs) {
      this.electronService.fs.readFile(this.settingsFile, 'utf8', (err, data) => {
        if (err) {
          // noinspection TsLint
          return console.error(err);
        }
        this.form.setValue(JSON.parse(data));
      });
    }
  }

  save(): void {
    if (this.electronService.fs) {
      this.electronService.fs.writeFile(this.settingsFile, JSON.stringify(this.form.value, null, 2), (err) => {
        if (err) {
          // noinspection TsLint
          return console.error(err);
        }
      });
    }
  }

  private setupForm(): void {
    this.formControls = [
      new TextBoxControl({
        type: 'text',
        label: 'Username',
        value: '',
        required: true,
        key: 'username',
      }),
      new TextBoxControl({
        type: 'text',
        label: 'Password',
        value: '',
        required: true,
        key: 'password',
      }),
      new TextBoxControl({
        type: 'text',
        label: 'Client ID',
        value: '',
        required: true,
        key: 'clientId',
      }),
      new TextBoxControl({
        type: 'text',
        label: 'Client Secret',
        value: '',
        required: true,
        key: 'clientSecret',
      }),
      new TilesControl({
        key: 'dataCenter',
        label: 'Data Center',
        value: 'east',
        required: false,
        options: [
          { label: 'US-East', value: 'east' },
          { label: 'US-West', value: 'west' },
          { label: 'US-BHNext', value: 'bhnext' },
          { label: 'UK', value: 'uk' }],
      }),
      new TextBoxControl({
        type: 'text',
        label: 'List Delimiter',
        value: ';',
        required: true,
        key: 'listDelimiter',
      }),
      new TextBoxControl({
        type: 'text',
        label: 'Date Format',
        value: 'MM/dd/yy HH:mm',
        required: true,
        key: 'dateFormat',
      }),
    ];

    this.form = this.formUtils.toFormGroup(this.formControls);
  }
}
