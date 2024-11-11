export class MedecinModule {
  id : number | undefined ;
  nom : string | undefined ;
  prenom : string | undefined ;
  adresse : string | undefined;
  ville : string | undefined;
  matriculeFiscale : string | undefined ;
  phoneNumber : string | undefined ;
  type : string | undefined ;
  //matricule : string | undefined ;
  matriculeMedecin : string | undefined ;

  constructor(nom:string,prenom:string) {
    this.nom=nom
    this.prenom=prenom
  }

  getNomPrenom(){
    return this.nom+' '+this.prenom
  }
}
