import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Bulletinsoin} from "../model/bulletinsoin/bulletinsoin";
import {Agents} from "../model/agent/agent";
import {Agence} from "../model/agence/agence";
import {bordereauxEnvoi} from "../model/bordereauxEnvoi/bordereauxEnvoi";
import {BordereauxReglement} from "../model/bordereauxReglement/bordereaux-reglement";
import {Visite} from "../model/visite/visite";
import {Actemedical} from "../model/actemedical/actemedical";
import {MedecinModule} from "../model/medecin/medecin.module";
import {Pharmacie} from "../model/pharmacie/pharmacie";
import {Praticien} from "../model/praticien/praticien";

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiServerUrl = environment.hostUrl;

  constructor(private httpClient : HttpClient) { }

  public getAllBulletinSoins() : Observable<Bulletinsoin[]>{
    return this.httpClient.get<Bulletinsoin[]>(`${this.apiServerUrl}/BulletinSoin/all`);
  }

  public getAgents():Observable<Agents[]>{
    return this.httpClient.get<Agents[]>(`${this.apiServerUrl}/Agent/all`);
  }

  getAllAgence():Observable<Agence[]>{
    return this.httpClient.get<Agence[]>(`${this.apiServerUrl}/Agence/all`);
  }

  public getBordereauxEnvoiall():Observable<bordereauxEnvoi[]>{
    return this.httpClient.get<bordereauxEnvoi[]>(`${this.apiServerUrl}/BordereauxEnvoi/all`);
  }

  public getBordereauxReglementall():Observable<BordereauxReglement[]>{
    return this.httpClient.get<BordereauxReglement[]>(`${this.apiServerUrl}/BordereauxReglement/all`);
  }

  public getAllVisite():Observable<Visite[]>{
    return this.httpClient.get<Visite[]>(`${this.apiServerUrl}/Visite/all`);
  }

  public getActemedicals():Observable<Actemedical[]>{
    return this.httpClient.get<Actemedical[]>(`${this.apiServerUrl}/ActeMedical/all`);
  }

  public getMedecinall():Observable<MedecinModule[]>{
    return this.httpClient.get<MedecinModule[]>(`${this.apiServerUrl}/Medecin/all`);
  }

  public getPharmacies():Observable<Pharmacie[]>{
    return this.httpClient.get<Pharmacie[]>(`${this.apiServerUrl}/Pharmacie/all`);
  }

  public getPraticienall():Observable<Praticien[]>{
    return this.httpClient.get<Praticien[]>(`${this.apiServerUrl}/Praticien/all`);
  }
}
