// Vendor
import Timer = NodeJS.Timer;
import { EntityTypes } from '@bullhorn/bullhorn-types';
// App
import { Config, Errors, PreviewData, Results, Settings } from '../../../interfaces';
import { EntityUtil } from '../../util';

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
  errors: Errors[] = [];

  constructor(previewData: PreviewData = null) {
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
  headers: string[] = [
    'First Name',
    'Last',
    'Email',
    'Owner',
    'primarySkills.name',
    'Department',
    'Skill Code',
    'Age',
    'Priority',
    'TPS-GZD-TOKEN',
    'address.address1',
    'address.address2',
    'address.city',
    'address.state',
    'address.zip',
    'address.countryName'];
  data: any[] = [
    {
      'First Name': 'John',
      'Last': 'Smith',
      'Email': 'jsmith@example.com',
      'Owner': '',
      'primarySkills.name': '',
      'Department': '',
      'Skill Code': '',
      'Age': 35,
      'Priority': 4,
      'TPS-GZD-TOKEN': 'ABCD123456',
      'address.address1': '',
      'address.address2': '',
      'address.city': '',
      'address.state': '',
      'address.zip': '',
      'address.countryName': '',
    },
    {
      'First Name': 'John',
      'Last': 'Doe',
      'Email': 'jdoe@example.com',
      'Owner': '',
      'primarySkills.name': 'Skill2;Skill3',
      'Department': '',
      'Skill Code': 'A123',
      'Age': 25,
      'Priority': 10,
      'TPS-GZD-TOKEN': 'ABCD123456',
      'address.address1': '',
      'address.address2': '',
      'address.city': '',
      'address.state': '',
      'address.zip': '',
      'address.countryName': '',
    },
    {
      'First Name': 'Jane',
      'Last': 'Doe',
      'Email': 'jdoe@example.com',
      'Owner': 'Recruiter CorporateUser',
      'primarySkills.name': 'Skill3;Skill4',
      'Department': '',
      'Skill Code': 'A123',
      'Age': 30,
      'Priority': 3,
      'TPS-GZD-TOKEN': 'ABCD123456',
      'address.address1': '100 Summer Street',
      'address.address2': '17th Floor',
      'address.city': 'Boston',
      'address.state': 'MA',
      'address.zip': '2150',
      'address.countryName': 'United States',
    }];

  constructor() {
    const entityName: EntityTypes = EntityUtil.ENTITY_NAMES[Math.floor(Math.random() * 25)];
    this.filePath = `../path/to/dataloader/data/${entityName}-${Math.floor(Math.random() * (100 - 1)) + 1}.csv`;
    this.total = Math.floor(Math.random() * (1500 - 1)) + 1;
  }
}

class Run {
  static counter = 0;
  runDirectory = `C:/path/to/dataloader/2019-10-07_10.11.${++Run.counter}`;
  previewData: PreviewData = new FakePreviewData();
  results: Results = new FakeResultsData(this.previewData);
  output = '\nData Loader Sample Output File\n   Total Records: 0\n';
}

/**
 * Fake test data for running in `ng serve` mode
 */
export class FileServiceFakes {
  static SETTINGS: Settings = {
    username: 'jsmith',
    password: 'password!',
    clientId: '12345',
    clientSecret: '67890',
    authorizeUrl: 'https://auth.bullhornstaffing.com/oauth/authorize',
    tokenUrl: 'https://auth.bullhornstaffing.com/oauth/token',
    loginUrl: 'https://rest.bullhornstaffing.com/rest-services/login',
    listDelimiter: ';',
    dateFormat: 'MM/dd/yyyy',
    processEmptyAssociations: false,
    wildcardMatching: true,
    singleByteEncoding: false,
    executeFormTriggers: false,
    numThreads: 15,
    caching: true,
    existFields: [{
      entity: 'Candidate',
      enabled: true,
      fields: ['firstName', 'lastName', 'email'],
    }, {
      entity: 'ClientContact',
      enabled: true,
      fields: ['firstName', 'lastName'],
    }, {
      entity: 'Note',
      enabled: true,
      fields: ['externalID'],
    }],
  };

  static CONFIG: Config = {
    onboarded: true,
    uuid: 'localhost-testing-uuid',
    version: 'NEXT',
  };

  static ALL_RUNS: Run[] = [
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

  static getAllRuns(): Run[] {
    return this.ALL_RUNS;
  }

  static generateFakeResults(callback: (results: Results) => {}): void {
    const fakeResults: Results = new FakeResultsData();
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

  static deleteRun(dir: string) {
    this.ALL_RUNS = this.ALL_RUNS.filter((run) => {
      return run.runDirectory !== dir;
    });
  }
}
