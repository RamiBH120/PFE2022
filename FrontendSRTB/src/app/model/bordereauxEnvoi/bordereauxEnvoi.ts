import {Bulletinsoin} from "../bulletinsoin/bulletinsoin";


export class bordereauxEnvoi {
  id : number | undefined ;
  dateDebut : Date | undefined ;
  dateFin : Date | undefined ;
  description : string | undefined ;
  nom : string | undefined ;
  bulletinSoinList : Bulletinsoin[] = [];


  constructor() {
  }

}
