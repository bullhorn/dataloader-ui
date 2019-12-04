// Vendor
import * as moment from 'moment';
// App
import { Duration } from '../../interfaces';

export class Util {

  static noCaseCompare(a: string | null | undefined, b: string | null | undefined): boolean {
    const aLower = a ? a.toLowerCase() : a;
    const bLower = b ? b.toLowerCase() : b;
    return aLower === bLower;
  }

  static getFilenameFromPath(filePath: string): string {
    return filePath.replace(/^.*[\\\/]/, '');
  }

  /**
   * Given a duration in milliseconds, converts it to a nicely formatted string.
   */
  static msecToHMS(durationMsec: number): string {
    const date: Date = new Date(null);
    date.setMilliseconds(durationMsec ? durationMsec : 0);
    return date.toISOString().substr(11, 8);
  }

  /**
   * Given a duration in milliseconds, returns a nicely formatted minutes/seconds or days/hours/minutes if longer.
   */
  static getDurationString(durationMsec: number): string {
    const formatStr: string = durationMsec < 3600000 ? 'm[m] s[s]' : 'd[d] h[h] m[m]';
    const duration: Duration = moment.duration(durationMsec) as Duration;
    return duration.format(formatStr);
  }

  /**
   * Given a timestamp, returns a nicely formatted Month/Day/Year string.
   */
  static getStartDateString(startTime: number): string {
    return moment(startTime).format('M/D/YY');
  }

  /**
   * Transform a number to it's abbreviated notation (without rounding)
   * Examples:
   *         199 =>    199
   *        1200 =>   1.2k
   *   125000000 => 125.0m
   */
  static getAbbreviatedNumber(num: number): string {
    if (num < 1000) {
      return num.toString();
    } else {
      let d: number | undefined;
      let letter = '';
      if (num < 1000000) {
        d = 1000;
        letter = 'k';
      } else if (num < 1000000000) {
        d = 1000000;
        letter = 'm';
      } else {
        d = 1000000000;
        letter = 'b';
      }
      num /= d;
      if (Number.isInteger(num)) {
        return `${num}.0${letter}`;
      } else {
        const numStr: string = num.toString();
        const substrTo: number = numStr.indexOf('.') + 2;
        return `${numStr.substr(0, substrTo)}${letter}`;
      }
    }
  }
}
