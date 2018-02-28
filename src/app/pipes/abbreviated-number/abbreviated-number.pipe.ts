import { Pipe, PipeTransform } from '@angular/core';

/*
 * Transform a number to it's abbreviated notation
 */
@Pipe({ name: 'abbreviatedNumber' })
export class AbbreviatedNumberPipe implements PipeTransform {
  transform(num: number): string|number {
    if (num < 1000) {
      return num;
    } else if (num < 1000000) {
      return num / 1000 + 'k';
    } else if (num < 1000000000) {
      return num / 1000000 + 'm';
    } else {
      return num / 1000000000 + 'b';
    }
  }
}
