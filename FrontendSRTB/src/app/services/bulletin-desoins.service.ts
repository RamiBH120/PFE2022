import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {bordereauxEnvoi} from "../model/bordereauxEnvoi/bordereauxEnvoi";
import {Observable} from "rxjs";
import {Bulletinsoin} from "../model/bulletinsoin/bulletinsoin"
import {Enfants} from "../model/enfant/enfant";
import {Agents} from "../model/agent/agent";

@Injectable({
  providedIn: 'root'
})
export class BulletinDesoinsService {
  private apiServerUrl = environment.hostUrl;
  constructor(private httpClient : HttpClient) { }

  public addBulletinDeSoins(bulletinSoin1 : Bulletinsoin,idBorEnv : number , idAg : number) :Observable<bordereauxEnvoi>{
    return this.httpClient.post<bordereauxEnvoi>(`${this.apiServerUrl}/BulletinSoin/BorEn/${idBorEnv}/agents/${idAg}/BS`,bulletinSoin1);
  }

  public getBulletinSoin(id :number):Observable<Bulletinsoin[]>{
    return this.httpClient.get<Bulletinsoin[]>(`${this.apiServerUrl}/BulletinSoin/findByBorId/${id}`);
  }

  public getAllBulletinSoins():Observable<Bulletinsoin[]>{
    return this.httpClient.get<Bulletinsoin[]>(`${this.apiServerUrl}/BulletinSoin/all`);
  }

  public findEnfByAg(id:number):Observable<Enfants[]>{
    return this.httpClient.get<Enfants[]>(`${this.apiServerUrl}/BulletinSoin/getByNameEnfStar/${id}`)
  }

  public updateBulletinSoins(bulletinsoin:Bulletinsoin , idBord : number,idAg : number,idBS :number) :Observable<Bulletinsoin>{
    return this.httpClient.put<Bulletinsoin>(`${this.apiServerUrl}/BulletinSoin/BorEnv/${idBord}/agents/${idAg}/BS/${idBS}`,
      bulletinsoin);
  }

  public fetchAgentNom(id:number):Observable<Agents[]>{
    return this.httpClient.get<Agents[]>(`${this.apiServerUrl}/Agent/getMatStar/${id}`);
  }



  public ExistAg(id :number) : Observable<Boolean>{
    return this.httpClient.get<Boolean>(`${this.apiServerUrl}/BulletinSoin/AgentsExiste/${id}`);
  }

  public ExistEnf(id :number) : Observable<Boolean>{
    return this.httpClient.get<Boolean>(`${this.apiServerUrl}/BulletinSoin/AgentsExiste/EnfantExiste${id}`);
  }

  public FindAgName(id : number) : Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/BulletinSoin/getByNameAgent/${id}`,{responseType : 'text'});
  }

  public FindAgPrenom(id :number) :Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/BulletinSoin/getByLast/${id}`,{responseType : 'text'});
  }

  public FindAgNameConj(id : number) : Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/BulletinSoin/getNameConj/${id}`,{responseType : 'text'});
  }

  public FindAgPrenomConj(id : number) :Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/BulletinSoin/getPrenomConj/${id}`,{responseType : 'text'});
  }

  public FindNameEnf(id : number) : Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/Enfant/findByLast/${id}`,{responseType : 'text'});
  }

  public FindPrenomEnf(id : number) :Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/Enfant/findByName/${id}`,{responseType : 'text'});
  }

  public DeleteBSWithId(id : number):Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/BulletinSoin/delete/${id}`);
  }

  public ExistAgBS(id :number) : Observable<Boolean>{
    return this.httpClient.get<Boolean>(`${this.apiServerUrl}/BulletinSoin/AgeBSExist/${id}`);
  }

  public findBullByAgAff(matstar : number) : Observable<Bulletinsoin[]>{
    return this.httpClient.get<Bulletinsoin[]>(`${this.apiServerUrl}/BulletinSoin/findBullByAgentAfill/${matstar}`);
  }

  public updateAgentByMatStar(matstar : number , agents : Agents) : Observable<Agents>{
    return this.httpClient.put<Agents>(`${this.apiServerUrl}/Agent/updateAgent/${matstar}`,agents);
  }

  public findBullParId(id : number) : Observable<Bulletinsoin>{
    return this.httpClient.get<Bulletinsoin>(`${this.apiServerUrl}/BulletinSoin/find/${id}`);
  }
}
