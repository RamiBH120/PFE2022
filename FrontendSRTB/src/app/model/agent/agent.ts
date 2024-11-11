import {Agence} from "../agence/agence";
import {Enfants} from "../enfant/enfant";
import {Visite} from "../visite/visite";

export class Agents{
  matsrtb : number;
  matstar : number;
  affstar : boolean;
  nom : string ;
  prenom : string;
  direction : string;
  fonction : string;
  dateNaiss : Date;
  situationCivil : string;
  nomconj : string;
  prenomconj: string;
  enfants : Enfants[];
  SommeBulletinDeSoins : number ;
  SommePharmacieActeBS : number ;
  Sommerestant : number ;
  agence : Agence;
  visite : Visite ;
}
