import { Pipe, PipeTransform } from '@angular/core';

/*
 * Transform a number to it's abbreviated notation (without rounding)
 * Usage:
 *   num | abbreviatedNumber
 * Example:
 *   {{199 | abbreviatedNotation}}
 *   formats to: 199
 * Example:
 *   {{1200 | abbreviatedNotation}}
 *   formats to: 1.2k
 * Example:
 *   {{125000000 | abbreviatedNotation}}
 *   formats to: 125.0m
 */
@Pipe({ name: 'abbreviatedNumber' })
export class AbbreviatedNumberPipe implements PipeTransform {
  transform(num: number): string | number {
    if (num < 1000) {
      return num;
    } else {
      let d: number | undefined;
      let letter: string = '';
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
