import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BordereauxReglement} from "../model/bordereauxReglement/bordereaux-reglement";
import {file} from "../model/file/file";
import {Reglement} from "../model/reglement/reglement";
import {Bulletinsoin} from "../model/bulletinsoin/bulletinsoin";
import {Agence} from "../model/agence/agence";

@Injectable({
  providedIn: 'root'
})
export class BordereauxReglementService {
  private apiServerUrl = environment.hostUrl;
  constructor(private httpClient : HttpClient) { }

  public getFilesall():Observable<file[]>{
    return this.httpClient.get<file[]>(`${this.apiServerUrl}/file/listAll`);
  }

  public getFileById(id:number):Observable<file>{
    return this.httpClient.get<file>(`${this.apiServerUrl}/file/getFile/${id}`);
  }

  public getBordereauxReglementall():Observable<BordereauxReglement[]>{
    return this.httpClient.get<BordereauxReglement[]>(`${this.apiServerUrl}/BordereauxReglement/all`);
  }

  public addBordereauxReglement(idFile:number,bordereauxReglement:BordereauxReglement) :Observable<BordereauxReglement>{
    return this.httpClient.post<BordereauxReglement>(`${this.apiServerUrl}/BordereauxReglement/addBRforFile/${idFile}/BR`,bordereauxReglement);
  }

  public updateBordereauxReglement(idFile:number,idBR:number,bordereauxReglement:BordereauxReglement) :Observable<BordereauxReglement>{
    return this.httpClient.put<BordereauxReglement>(`${this.apiServerUrl}/BordereauxReglement/updateBRforFile/${idFile}/BR/${idBR}`,bordereauxReglement);
  }

  public updateBSforBR(idBR:number,idBS:number,bulletinsoin:Bulletinsoin) :Observable<BordereauxReglement>{
    return this.httpClient.put<BordereauxReglement>(`${this.apiServerUrl}/BulletinSoin/BordEnv/BR/${idBR}/BS/${idBS}`,bulletinsoin);
  }

  public Cloture(idBR:number,bordereauxReglement:BordereauxReglement) :Observable<BordereauxReglement>{
    return this.httpClient.put<BordereauxReglement>(`${this.apiServerUrl}/BordereauxReglement/updateBRforFileCloture/BR/${idBR}`,bordereauxReglement);
  }

  public updateBordereauxReglementNoFile(idBR:number,bordereauxReglement:BordereauxReglement) :Observable<BordereauxReglement>{
    return this.httpClient.put<BordereauxReglement>(`${this.apiServerUrl}/BordereauxReglement/updateBRforNoFile/BR/${idBR}`,bordereauxReglement);
  }
  public updateBordereauxReglementNoFileCloture(idBR:number,bordereauxReglement:BordereauxReglement) :Observable<BordereauxReglement>{
    return this.httpClient.put<BordereauxReglement>(`${this.apiServerUrl}/BordereauxReglement/updateBRforNoFileCloture/BR/${idBR}`,bordereauxReglement);
  }
  public deleteBordereauxReglement(id:number) :Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/BordereauxReglement/delete/${id}`);
  }

  public deleteFileById(id:number) :Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/file/deleteFileById/${id}`);
  }

  upload(file):Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);
    return this.httpClient.post(`${this.apiServerUrl}/file`, formData)
  }

  public getReglement(id:number):Observable<Reglement[]>{
    return this.httpClient.get<Reglement[]>(`${this.apiServerUrl}/file/getJson/${id}`);
  }

  public getSumReglement(id:number):Observable<number>{
    return this.httpClient.get<number>(`${this.apiServerUrl}/file/getRegSum/${id}`);
  }
  public onUpdateBSForBR(bulletinsoin:Bulletinsoin,idBR:number,id:number):Observable<Bulletinsoin>{
    return this.httpClient.put<Bulletinsoin>(`${this.apiServerUrl}/BulletinSoin/BordEnv/BR/${idBR}/BS/${id}`,bulletinsoin);
  }

  public getAgence() : Observable<Agence[]>{
    return this.httpClient.get<Agence[]>(`${this.apiServerUrl}/Agence/all`);
  }

  public getBullByAgence(id : number) : Observable<Bulletinsoin[]>{
    return this.httpClient.get<Bulletinsoin[]>(`${this.apiServerUrl}/BulletinSoin/getBullByAgence/${id}`);
  }

  public getBullByBRId(id : number) : Observable<Bulletinsoin[]>{
    return this.httpClient.get<Bulletinsoin[]>(`${this.apiServerUrl}/BulletinSoin/BullByBRID/${id}`);
  }

  public getAllFile():Observable<file[]>{
    return this.httpClient.get<file[]>(`${this.apiServerUrl}/file/getFileAll`);
  }

  public deleteFile(id : number) : Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/file/delete/${id}`);
  }

  public findBR(id:number) : Observable<BordereauxReglement> {
    return  this.httpClient.get<BordereauxReglement>(`${this.apiServerUrl}/BordereauxReglement/findBR/${id}`);
  }

  public existBRbyRef(ref : string) : Observable<boolean> {
    return this.httpClient.get<boolean>(`${this.apiServerUrl}/BordereauxReglement/existBordRegByNom/${ref}`);
  }

  existBullinBR(id : number) : Observable<boolean>{
    return this.httpClient.get<boolean>(`${this.apiServerUrl}/BordereauxReglement/existBRinBull/${id}`);
  }
}
