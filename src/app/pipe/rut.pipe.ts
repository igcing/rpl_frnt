import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rut'
})
export class RutPipe implements PipeTransform {

  transform(value: any): any {
    return this.formatRut(value);
  }

  formatRut(rut: string){
    const newRut = rut.replace(/\./g,'').replace(/\-/g, '').trim().toLowerCase();
    const lastDigit = newRut.substr(-1, 1);
    let rutDigit = newRut.substr(0, newRut.length-1)
    let format = '';
    format = this.formatter(rutDigit);
    return format.concat('-').concat(lastDigit);
  }

  formatter(nStr) {
    return nStr.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
  }

  cleanRut(rut:string){
    return rut.replace(/\./g,'').replace(/\-/g, '').trim().toLowerCase();
  }
}
