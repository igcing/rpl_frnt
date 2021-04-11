import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replacecurrency'
})
export class ReplacecurrencyPipe implements PipeTransform {

  transform(item: any, replace, replacement): any {
    if(item == null) return "";
    item = item.replaceAll(replace, replacement);
    return item;
  }

}
