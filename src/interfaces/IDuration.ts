import * as moment from 'moment';

export interface IDuration extends moment.Duration {
  format: (template?: string, precision?: number, settings?: IDurationSettings) => string;
}

interface IDurationSettings {
  forceLength: boolean;
  precision: number;
  template: string;
  trim: boolean|'left'|'right';
}
