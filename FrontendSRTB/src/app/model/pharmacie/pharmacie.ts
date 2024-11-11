export class Pharmacie {
  id:number;
  nom:string;
  matfisc:string;
  //matricule:string;
  adr:string;
  numtel:string;
  ville:string;
  isconventioned:boolean;
  matriculePharmacie:string ;

  constructor() {
  }
  getNom(){
    return this.nom
  }
}
