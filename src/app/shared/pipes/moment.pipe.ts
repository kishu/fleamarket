import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'moment'
})
export class MomentPipe implements PipeTransform {
  constructor() {
    moment.updateLocale('ko', {
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
