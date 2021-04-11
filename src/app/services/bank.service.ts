import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  urlBanks : string = environment.endpoint_bank;

  constructor(private http: HttpClient) { }

  getBanks() : Promise<any>{
    return this.http.get<any>(this.urlBanks).toPromise();
  }
}
