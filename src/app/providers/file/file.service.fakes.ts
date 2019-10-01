// Vendor
import Timer = NodeJS.Timer;
// App
import { IConfig } from '../../../interfaces/IConfig';
import { IErrors, IResults } from '../../../interfaces/IResults';
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { IRun } from '../../../interfaces/IRun';
import { ISettings } from '../../../interfaces/ISettings';
import { Utils } from '../../utils/utils';

class FakeResultsData {
  processed = 0;
  inserted = 0;
  updated = 0;
  deleted = 0;
  failed = 0;
  successFile = '/Path/to/dataloader/results/Candidate_load_success.csv';
  failureFile = '/Path/to/dataloader/results/Candidate_load_failure.csv';
  logFile = '/Path/to/dataloader/log/dataloader_2017-11-20_08.22.21.log';
  startTime: number;
  durationMsec: number;
  errors: IErrors[] = [];

  constructor(previewData: IPreviewData = null) {
    this.startTime = Math.floor(Math.random() * (Date.now()));
    this.durationMsec = Math.floor(Math.random() * (100000000 - 1000)) + 1000;
    if (previewData) {
      this.processed = previewData.total;
      this.failed = Math.floor(previewData.total * (Math.random() / 4));
      this.inserted = previewData.total - this.failed;
      if (Math.random() > 0.5) {
        this.updated = Math.floor(this.inserted / 2);
        this.inserted = this.inserted - this.updated;
      }
      for (let i = 0; i < this.failed; ++i) {
        this.errors.push({
          row: i,
          id: i + 10000,
          message: `com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: 'owner.name' with value: '${i}'`,
        });
      }
    }
  }
}

export class FakePreviewData {
  filePath: string;
  total: number;
  headers: string[] = ['firstName', 'lastName', 'email'];
  data: any[] = [
    { firstName: 'John', lastName: 'Smith', email: 'jsmith@example.com' },
    { firstName: 'John', lastName: 'Doe', email: 'jdoe@example.com' },
    { firstName: 'Jane', lastName: 'Doe', email: 'jdoe@example.com' },
  ];

  constructor() {
    const entityName: string = Utils.ENTITY_NAMES[Math.floor(Math.random() * 25)];
    this.filePath = `../path/to/dataloader/data/${entityName}-${Math.floor(Math.random() * (100 - 1)) + 1}.csv`;
    this.total = Math.floor(Math.random() * (400 - 1)) + 1;
  }
}

class Run {
  previewData: IPreviewData = new FakePreviewData();
  results: IResults = new FakeResultsData(this.previewData);
  output = '\nData Loader Sample Output File\n   Total Records: 0\n';
}

/**
 * Fake test data for running in `ng serve` mode
 */
export class FileServiceFakes {
  static SETTINGS: ISettings = {
    username: 'jsmith',
    password: 'password!',
    clientId: '12345',
    clientSecret: '67890',
    dataCenter: 'west',
    authorizeUrl: '',
    tokenUrl: '',
    loginUrl: '',
    listDelimiter: ';',
    dateFormat: 'MM/dd/yyyy',
    processEmptyAssociations: false,
    wildcardMatching: true,
    singleByteEncoding: false,
    numThreads: 15,
    caching: true,
    existFields: [{
      entity: 'Candidate',
      enabled: true,
      fields: ['email'],
    }, {
      entity: 'ClientContact',
      enabled: true,
      fields: ['firstName', 'lastName'],
    }],
  };

  static CONFIG: IConfig = {
    onboarded: true,
    uuid: 'localhost-testing-uuid',
    version: 'NEXT',
  };

  static ALL_RUNS: IRun[] = [
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
    new Run(),
  ];

  static getAllRuns(): IRun[] {
    this.ALL_RUNS.unshift(new Run());
    return this.ALL_RUNS;
  }

  static generateFakeResults(callback: (results: IResults) => {}): void {
    const fakeResults: IResults = new FakeResultsData();
    const MAX_ITERATIONS = 30;
    let i = 0;
    const interval: Timer = setInterval(() => {
      fakeResults.processed += 7;
      fakeResults.inserted += 4;
      fakeResults.updated += 2;
      fakeResults.failed += 1;
      fakeResults.durationMsec += 1000;
      fakeResults.errors.push({
        row: fakeResults.failed,
        id: fakeResults.failed + 4,
        message: `com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Bogus'`,
      });
      callback(fakeResults);
      if (++i >= MAX_ITERATIONS) {
        clearInterval(interval);
      }
    }, 500);
  }
}
