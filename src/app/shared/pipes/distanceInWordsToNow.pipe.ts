import { Pipe, PipeTransform } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as ko from 'date-fns/locale/ko';

@Pipe({
  name: 'distanceInWordsToNow'
})
export class DistanceInWordsToNowPipe implements PipeTransform {
  constructor() {}

  transform(value: any, args?: any): any {
    if (value) {
      return distanceInWordsToNow(value, {locale: ko});
    }
  }

}
