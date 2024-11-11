import {Image} from "../image/image";
import {Time} from "@angular/common";

export class User {
  id : number = 0 ;
  matricule : string | undefined ;
  username : string | undefined ;
  password : string | undefined ;
  email : string | undefined ;
  adresse : string | undefined ;
  phoneNumber : string | undefined ;
  type : string = "utilisateur";
  firstname : string | undefined ;
  lastname : string | undefined ;
  imageId:Image;
  dateNaiss:Date;
  token : string | undefined ;
  tokenCreationDate:Date;
  constructor() {
  }
}
