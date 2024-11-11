import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Actemedical} from "../model/actemedical/actemedical";

@Injectable({
  providedIn: 'root'
})
export class ActemedicalService {
  private apiServerUrl = environment.hostUrl;
  constructor(private httpClient : HttpClient) { }

  public getActemedicals():Observable<Actemedical[]>{
    return this.httpClient.get<Actemedical[]>(`${this.apiServerUrl}/ActeMedical/all`);
  }

  public addActemedical(actemedical:Actemedical) :Observable<Actemedical>{
    return this.httpClient.post<Actemedical>(`${this.apiServerUrl}/ActeMedical/add`,actemedical);
  }

  public updateActemedical(actemedical:Actemedical , id : number) :Observable<Actemedical>{
    return this.httpClient.put<Actemedical>(`${this.apiServerUrl}/ActeMedical/update/${id}`,actemedical);
  }

  public deleteActemedical(id:number) :Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/ActeMedical/delete/${id}`);
  }

  public exists(code : string) : Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.apiServerUrl}/ActeMedical/exist/${code}`);
  }

  public existActeBS(code : string) : Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.apiServerUrl}/ActeMedical/findActeBSByCode/${code}`);
  }
}
