// Angular
import { Component, NgZone, OnInit } from '@angular/core';
// Vendor
import { FormUtils, NovoModalRef, NovoModalService } from 'novo-elements';
// App
import { DataloaderService } from '../../services/dataloader/dataloader.service';
import { FileService } from '../../services/file/file.service';
import { InfoModalComponent } from '../info-modal/info-modal.component';
import { Settings } from '../../../interfaces';

@Component({
  selector: 'app-settings',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent implements OnInit {
  form: any;
  fieldSets: any[];
  checkingLogin = false;

  constructor(private dataloaderService: DataloaderService,
              private fileService: FileService,
              private formUtils: FormUtils,
              private modalService: NovoModalService,
              private modalRef: NovoModalRef,
              private zone: NgZone) {}

  private static removeExtraFields(value: Settings): Settings {
    const result: any = Object.assign({}, value);
    delete result.existFields;
    delete result.version;
    return result;
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

  enableCredentialCheck() {
    return this.form.value &&
      this.form.value.username &&
      this.form.value.password &&
      this.form.value.clientId &&
      this.form.value.clientSecret;
  }

  checkLogin() {
    this.checkingLogin = true;
    this.dataloaderService.onPrint(this.onLoginResponse.bind(this), 'login');
    this.dataloaderService.onDone(this.onDone.bind(this), 'login');
    this.dataloaderService.login(this.form.value);
  }

  // The CLI responds with either 'Login Successful\n' or 'Login Failed\n' (with newlines)
  private onLoginResponse(loginResponse: string) {
    this.zone.run(() => {
      if (loginResponse.startsWith('Login Successful')) {
        this.modalService.open(InfoModalComponent, {
          type: 'success',
          title: loginResponse,
          message: 'Your credentials are valid',
        });
      } else if (loginResponse.startsWith('Login Failed')) {
        this.modalService.open(InfoModalComponent, {
          title: loginResponse,
          message: 'Either your username/password or clientId/clientSecret is invalid. ' +
            'Check if your username/password is valid by logging into Bullhorn.',
        });
      }
    });
  }

  private onDone() {
    this.zone.run(() => {
      this.dataloaderService.unsubscribe();
      this.checkingLogin = false;
    });
  }

  // The environment URLs are still in the form value, but not visible. This allows for the settings.json
  // to be modified by end users to change URLs to QA Boxes to use a non production environment.
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
        enabled: false,
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
        name: 'authorizeUrl',
        type: 'text',
        label: 'Authorize URL',
        required: false,
        enabled: false,
        description: 'The location of your Bullhorn authorization server.',
        sortOrder: 22,
      }, {
        name: 'tokenUrl',
        type: 'text',
        label: 'Token URL',
        required: false,
        enabled: false,
        description: 'The location of your Bullhorn REST token server.',
        sortOrder: 23,
      }, {
        name: 'loginUrl',
        type: 'text',
        label: 'Login URL',
        required: false,
        enabled: false,
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
        name: 'skipDuplicates',
        type: 'tiles',
        label: 'Skip Duplicates',
        required: true,
        description: 'If Yes then updating of existing duplicate records will be skipped. New records will be added but ' +
          'any existing records found will not be touched',
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
        name: 'executeFormTriggers',
        type: 'tiles',
        label: 'Execute Form Triggers',
        required: true,
        description: 'If Yes then Rest Form Triggers will be executed on insert/update calls. ' +
          'Default value is false, which will skip any existing Rest Form Triggers. Rest Form Triggers ' +
          'are configurable in Bullhorn Admin for Add and Edit on all major entities.',
        options: [
          { label: 'Yes', value: true },
          { label: 'No', value: false }],
        sortOrder: 36,
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
    this.form = this.formUtils.toFormGroupFromFieldset(this.fieldSets);
  }
}
