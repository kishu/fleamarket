import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectURL'
})
export class ObjectURLPipe implements PipeTransform {

  transform(value: File): any {
    return URL.createObjectURL(value);
  }

}
