import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Agents} from "../model/agent/agent";
import {Visite} from "../model/visite/visite";

@Injectable({
  providedIn: 'root'
})
export class AgentService {

  private apiServerUrl = environment.hostUrl;
  constructor(private httpClient : HttpClient) { }

  public getAgents():Observable<Agents[]>{
    return this.httpClient.get<Agents[]>(`${this.apiServerUrl}/Agent/all`);
  }

  getAgentMatsrtb(matsrtb:number):Observable<Agents>{
    return this.httpClient.get<Agents>(`${this.apiServerUrl}/Agent/get/${matsrtb}`)
  }

  public getAgByNextDate(date: string):Observable<Agents[]>{
    return this.httpClient.get<Agents[]>(`${this.apiServerUrl}/Agent/findAgByNextDate/${date}`);
  }

  public getAgConvert(date:string):Observable<Date>{
    return this.httpClient.get<Date>(`${this.apiServerUrl}/Agent/ConvertDate/${date}`);
  }

  public updateEvent(visite:Visite , id : number):Observable<Visite>{
    return this.httpClient.put<Visite>(`${this.apiServerUrl}/Visite/update/${id}`,visite);
  }

  public getAllVisite():Observable<Visite[]>{
    return this.httpClient.get<Visite[]>(`${this.apiServerUrl}/Visite/all`);
  }

  public getAllAgByEvent(date : string):Observable<Agents[]>{
    return this.httpClient.get<Agents[]>(`${this.apiServerUrl}/Agent/findAgByEventDate/${date}`);
  }

  public getAllAgByNextEvent(date : string):Observable<Agents[]>{
    return this.httpClient.get<Agents[]>(`${this.apiServerUrl}/Agent/findAgByNextEventDate/${date}`);
  }

  public updateNextEvent(id : number,visite:Visite):Observable<Visite>{
    return this.httpClient.put<Visite>(`${this.apiServerUrl}/Visite/updateVisiteForNextEvent/${id}`,visite)
  }


  updateForEvent(id : number,visite:Visite):Observable<Visite>{
    return this.httpClient.put<Visite>(`${this.apiServerUrl}/Visite/updateVisiteForEvent/${id}`,visite);
  }

  updateForLastDate(id:number,srtb:number,visite:Visite):Observable<Visite>{
    return this.httpClient.put<Visite>(`${this.apiServerUrl}/Visite/updateForLastDate/${id}/Agent/${srtb}`,visite);
  }

  updateForNextDate(id:number,visite:Visite,srtb:number):Observable<Visite>{
    return this.httpClient.put<Visite>(`${this.apiServerUrl}/Visite/updateForNextDate/${id}/${srtb}`,visite);
  }

  getConvertedMinus(id : number):Observable<Date>{
    return this.httpClient.get<Date>(`${this.apiServerUrl}/Visite/getDate/${id}`);
  }

  getConvertedMinusForEvent(id : number):Observable<Date>{
    return this.httpClient.get<Date>(`${this.apiServerUrl}/Visite/getDateForEvent/${id}`);
  }

  updateForDelete(id:number,visite:Visite):Observable<Visite>{
    return this.httpClient.put<Visite>(`${this.apiServerUrl}/Visite/updateForDele/${id}`,visite);
  }

  updateVisiteForIsVisited(id:number,visite:Visite):Observable<Visite>{
    return this.httpClient.put<Visite>(`${this.apiServerUrl}/Visite/updateVisiteForIsVisited/${id}`,visite);
  }
}
