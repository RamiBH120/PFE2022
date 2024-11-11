import {BordereauxReglement} from "../bordereauxReglement/bordereaux-reglement";
import {Agents} from "../agent/agent";
import {ActeBS} from "../acteBS/acteBS";
import {bordereauxEnvoi} from "../bordereauxEnvoi/bordereauxEnvoi";
import {Actemedical} from "../actemedical/actemedical";

export class Bulletinsoin {
  id:number;
  datebs:Date;
  numbs:number;
  typemalade:string ="";
  agent : Agents;
  sommeTotBull : number ;
  sommeTotMed : number ;
  sommeTotPrati : number ;
  sommeTotPhar : number ;
  sommeTotRestant : number ;
  bordereauxEnvoi : bordereauxEnvoi ;
  bordereauxReglement : BordereauxReglement ;
  acteBS:ActeBS[];
}

export class BordBSActe{
  datebs:Date;
  numbs:number;
  typemalade:string ="";
  agent : Agents;
  beneficiaire : string ;
  montantActeBS : number  ;
  dateActeBS : Date;
  nom : string | undefined ;
  acteMedical : Actemedical ;
}
