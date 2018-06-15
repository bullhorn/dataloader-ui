// Vendor
import Timer = NodeJS.Timer;
import { IError } from '../../../interfaces/IError';

/**
 * Fake test data for running in `ng serve` mode
 */
export class DataloaderServiceFakes {
  static FAKE_OUTPUT_DATA: string[] = [
    'Loading Candidate records from: /Users/nathandickerson/Source/dataloader/data/Candidate.csv...\n',
    'Row 1: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 2: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 3: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 4: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 5: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 6: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 7: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 8: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 9: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 10: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 11: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 12: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 13: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 14: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 15: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 16: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 17: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 18: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 19: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 20: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 21: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 22: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 23: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 24: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 25: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 26: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 27: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
    'Row 28: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Waldo\'\n',
    'Row 29: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Carmen Sandiego\'\n',
    'Row 30: com.bullhornsdk.data.exception.RestApiException: Cannot find To-One Association: \'owner.name\' with value: \'Amelia Earhart\'\n',
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

  static generateFakePrintCallbacks(callback: (text: string) => void): void {
    let i: number = 0;
    let interval: Timer = setInterval(() => {
      callback(this.FAKE_OUTPUT_DATA[i]);
      if (++i >= this.FAKE_OUTPUT_DATA.length) {
        clearInterval(interval);
      }
    }, 500);
  }

  static generateFakeDoneCallback(callback: (text: string) => void): void {
    setTimeout(() => callback('Fake Output'), 15500);
  }

  static generateFakeErrorCallback(callback: (error: IError) => void): void {
    setTimeout(() => callback({ title: 'Fake Error Message', message: 'Fake Error Content' }), 2000);
  }
}
