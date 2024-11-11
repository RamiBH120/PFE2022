import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Praticien} from "../model/praticien/praticien";

@Injectable({
  providedIn: 'root'
})
export class PraticienService {

  private apiServerUrl = environment.hostUrl;

  constructor(private httpClient : HttpClient) { }

  public getPraticienall():Observable<Praticien[]>{
    return this.httpClient.get<Praticien[]>(`${this.apiServerUrl}/Praticien/all`);
  }


  public addPraticien(praticiens:Praticien) :Observable<Praticien>{
    return this.httpClient.post<Praticien>(`${this.apiServerUrl}/Praticien/add`,praticiens);
  }

  public updatePraticien(praticien:Praticien , id : number) :Observable<Praticien>{
    return this.httpClient.put<Praticien>(`${this.apiServerUrl}/Praticien/updatePraticien/${id}`,praticien);
  }

  public deletePraticien(id:number) :Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/Praticien/delete/${id}`);
  }

  public ExistPraMat(mat : string) : Observable<any>{
    return this.httpClient.get<any>(`${this.apiServerUrl}/Praticien/existPraByMat/${mat}`);
  }

  public ExistPraMatFis(matFis : string) : Observable<any>{
    return this.httpClient.get<any>(`${this.apiServerUrl}/Praticien/existPraMatFis/${matFis}`);
  }

  public ExistPraByMatActeBS(matPra : string) : Observable<any>{
    return this.httpClient.get<any>(`${this.apiServerUrl}/Praticien/findActeBSByMat/${matPra}`);
  }
}
