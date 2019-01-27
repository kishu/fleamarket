import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

@Pipe({
  name: 'relativeDate'
})
export class RelativeDatePipe implements PipeTransform {
  constructor() {
    moment.updateLocale('en', {
      relativeTime : {
        past: '%s'
      } as any
    });
  }

  transform(value: any, args?: any): any {
    if (value) {
      return moment(value).fromNow();
    }
  }

}
