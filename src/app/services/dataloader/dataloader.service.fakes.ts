// Vendor
import Timer = NodeJS.Timer;
import { Error } from '../../../interfaces';
import { FakeMeta } from './fake-meta';

/**
 * Fake test data for running in `ng serve` mode
 */
export class DataloaderServiceFakes {
  static FAKE_OUTPUT_DATA: string[] = [
    'Loading Candidate records from: /Users/nathandickerson/Source/dataloader/data/Candidate.csv...\n',
    "Row 1: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 2: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 3: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 4: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 5: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 6: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 7: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 8: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 9: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 10: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 11: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 12: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 13: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 14: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 15: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 16: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 17: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 18: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 19: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 20: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 21: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 22: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 23: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 24: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 25: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 26: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 27: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    "Row 28: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Waldo'\n",
    "Row 29: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Carmen Sandiego'\n",
    "Row 30: RestApiException: Cannot find To-One Association: 'owner.name' with value: 'Amelia Earhart'\n",
    'Processed: 210 records.\n',
    'Results of DataLoader run\n',
    'Start time: 2018-05-01 07:35:09\n',
    'End time: 2018-05-01 07:35:43\n',
    'Args: load /Users/nathandickerson/Source/dataloader/data/Candidate.csv\n',
    'Total records processed: 210\n',
    'Total records inserted: 120\n',
    'Total records updated: 60\n',
    'Total records deleted: 0\n',
    'Total records failed: 30\n',
    'Finished loading Candidate records in 00:00:15\n',
  ];

  static generateFakePrintLoadCallbacks(callback: (text: string) => void): void {
    let i = 0;
    const interval: Timer = setInterval(() => {
      callback(this.FAKE_OUTPUT_DATA[i]);
      if (++i >= this.FAKE_OUTPUT_DATA.length) {
        clearInterval(interval);
      }
    }, 500);
  }

  static generateFakePrintLoginCallback(callback: (text: string) => void) {
    const responseText = Math.floor(Math.random() * 2) ? 'Login Successful' : 'Login Failed';
    setTimeout(() => callback(responseText), 1500);
  }

  static generateFakePrintMetaCallback(callback: (text: string) => void) {
    const responseText = JSON.stringify(FakeMeta.meta);
    setTimeout(() => callback(responseText), 1500);
  }

  static generateFakeDoneLoadCallback(callback: (text: string) => void): void {
    setTimeout(() => callback('Fake Output'), 15500);
  }

  static generateFakeDoneLoginCallback(callback: (text: string) => void): void {
    setTimeout(() => callback('Fake Output'), 2000);
  }

  static generateFakeDoneMetaCallback(callback: (text: string) => void): void {
    setTimeout(() => callback('Fake Output'), 1600);
  }

  static generateFakeErrorCallback(callback: (error: Error) => void): void {
    setTimeout(() => callback({ title: 'Fake Error Message', message: 'Fake Error Content' }), 3000000);
  }

  static generateFakeMissingJavaCallback(callback: (error: Error) => void): void {
    setTimeout(() => callback({ title: 'Missing Java', message: 'Fake ENOENT system message' }), 2000000);
  }
}
