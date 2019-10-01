import * as moment from 'moment';

export interface Duration extends moment.Duration {
  format: (template?: string, precision?: number, settings?: DurationSettings) => string;
}

interface DurationSettings {
  forceLength: boolean;
  precision: number;
  template: string;
  trim: boolean | 'left' | 'right';
}
