// App
import { IPreviewData } from '../../../interfaces/IPreviewData';
import { ISettings } from '../../../interfaces/ISettings';
import { IResults } from '../../../interfaces/IResults';
import Timer = NodeJS.Timer;

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
    numThreads: 15,
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

  static PREVIEW_DATA: IPreviewData = {
    filePath: '../Path/to/dataloader/data/Candidate.csv',
    total: 210,
    headers: ['firstName', 'lastName', 'email'],
    data: [{
      firstName: 'John',
      lastName: 'Smith',
      email: 'jsmith@example.com',
    }, {
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@example.com',
    }, {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jdoe@example.com',
    }],
  };

  static generateFakeResults(callback: (results: IResults) => {}): void {
    let fakeResults: IResults = {
      processed: 0,
      inserted: 0,
      updated: 0,
      deleted: 0,
      failed: 0,
      successFile: '/Path/to/dataloader/results/Candidate_load_success.csv',
      failureFile: '/Path/to/dataloader/results/Candidate_load_failure.csv',
      logFile: '/Path/to/dataloader/log/dataloader_2017-11-20_08.22.21.log',
      startTime: 1511182001000,
      durationMsec: 0,
      errors: [],
    };
    const MAX_ITERATIONS: number = 30;
    let i: number = 0;
    let interval: Timer = setInterval(() => {
      fakeResults.processed += 7;
      fakeResults.inserted += 4;
      fakeResults.updated += 2;
      fakeResults.failed += 1;
      fakeResults.durationMsec += 1000;
      fakeResults.errors.push({
        row: fakeResults.failed,
        id: fakeResults.failed + 4,
        message: 'com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Bogus\'',
      });
      callback(fakeResults);
      if (++i >= MAX_ITERATIONS) {
        clearInterval(interval);
      }
    }, 500);
  }
}
