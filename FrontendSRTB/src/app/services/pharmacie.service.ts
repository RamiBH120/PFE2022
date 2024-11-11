import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Pharmacie} from "../model/pharmacie/pharmacie";

@Injectable({
  providedIn: 'root'
})
export class PharmacieService {
  private apiServerUrl = environment.hostUrl;
  constructor(private httpClient : HttpClient) { }

  public getPharmacies():Observable<Pharmacie[]>{
    return this.httpClient.get<Pharmacie[]>(`${this.apiServerUrl}/Pharmacie/all`);
  }

  public addPharmacie(pharmacie:Pharmacie) :Observable<Pharmacie>{
    return this.httpClient.post<Pharmacie>(`${this.apiServerUrl}/Pharmacie/add`,pharmacie);
  }

  public updatePharmacie(pharmacie:Pharmacie , id : number) :Observable<Pharmacie>{
    return this.httpClient.put<Pharmacie>(`${this.apiServerUrl}/Pharmacie/update/${id}`,pharmacie);
  }

  public deletePharmacie(id:number) :Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/Pharmacie/delete/${id}`);
  }

  public exists(matr : string) : Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.apiServerUrl}/Pharmacie/findActeBSByMat/${matr}`);
  }

  public existPharByMatr(mat : string) : Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.apiServerUrl}/Pharmacie/existPhar/${mat}`);
  }
  public existPharByMatFis(mat : string) : Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.apiServerUrl}/Pharmacie/existPharFisc/${mat}`);
  }
}
