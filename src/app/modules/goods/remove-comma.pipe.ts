import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'removecomma'
})
export class RemoveCommaPipe implements PipeTransform {

  transform(value: string, args?: any): number {
    if (!value) {
      return null;
    }

    const woCommaValue = value.replace(/,/g, '');
    return woCommaValue ? parseInt(woCommaValue, 10) : null;
  }

}
