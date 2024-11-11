import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {concatMap, map, Observable} from "rxjs";
import {Bulletinsoin} from "../model/bulletinsoin/bulletinsoin";
import {ActeBS} from "../model/acteBS/acteBS";
import {Enfants} from "../model/enfant/enfant";
import {MedecinModule} from "../model/medecin/medecin.module";
import {Pharmacie} from "../model/pharmacie/pharmacie";
import {Actemedical} from "../model/actemedical/actemedical";
import {NgForm} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ActeBSService {
  private apiServerUrl = environment.hostUrl;
  constructor(private httpClient : HttpClient) { }


  public getAllActeBS():Observable<ActeBS[]>{
    return this.httpClient.get<ActeBS[]>(`${this.apiServerUrl}/ActeBS/listAll`);
  }

  public getActeBullSoin(id :number):Observable<ActeBS[]>{
    return this.httpClient.get<ActeBS[]>(`${this.apiServerUrl}/ActeBS/findByBS/${id}`);
  }

  public addActeBullSoin(actebs:ActeBS):Observable<ActeBS>{
    return this.httpClient.post<ActeBS>(`${this.apiServerUrl}/ActeBS/addActeBS`,actebs);
  }

  public findMedecinByPrenom(prenom:string):Observable<MedecinModule[]> {
    return this.httpClient.get<MedecinModule[]>(`${this.apiServerUrl}/ActeBS/getMedecinByPrenom/${prenom}`)
  }



  public getMedecinfullFull():Observable<MedecinModule[]>{
    return this.httpClient.get<MedecinModule[]>(`${this.apiServerUrl}/Medecin/all`);
  }



  public geIdMed(nom : string):Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/getIdMedcinByNom/${nom}`,{responseType : 'text'});
  }

 public getMedNomByMatMed(matMed : string) : Observable<any>{
    return this.httpClient.get
    (`${this.apiServerUrl}/ActeBS/findMedNomByMatriculeMed/${matMed}`,{responseType : 'text'});
 }

  public getMedPrenomByMatMed(matMed : string) : Observable<any>{
    return this.httpClient.get
    (`${this.apiServerUrl}/ActeBS/findMedPrenomByMatriculeMed/${matMed}`,{responseType : 'text'});
  }

  public getMedTypeByMatMed(matMed : string) : Observable<any>{
    return this.httpClient.get
    (`${this.apiServerUrl}/ActeBS/findMedTypeByMatriculeMed/${matMed}`,{responseType : 'text'});
  }

  public getPharmacieByMatPhar(matPhar : string) : Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/findPharByMatPhar/${matPhar}`,
      {responseType : 'text'});
  }

 public getPraticienNomByMatriculePraticien(matPra : string) : Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/findPraNomByMatPra/${matPra}`
      ,{responseType : 'text'});
  }

  public getPraticienPrenomByMatriculePraticien(matPra : string) : Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/findPraPrenomByMatPra/${matPra}`,
      {responseType : 'text'});
  }

 public getFullAnything(mat : string) : Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/findAllByMat/${mat}`,
      {responseType : 'text'});
  }

  public getActeMedicalDesignation(code : string): Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/findActeMedical/${code}`,
      {responseType : 'text'});
  }


  public getMedExist(matMed : string) : Observable<any>{
    return this.httpClient.get
    (`${this.apiServerUrl}/ActeBS/existKeyup/${matMed}`);
  }

  public getPharExist(matPhar : string) : Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/existPhar/${matPhar}`);
  }

  public getPraExist(matPra : string):Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/existPra/${matPra}`);
  }
  public getActeMedicaleExist(code : string):Observable<any>{
    return this.httpClient.get(`${this.apiServerUrl}/ActeBS/existActeMed/${code}`);
  }

  public getMedecinByType(type : string) : Observable<MedecinModule[]>{
    return this.httpClient.get<MedecinModule[]>(`${this.apiServerUrl}/ActeBS/findMedByType/${type}`)
  }

  public ajouterMedecinForActeBS(acte : ActeBS , idBull : number , code : string , matMed : string) : Observable<Bulletinsoin>{
    return this.httpClient.post<Bulletinsoin>(`${this.apiServerUrl}/ActeBS/BullSoin/${idBull}/acteMedical/${code}/Med/${matMed}/acteBS`,acte);
  }

  public ajouterPraticienForActeBS(acte : ActeBS , idBull : number, code : string , matPra : string) : Observable<Bulletinsoin>{
    return this.httpClient.post<Bulletinsoin>(`${this.apiServerUrl}/ActeBS/BullSoin/${idBull}/acteMedical/${code}/Pra/${matPra}/acteBS`,acte);
  }

  public  ajouterPharmacieForActeBS(acte : ActeBS , idBull : number , code : string , matPhar : string) : Observable<Bulletinsoin>{
    return this.httpClient.post<Bulletinsoin>(`${this.apiServerUrl}/ActeBS/BullSoin/${idBull}/acteMedical/${code}/Phar/${matPhar}/acteBS`,acte)
  }
  public updateMedecinForActeBS(actebs:ActeBS , idBull : number,idActeBS:number, code : string , matMed : string) :Observable<ActeBS>{
    return this.httpClient.put<ActeBS>(`${this.apiServerUrl}/ActeBS/Bull/${idBull}/acteMedical/${code}/Med/${matMed}/acteBS/${idActeBS}`,actebs);
  }

  public updatePraticienForActeBS(actebs:ActeBS , idBull : number,idActeBS:number, code : string , matPra : string) :Observable<ActeBS>{
    return this.httpClient.put<ActeBS>(`${this.apiServerUrl}/ActeBS/Bull/${idBull}/acteMedical/${code}/Pra/${matPra}/acteBS/${idActeBS}`,actebs);
  }

  public updatePharmacieForActeBS(actebs:ActeBS , idBull : number,idActeBS:number, code : string , matPhar : string) :Observable<ActeBS>{
    return this.httpClient.put<ActeBS>(`${this.apiServerUrl}/ActeBS/Bull/${idBull}/acteMedical/${code}/Phar/${matPhar}/acteBS/${idActeBS}`,actebs);
  }

  public getMedecins():Observable<MedecinModule[]>{
    return this.httpClient.get<MedecinModule[]>(`${this.apiServerUrl}/ActeBS/getMedecins`)
  }

  public getPharmacies():Observable<Pharmacie[]>{
    return this.httpClient.get<Pharmacie[]>(`${this.apiServerUrl}/ActeBS/getPharmacies`)
  }

  public findMedecinNomPrenomByMatricule(matricule:string):Observable<MedecinModule>{
    return this.httpClient.get<MedecinModule>(`${this.apiServerUrl}/ActeBS/findMedByMatricule/${matricule}`)
  }

  public findActeMedByCode(code:string):Observable<Actemedical>{
    return this.httpClient.get<Actemedical>(`${this.apiServerUrl}/ActeBS/findActeMedByCode/${code}`)
  }

  public findPhNomByMatricule(matricule:string):Observable<Pharmacie>{
    return this.httpClient.get<Pharmacie>(`${this.apiServerUrl}/ActeBS/findPhByMatricule/${matricule}`)
  }

  public DeleteActeBS(id : number):Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServerUrl}/ActeBS/delete/${id}`);

  }

  public findPharInActeBS(mat : string) : Observable<Pharmacie>{
    return this.httpClient.get<Pharmacie>(`${this.apiServerUrl}/ActeBS/findPharInActeBS/${mat}`);
  }

}
