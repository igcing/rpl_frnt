import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transferencia } from '../models/transferencia.interface';
import { getOptions } from '../utils/httpUtils';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaService {

  constructor(private http: HttpClient) { }
  
  url: string = environment.endpoint_back+'/transferencia';

  enviarTransferencia(data_trx: Transferencia){
    let transferencia = data_trx;
    return this.http.post(this.url, transferencia,  getOptions()).toPromise();
  }

  obtenerTransferencias(){
    return this.http.get<any[]>(this.url, getOptions()).toPromise();
  }
}
