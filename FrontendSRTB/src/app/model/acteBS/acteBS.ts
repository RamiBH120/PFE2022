import {Bulletinsoin} from "../bulletinsoin/bulletinsoin";
import {MedecinModule} from "../medecin/medecin.module";
import {Praticien} from "../praticien/praticien";
import {Pharmacie} from "../pharmacie/pharmacie";
import {Actemedical} from "../actemedical/actemedical";

export class ActeBS{
  id : number;
  matPraticienActeBS:string ;
  beneficiaire : string ;
  montantActeBS : number  ;
  quantiteActeBS : number;
  dateActeBS : Date;
  montantTheoriqueActeBS : number ;
  bulletinSoin : Bulletinsoin ;
  medecin : MedecinModule ;
  praticien : Praticien ;
  pharmacie : Pharmacie ;
  acteMedical : Actemedical ;
}
