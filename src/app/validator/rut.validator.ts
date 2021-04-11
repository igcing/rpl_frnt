
import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
 
export function validatorRut(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {
        const value = control.value;
        let rut:string = value;
        const isValid = (rut:string) => {
            let valor = rut.replace('.','');
            valor = valor.replace('-','');
            let cuerpo = valor.slice(0,-1);
            let dv = valor.slice(-1).toUpperCase();
            rut = cuerpo + '-'+ dv
            
            if(cuerpo.length < 7) {  return { error : 'invalid'} }
            
            let suma = 0;
            let multiplo = 2;
            
            for(let i=1;i<=cuerpo.length;i++) {
                let index = multiplo * parseInt(valor.charAt(cuerpo.length - i),10);
                suma = suma + index;
                if(multiplo < 7) { multiplo = multiplo + 1; } else { multiplo = 2; }
            }
            
            let dvEsperado = 11 - (suma % 11);
             dv = (dv == 'K' || dv == 'k')?'10':dv;
             dv = (dv == '0')?'11':dv;
        
             if(dvEsperado != parseInt(dv,10) ) { return {error : 'invalid'} }
        }

        return isValid(rut);
    }
}