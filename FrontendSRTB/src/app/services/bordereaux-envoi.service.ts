import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {bordereauxEnvoi} from "../model/bordereauxEnvoi/bordereauxEnvoi";

@Injectable({
  providedIn: 'root'
})
export class BordereauxEnvoiService {
  private apiServerUrl = environment.hostUrl;
  constructor(private httpClient : HttpClient) { }

  public getBordereauxEnvoiall():Observable<bordereauxEnvoi[]>{
    return this.httpClient.get<bordereauxEnvoi[]>(`${this.apiServerUrl}/BordereauxEnvoi/all`);
  }

  public getBordereauxEnvoibyid(id:number):Observable<bordereauxEnvoi[]>{
    return this.httpClient.get<bordereauxEnvoi[]>(`${this.apiServerUrl}/BordereauxEnvoi/find/${id}`);
  }

  public addBordereauxEnvoi(bordereauxEnvoi1:bordereauxEnvoi) :Observable<bordereauxEnvoi>{
    return this.httpClient.post<bordereauxEnvoi>(`${this.apiServerUrl}/BordereauxEnvoi/add`,bordereauxEnvoi1);
  }

  public updateBordereauxEnvoi(bordereauxEnvoi1:bordereauxEnvoi , id : number) :Observable<bordereauxEnvoi>{
    return this.httpClient.put<bordereauxEnvoi>(`${this.apiServerUrl}/BordereauxEnvoi/update/${id}`,bordereauxEnvoi1);
  }

  public deleteBordereauxEnvoi(id:number) :Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/BordereauxEnvoi/delete/${id}`);
  }

  public getBordereauxEnvoibyid2(id:number):Observable<bordereauxEnvoi>{
    return this.httpClient.get<bordereauxEnvoi>(`${this.apiServerUrl}/BordereauxEnvoi/find/${id}`);
  }

  public exists(nom : string) : Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.apiServerUrl}/BordereauxEnvoi/existBordEnv/${nom}`);
  }

}
