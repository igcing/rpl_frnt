import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FilterDestintario } from '../models/filterDestinatario.interface';
import { Persona } from '../models/persona.interface';
import { getOptions } from '../utils/httpUtils';


@Injectable({
  providedIn: 'root'
})
export class DestinatarioService {

  constructor(private http: HttpClient) { }

  url:string = environment.endpoint_back+'/persona';

  crearDestinatario(persona : Persona){
    return this.http.post(this.url ,   persona,  getOptions());
  }

  obtenerDestinatarios(data: FilterDestintario){
    let params = "?rut_persona="+data.rut_persona

    if(data.nombre_persona)
      params += "&nombre_persona="+data.nombre_persona;
    if(data.code_banco)
      params += "&code_banco="+data.code_banco;
    if(data.tipo_cuenta)
      params += "&tipo_cuenta="+data.tipo_cuenta;
    if(data.numero_cuenta)
      params += "&numero_cuenta="+data.numero_cuenta;
    return this.http.get<any>(this.url+params, getOptions()).toPromise();
  }

}
