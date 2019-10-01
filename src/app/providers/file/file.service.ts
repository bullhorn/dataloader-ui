// Angular
import { Injectable } from '@angular/core';
// Vendor
import * as path from 'path';
import * as moment from 'moment';
import { NovoModalService } from 'novo-elements';
// App
import { ElectronService } from '../electron/electron.service';
import { EncryptUtils } from '../../utils/encrypt-utils';
import { environment } from '../../../environments/environment';
import { ErrorModalComponent } from '../../components/error-modal/error-modal.component';
import { FakePreviewData, FileServiceFakes } from './file.service.fakes';
import { Config, PreviewData, Results, Run, Settings } from '../../../interfaces';

@Injectable()
export class FileService {
  // The version of the settings file to use for backwards compatibility breaking changes
  static SETTINGS_FILE_VERSION = 5;

  private defaultConfig: Config = {
    onboarded: false,
  };
  private defaultSettings: Settings = {
    username: '',
    password: '',
    clientId: '',
    clientSecret: '',
    dataCenter: 'bhnext',
    listDelimiter: ';',
    processEmptyAssociations: false,
    wildcardMatching: true,
    singleByteEncoding: false,
    dateFormat: 'MM/dd/yy HH:mm',
    authorizeUrl: 'https://auth9.bullhornstaffing.com/oauth/authorize',
    tokenUrl: 'https://auth9.bullhornstaffing.com/oauth/token',
    loginUrl: 'https://rest9.bullhornstaffing.com/rest-services/login',
    numThreads: 15,
    caching: true,
  };
  private userDataDir: string;
  private runsDir: string;
  private resultsFile: string;
  private outputFile: string;
  private settingsFile: string;
  private configFile: string;

  constructor(private electronService: ElectronService,
              private modalService: NovoModalService) {
    if (ElectronService.isElectron()) {
      this.userDataDir = environment.production ? this.electronService.app.getPath('userData') : 'userData';
      this.settingsFile = this.electronService.path.join(this.userDataDir, 'settings.json');
      this.configFile = this.electronService.path.join(this.userDataDir, '.config.json');
      this.runsDir = this.electronService.path.join(this.userDataDir, 'runs');
    }
  }

  /**
   * Creates a directory for the current run and a place for the results.json file to be output by Data Loader.
   *
   * @param {PreviewData} previewData the preview data to save in the current run folder
   * @returns {string} the relative results filepath for Data Loader to use when outputting results
   */
  initializeResultsFile(previewData: PreviewData): string {
    if (ElectronService.isElectron()) {
      // Create directory for the run where the dir name is the current timestamp:
      // <userData>/runs/<run timestamp>/results.json
      const timestamp: string = moment().format('YYYY-MM-DD_HH.mm.ss');
      const runDir: string = this.electronService.path.join(this.runsDir, timestamp);
      this.resultsFile = this.electronService.path.join(runDir, 'results.json');
      this.outputFile = this.electronService.path.join(runDir, 'output.txt');

      // Create runs directory if it does not exist
      if (!this.electronService.fs.existsSync(this.runsDir)) {
        this.electronService.fs.mkdirSync(this.runsDir);
      }

      // Create directory for this run if it does not exist
      if (!this.electronService.fs.existsSync(runDir)) {
        this.electronService.fs.mkdirSync(runDir);
      }

      // Save off previewData for this run
      this.writePreviewData(previewData, this.electronService.path.join(runDir, 'previewData.json'));

      // Return the relative path for CLI arguments
      return this.electronService.path.join('runs', timestamp, 'results.json');
    }
    return '';
  }

  /**
   * Reads the user's settings file and sets appropriate defaults for missing values and older versions.
   */
  readSettings(): Settings {
    if (ElectronService.isElectron()) {
      if (this.electronService.fs.existsSync(this.settingsFile)) {
        try {
          const settings: Settings = JSON.parse(this.electronService.fs.readFileSync(this.settingsFile, 'utf8'));
          // Decrypt passwords for versions 1+
          if (settings.version && settings.version >= 1) {
            settings.password = EncryptUtils.decrypt(settings.password);
            settings.clientSecret = EncryptUtils.decrypt(settings.clientSecret);
          }
          // Default processEmptyAssociations before version 2
          if (!settings.version || settings.version < 2) {
            settings.processEmptyAssociations = false;
          }
          // Default singleByteEncoding before version 3
          if (!settings.version || settings.version < 3) {
            settings.singleByteEncoding = false;
          }
          // Default wildcardMatching before version 4
          if (!settings.version || settings.version < 4) {
            settings.wildcardMatching = true;
          }
          // Default caching before version 5
          if (!settings.version || settings.version < 5) {
            settings.caching = true;
          }
          return settings;
        } catch (parseErr) {
          this.modalService.open(ErrorModalComponent, {
            title: 'Error Reading Settings File!',
            message: `Oops, something went wrong with reading '${this.settingsFile}' from disk.`
              + `Please re-save your settings.\n\n${parseErr}`,
          });
          return this.defaultSettings;
        }
      } else {
        return this.defaultSettings;
      }
    } else {
      return FileServiceFakes.SETTINGS;
    }
  }

  /**
   * Saves the users settings in the current settings file version.
   */
  writeSettings(settings: Settings): void {
    if (ElectronService.isElectron()) {
      const encryptedSettings: Settings = Object.assign({}, settings);
      encryptedSettings.password = EncryptUtils.encrypt(settings.password);
      encryptedSettings.clientSecret = EncryptUtils.encrypt(settings.clientSecret);
      encryptedSettings.version = FileService.SETTINGS_FILE_VERSION;
      this.electronService.fs.writeFileSync(this.settingsFile, JSON.stringify(encryptedSettings, null, 2));
    }
  }

  /**
   * The configuration file contains user-level settings outside of the dataloader settings
   */
  readConfig(): Config {
    if (ElectronService.isElectron()) {
      if (this.electronService.fs.existsSync(this.configFile)) {
        try {
          return JSON.parse(this.electronService.fs.readFileSync(this.configFile, 'utf8'));
        } catch (parseErr) {
          this.modalService.open(ErrorModalComponent, {
            title: 'Error Reading Config File!',
            message: `Oops, something went wrong with reading '${this.configFile}' from disk.\n\n${parseErr}`,
          });
          return this.defaultConfig;
        }
      } else {
        return this.defaultConfig;
      }
    } else {
      return FileServiceFakes.CONFIG;
    }
  }

  writeConfig(config: Config): void {
    if (ElectronService.isElectron()) {
      config.version = this.electronService.version();
      this.electronService.fs.writeFileSync(this.configFile, JSON.stringify(config, null, 2));
    }
  }

  /**
   * Since the CLI does not save off the stderr/stdout to file, we capture it and save it out when a run completes
   *
   * @param output: the output text that has been captured during a run
   */
  writeOutputFile(output: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.writeFileSync(this.outputFile, output);
    }
  }

  /**
   * Returns the total number of rows and the first 100 rows of CSV data with the following format:
   *
   * {
   *    filePath: 'Path/to/Candidate.csv',
   *    total: 12345,
   *    headers: ['firstName', 'lastName'],
   *    data: [{
   *        firstName: 'Jack',
   *        lastName: 'Ryan'
   *      }, {
   *        firstName: 'Jill',
   *        lastName: 'Bryan'
   *    }]
   * }
   */
  getCsvPreviewData(filePath: string, onSuccess: (previewData: PreviewData) => {}, onError: (message: string) => {}): void {
    if (ElectronService.isElectron()) {
      if (this.electronService.path.extname(filePath).toLowerCase() !== '.csv') {
        onError(`Input file must be a *.csv file, where the filename matches a valid entity name.`);
      }
      const MAX_ROWS = 100;
      const previewData: PreviewData = {
        filePath: filePath,
        total: 0,
        headers: [],
        data: [],
      };

      this.electronService.csv.fromPath(filePath, { headers: true, })
        .on('data', (row) => {
          previewData.total++;
          if (previewData.headers.length === 0) {
            previewData.headers = Object.keys(row);
          }
          if (previewData.total <= MAX_ROWS) {
            previewData.data.push(row);
          }
        })
        .on('end', () => {
          onSuccess(previewData);
        })
        .on('error', (err) => {
          console.error(err); // tslint:disable-line:no-console
          onError(err.message);
        });
    } else {
      onSuccess(new FakePreviewData());
    }
  }

  writePreviewData(previewData: PreviewData, filePath: string): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.writeFileSync(filePath, JSON.stringify(previewData, null, 2));
    }
  }

  openFile(filePath: string, userDataDir: boolean = true): void {
    if (ElectronService.isElectron()) {
      if (userDataDir) {
        this.electronService.shell.showItemInFolder(path.join(this.userDataDir, filePath));
      } else {
        this.electronService.shell.showItemInFolder(filePath);
      }
    }
  }

  onResultsFileChange(onChange: (results: Results) => {}): void {
    if (ElectronService.isElectron()) {
      const options: { persistent?: boolean; interval?: number; } = { persistent: true, interval: 500 };
      this.electronService.fs.watchFile(this.resultsFile, options, this.readResultsFile.bind(this, onChange));
    } else {
      FileServiceFakes.generateFakeResults(onChange);
    }
  }

  /**
   * Returns all previous runs that are stored locally in the userData folder
   *
   * @param onSuccess - callback when runs are retrieved from disk
   */
  getAllRuns(onSuccess: (runs: Run[]) => {}): void {
    if (ElectronService.isElectron()) {
      const allRuns: Run[] = [];
      this.electronService.fs.readdir(this.runsDir, (err: Error, files: string[]) => {
        if (err) {
          console.error(err); // tslint:disable-line:no-console
        } else {
          files.forEach((file) => {
            const dir: string = this.electronService.path.join(this.runsDir, file);
            if (this.electronService.fs.statSync(dir).isDirectory()) {
              const previewData: string = this.electronService.path.join(dir, 'previewData.json');
              const results: string = this.electronService.path.join(dir, 'results.json');
              const output: string = this.electronService.path.join(dir, 'output.txt');
              if (this.electronService.fs.existsSync(previewData) && this.electronService.fs.existsSync(results)) {
                try {
                  const run: Run = {
                    previewData: JSON.parse(this.electronService.fs.readFileSync(previewData, 'utf8')),
                    results: JSON.parse(this.electronService.fs.readFileSync(results, 'utf8')),
                  };
                  if (this.electronService.fs.existsSync(output)) {
                    run.output = this.electronService.fs.readFileSync(output, 'utf8');
                  }
                  allRuns.unshift(run);
                } catch (parseErr) {
                  console.error(`Error parsing run directory: ${dir} - ${parseErr}`); // tslint:disable-line:no-console
                }
              }
            }
          });
          onSuccess(allRuns);
        }
      });
    } else {
      onSuccess(FileServiceFakes.getAllRuns());
    }
  }

  unsubscribe(): void {
    if (ElectronService.isElectron()) {
      this.electronService.fs.unwatchFile(this.resultsFile);
    }
  }

  private readResultsFile(onChange: (results: Results) => {}): void {
    this.electronService.fs.readFile(this.resultsFile, 'utf8', (err, data) => {
      if (err) {
        console.warn(err); // tslint:disable-line:no-console
      } else {
        try {
          const results: Results = JSON.parse(data);
          onChange(results);
        } catch (parseErr) {
          console.error(parseErr); // tslint:disable-line:no-console
        }
      }
    });
  }
}
