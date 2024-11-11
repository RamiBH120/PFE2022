import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MedecinModule} from "../model/medecin/medecin.module";

@Injectable({
  providedIn: 'root'
})
export class MedecinService {
  private apiServerUrl = environment.hostUrl;
  constructor(private httpClient : HttpClient) { }

  public getMedecinall():Observable<MedecinModule[]>{
    return this.httpClient.get<MedecinModule[]>(`${this.apiServerUrl}/Medecin/all`);
  }

  public addMedecin(medecins:MedecinModule) :Observable<MedecinModule>{
    return this.httpClient.post<MedecinModule>(`${this.apiServerUrl}/Medecin/add`,medecins);
  }

  public updateMedecin(medecin:MedecinModule , id : number) :Observable<MedecinModule>{
    return this.httpClient.put<MedecinModule>(`${this.apiServerUrl}/Medecin/updateUser/${id}`,medecin);
  }

  public deleteMedecin(id:number) :Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/Medecin/delete/${id}`);
  }

  public getMedExistByMat(matricule : string) : Observable<any>{
    return this.httpClient.get<any>(`${this.apiServerUrl}/Medecin/existsMedByMat/${matricule}`);
  }

  public getMedExistByMatFis(matriculeFis : string) : Observable<any>{
    return this.httpClient.get<any>(`${this.apiServerUrl}/Medecin/existMedByMatFis/${matriculeFis}`);
  }
 /* public exportPdf():Observable<Blob>{
    return this.httpClient.get(`${this.apiServerUrl}/Medecin/exportPdf`,{responseType:'blob'});
  }


  */
  public ExistMedByMatActeBS(matMed : string) : Observable<any>{
    return this.httpClient.get<any>(`${this.apiServerUrl}/Medecin/findActeBSByMat/${matMed}`);
  }

}
