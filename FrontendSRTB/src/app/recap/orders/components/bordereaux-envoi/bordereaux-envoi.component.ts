import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {BordereauxEnvoiService} from "../../../../services/bordereaux-envoi.service";
import {bordereauxEnvoi} from "../../../../model/bordereauxEnvoi/bordereauxEnvoi";

import {MatPaginator} from "@angular/material/paginator";
import {FormControl, NgForm, NgModel} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {BulletinDesoinsService} from "../../../../services/bulletin-desoins.service";
import {ActeBSService} from "../../../../services/acte-bs.service";
import {MedecinModule} from "../../../../model/medecin/medecin.module";
import {Title} from "@angular/platform-browser";
import {MedecinService} from "../../../../services/medecin.service";
import {PraticienService} from "../../../../services/praticien.service";
import {Praticien} from "../../../../model/praticien/praticien";
import {PharmacieService} from "../../../../services/pharmacie.service";
import {Pharmacie} from "../../../../model/pharmacie/pharmacie";
import {ActemedicalService} from "../../../../services/actemedical.service";
import {Actemedical} from "../../../../model/actemedical/actemedical";
import {Bulletinsoin} from "../../../../model/bulletinsoin/bulletinsoin";
import {Enfants} from "../../../../model/enfant/enfant";
import {ActeBS} from "../../../../model/acteBS/acteBS";
import {DatePipe} from "@angular/common";
import {AgentService} from "../../../../services/agent.service";
import {Agents} from "../../../../model/agent/agent";


@Component({
  selector: 'app-bordereaux-envoi',
  templateUrl: './bordereaux-envoi.component.html',
  styleUrls: ['./bordereaux-envoi.component.css']
})
export class BordereauxEnvoiComponent implements OnInit {
  displayedColumnsBE:string[] = ['nom','dateDebut','dateFin','nbrbs'];
  displayedColumnsBS:string[] = ['numaff','numbs','typemalade','datebs','nbracte'];
  displayedColumnsActeBS:string[] = ['codeActeBS','montantActeBS','dateActeBS','beneficiaire'];
  dataSourceBorEnv: any;
  dataSourceBSparBorEnv:any;
  dataSourceActeBS: any;
  tempods:any;
  error:any={isError:false,errorMessage:''};
  isValidDate:boolean = true;
  @ViewChild(MatPaginator) paginatorBorEnv : MatPaginator | undefined ;
  @ViewChild(MatPaginator) paginatorBS : MatPaginator | undefined ;
  @ViewChild('mal',{static : false}) myDiv : ElementRef;
  @ViewChild('matPraticienActeBS',{static : false}) matPraticienActeBS :  NgModel;
  @ViewChild('matPharmacieActeBS',{static : false}) matPharmacieActeBS :  NgModel;
  selectedRowBorEnv: any;
  selectedrow2 : any ;
  selectedActeBS : any ;
  options=[];
  optionsag= [];
  optionsenf=[];
  optionMed : any = [];
  opMed : any [] =[] ;
  concatMed : any = [];
  bs :Bulletinsoin[];
  ag : any;
  bSresp : any;
  med: MedecinModule;
  ph:Pharmacie;
  conj:boolean
  agName :'';
  agPrenom :'';
  agTypeMaladeNom : string = '' ;
  agTypeMaladePrenom : string = '';
  ny:string;
  ds:Actemedical;
  num : string;
  numBS : boolean;
  nyBS : boolean ;
  isValidDateBS:boolean;

  public tempoption: any[];
  montantTh: number = 0.0;
  optionMedecin  : MedecinModule[];
  tempoptionMedecin : any = [];
  myControl = new FormControl();
  public optionPharmacie: Pharmacie[];
  public tempoptionPharmacie: any[];
  public optionCode: any;
  opTestMed : MedecinModule[] = [] ;
  opMedFull : any = '';
  opMedPrenom : any = '' ;
  opMedType : any = '' ;
  opPharNom : any = '';
  opPraPrenom : any = '';



  Existmedecin: Boolean;
  ExistMedMatMed: string;
  medVerif: boolean;

  opTestPra : Praticien[] = [];
  opTestPhar : Pharmacie [] = [] ;
  opTestFullFull : any[] = [] ;

  matMedecin : string ='';
  matPhar : string = '';
  matPra : string = '';

  fullAll : string = '';
  acteMedicalDes : string = '';
  opActeMedical : any[] = [];
  opAgent : any[] = [];

  ExistPharmacie : Boolean ;
  ExistPharMatPhar : string  ;
  pharVerif : boolean ;

  ExistActeMed : Boolean ;
  ExistActeMedCodeActeMed : string ;
  acteMedVerif : boolean ;


  ExistAll : string = "Cette matricule n'existe pas.";
  verifAll : boolean ;
  constructor(private service : BordereauxEnvoiService ,
              private toaster : ToastrService,private serviceBS : BulletinDesoinsService,
              private cdref: ChangeDetectorRef,
              private serviceActeBS : ActeBSService,private titleService: Title,
              private servicePra : PraticienService,
              private serviceMed : MedecinService,
              private servicePhar : PharmacieService,private datePipe : DatePipe,
              private serviceActeMedical : ActemedicalService,private serviceAg:AgentService,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Bordereaux Envoi');
    this.getBorEnvoi();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  btn : boolean = false ;
  onChangeBtn() : boolean {
    this.btn = true ;
    return this.btn ;}

  be : any ;
  highlightBE(){
    if (this.selectedRowBorEnv){
      this.be = this.selectedRowBorEnv.id ;
    }
    return this.be ;
  }

  bse : any ;
  highlightBS(){
    if (this.selectedrow2){
      this.bse = this.selectedrow2.id ;
    }
    return this.bse ;
  }

  actebs : any ;
  highlightActeBS(){
    if (this.selectedActeBS){
      this.actebs = this.selectedActeBS.id ;
    }
    return this.actebs ;
  }


  public getBorEnvoi():void {
    this.service.getBordereauxEnvoiall().subscribe(
      (response : bordereauxEnvoi[]) => {
        this.dataSourceBorEnv = new MatTableDataSource<bordereauxEnvoi>(response);
        this.dataSourceBorEnv.paginator = this.paginatorBorEnv;}
      ,(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); }
    );

  }
  eqNom : boolean ;
  equalsNom(nomafter  :string , nombefore : string){
    if (nombefore != nomafter){
      return this.eqNom = false ;
    }else if (nombefore == nomafter){
      return this.eqNom = true ;
    }
    return this.eqNom ;
  }
  bord : boolean ;
  bordExpression : string;
  ExistNomBordEnv(nom : string):boolean{
    this.service.exists(nom).subscribe((response : boolean) => {
      this.bord = response ;
      if (this.bord == true){
        this.bordExpression = "Cette référence de ce bordereau d'envoi existe." ;
        return this.bord = true ;
      }else {
        this.bordExpression = "";
        return this.bord = false ;
      }
    },(error : HttpErrorResponse) => {
      this.bordExpression="";
      return this.bord = false;
    });
    return this.bord ;
  }

  eqnumBS : boolean ;
  equalsNumBS(numafter  :string , numbefore : string){
    if (numbefore != numafter){
      return this.eqnumBS = false ;
    }else if (numbefore == numafter){
      return this.eqnumBS = true ;
    }
    return this.eqnumBS ;
  }

  mu : boolean = false ;
  ExistAg(id : number) : boolean{
    this.serviceBS.ExistAg(id).subscribe(
      (response :Boolean) => {
        this.ag = response ;
        if (this.ag == true){
          this.ny="";
          this.mu = true ;
          return this.nyBS=true;
        }else {
          this.ny="Ce numéro d'affiliation n'existe pas.";
          return this.nyBS=false;
        }
      },(error : HttpErrorResponse) => {
        this.ny="Ce numéro d'affiliation n'existe pas.";
        return this.nyBS=false;
      }
    );
    return this.nyBS ;
  }

  ExistAgOpt(numaff : number) : boolean{
    this.opAgent.forEach(value => {
      if(value.matstar==numaff){
        this.ny="";
        this.mu = true ;
        return this.nyBS=true;
      }
        this.ny="Ce numéro d'affiliation n'existe pas.";
        return this.nyBS=false;
    })
    return this.nyBS ;
  }


  ExistAgBS(id : number) : boolean{
    this.serviceBS.ExistAgBS(id).subscribe(
      (response :Boolean) => {
        this.bSresp = response ;
        if (this.bSresp == true){
          this.num="Ce numéro de bulletin de soins existe.";
          return this.numBS=true;
        }else {
          return this.numBS=false;
        }
      },(error : HttpErrorResponse) => {
        return this.numBS=false;
      }
    );
    return this.numBS ;
  }

  ExistConj(value: number) {
    this.conj=false;
    this.serviceBS.FindAgNameConj(value).subscribe(
      (response:any)=>{
        //this.ag = response ;
        if(response == "" || response == null){
          this.conj = false;
        }
        else {
          this.conj = true ;
        }
      }
    )
  }



  getMedecins(){
    this.optionMedecin = [] ;
    this.serviceActeBS.getMedecins().subscribe(value1 => {
      this.setCodeMedecinPrenom(value1);
    });
  }

  getPharmacies(){
    this.optionPharmacie = [] ;
    this.serviceActeBS.getPharmacies().subscribe(value1 => {
      this.setCodePharmacie(value1);
    });
  }


  setCodePharmacie(v:Pharmacie[]){
    this.tempoptionPharmacie = [];
    v.forEach((value ) => {
      this.optionPharmacie.push(value)
    });
    return this.optionPharmacie ;
  }

  setCodeMedecinPrenom(v:MedecinModule[]){
    this.tempoptionMedecin = [];
    v.forEach((value ) => {
      this.optionMedecin.push(value)
    });
    return this.optionMedecin ;
  }


  re:boolean=false ;
  ExistEnf(id : number):boolean {
    this.re = false;
    this.serviceBS.findEnfByAg(id).subscribe(
      (response :Enfants[]) => {
        if (response.length == 0){
          this.re = false;
        }else {
          this.re = true;
        }
      });

    return this.re;
  }


  setEnfants(value: any) {
    this.optionsenf=[];
    this.tempoption=[];
    if (this.re == true) {
      this.serviceBS.findEnfByAg(value).subscribe(value1 => {
        this.setCode(value1);
      });
    }
  }


  findActeMedicalDesignation(code : string){
    this.serviceActeBS.getActeMedicalDesignation(code).subscribe((value : any) => {
      this.acteMedicalDes = value ;
    },(error : HttpErrorResponse) => { this.acteMedicalDes = '';});
  }


  getFullAll(mat : string){
    this.serviceActeBS.getFullAnything(mat).subscribe((value : any) => {
      this.fullAll = value ;
    },(error : HttpErrorResponse) => {this.fullAll = '';})
  }

  public getMedcinNomByMatriculeMed(matMed : string) {
    this.serviceActeBS.getMedNomByMatMed(matMed).subscribe((value:any) => {this.opMedFull = value;},
      (error : HttpErrorResponse) => {this.opMedFull = '';})
  }
  public getMedcinPrenomByMatriculeMed(matMed : string) {
    this.serviceActeBS.getMedPrenomByMatMed(matMed).subscribe((value:any) => {this.opMedPrenom = value;},
      (error : HttpErrorResponse) => {this.opMedPrenom = '';})
  }

  public getMedcinTypeByMatriculeMed(matMed : string) {
    this.serviceActeBS.getMedTypeByMatMed(matMed).subscribe((value:any) => {this.opMedType = value;},
      (error : HttpErrorResponse) => {this.opMedType = '';})
  }

  public getPharmacieByMatriculePhar(matPhar : string){
    this.serviceActeBS.getPharmacieByMatPhar(matPhar).subscribe((value:any) => {this.opPharNom = value;},
      (error : HttpErrorResponse) => {this.opPharNom = '';});
  }

  getPraPrenomByMatPra(matPra : string) : string{
    this.serviceActeBS.getPraticienPrenomByMatriculePraticien(matPra).subscribe((value : any) => {
      this.opPraPrenom = value ;
    },(error : HttpErrorResponse) => {this.opPraPrenom = '';});
    return this.opPraPrenom ;
  }



  exiMedBS : boolean = false ;
  ExistMed(matMed : string) : boolean{
    this.serviceActeBS.getMedExist(matMed).subscribe(
      (response :Boolean) => {
        this.Existmedecin = response ;
        if (this.Existmedecin == true){
          this.ExistMedMatMed="Cette matricule de medecin existe";
          this.exiMedBS = true ;
          return this.medVerif=true;
        }else {
          this.ExistMedMatMed="Cette matricule de medecin n'existe pas";
          this.exiMedBS = false ;
          return this.medVerif=false;
        }
      },(error : HttpErrorResponse) => {
        this.ExistMedMatMed="Cette matricule de medecin n'existe pas";
        this.exiMedBS = false ;
        return this.medVerif=false;
      }
    );
    return this.medVerif ;
  }


  exiPharBS : boolean = false ;
  ExistPhar(matPhar : string) : boolean{
    this.serviceActeBS.getPharExist(matPhar).subscribe(
      (response :Boolean) => {
        this.ExistPharmacie = response ;
        if (this.ExistPharmacie == true){
          this.ExistPharMatPhar="Cette matricule de pharmacie existe";
          this.exiPharBS = true ;
          return this.pharVerif=true;
        }else {
          this.ExistPharMatPhar="Cette matricule de pharmacie n'existe pas.";
          this.exiPharBS = false ;
          return this.pharVerif=false;
        }
      },(error : HttpErrorResponse) => {
        this.ExistPharMatPhar="Cette matricule de pharmacie n'existe pas.";
        this.exiPharBS = false ;
        return this.pharVerif=false;
      }
    );
    return this.pharVerif ;
  }


  ExistActeMedical(code : string){
    this.serviceActeBS.getActeMedicaleExist(code).subscribe(
      (response :Boolean) => {
        this.ExistActeMed = response ;
        if (this.ExistActeMed == true){
          this.ExistActeMedCodeActeMed="Ce code de l'acte médical existe.";
          return this.acteMedVerif=true;
        }else {
          this.ExistActeMedCodeActeMed="Ce code de l'acte médical n'existe pas.";
          return this.acteMedVerif=false;
        }
      },(error : HttpErrorResponse) => {
        this.ExistActeMedCodeActeMed="Ce code de l'acte médical n'existe pas.";
        return this.acteMedVerif=false;
      }
    );
  }

  setPraticien(){
    this.opTestPra = [];
    this.servicePra.getPraticienall().subscribe(value => {this.setCodePra(value)});
  }

  setMed(){
    this.opTestMed = [] ;
    this.serviceMed.getMedecinall().subscribe(value => {this.setCodeMed(value)});
  }

  setPharmacie(){
    this.opTestPhar = [] ;
    this.servicePhar.getPharmacies().subscribe(value => {this.setCodePhar(value)});
  }

  setActeMedical(){
    this.opActeMedical = [] ;
    this.serviceActeMedical.getActemedicals().subscribe(value => {this.setCodeActeMedical(value)});
  }

  setCodeActeMedical(v:Actemedical[]){
    v.forEach(value => {
      this.opActeMedical.push(value);
      this.opTestFullFull.push(value);
    });
    return this.opActeMedical ;
  }

  setAgent(){
    this.opAgent = [] ;
    this.serviceAg.getAgents().subscribe(value => {this.setCodeAgent(value)});
  }

  setCodeAgent(v:Agents[]){
    v.forEach(value => {
      this.opAgent.push(value);
    });
    return this.opAgent ;
  }

  setCodePra(v:Praticien[]){
    v.forEach(value => {
      this.opTestPra.push(value);
      this.opTestFullFull.push(value);
    });
    return this.opTestPra ;
  }

  setCodeMed(v:MedecinModule[]){
    v.forEach(value => {
      this.opTestMed.push(value);
      this.opTestFullFull.push(value);
    } );
    return this.opTestMed ;
  }

  setCodePhar(v:Pharmacie[]){
    v.forEach(value => {
      this.opTestPhar.push(value);
      this.opTestFullFull.push(value);
    });
    return this.opTestPhar ;
  }

  setCode(v:Enfants[]){
    this.tempoption=[]
    v.forEach((value, index) => {
      index++
      this.tempoption.push(('0' + index).slice(-2),value.nom,value.prenom)
      this.optionsenf.push((('0' + index).slice(-2)));
      this.options=this.optionsag.concat(this.optionsenf);
    });
  }


  setList():string[]{
    this.optionsag=[];
    this.options = [];
    if (this.conj==true && this.re==true) {
      this.optionsag = ['00','99'];
      this.options = this.optionsag.concat(this.optionsenf);
    } else if (this.conj==true && this.re==false) {
      this.optionsag = ['00','99'];
      this.options = this.optionsag.concat(this.options);
    } else if (this.conj==false && this.re==true) {
      this.optionsag = ['00'];
      this.options = this.optionsag.concat(this.optionsenf);
    } else if (this.conj==false && this.re==false) {
      this.optionsag=['00'];
      this.options = this.optionsag.concat(this.options);
    }


    return this.options;

  }

  FindDesign(code:string){
    this.serviceActeBS.findActeMedByCode(code).subscribe(
      (response: Actemedical) => {
        this.ds = response;
      },
      (error: HttpErrorResponse) => {
        this.ds = null;
      }
    );
  }





  setMontTh(form:NgForm) : number{
    this.montantTh=0.0;
    if(this.ds.mode=='Quantité'){
      this.montantTh=0;
      this.montantTh=this.ds.valeur*form.form.controls['quantiteActeBS'].value;
      let qteTot=(form.form.controls['quantiteActeBS'].value*this.ds.valeur);
      if(form.form.controls['montantActeBS'].value<qteTot){
        this.montantTh=form.form.controls['montantActeBS'].value;
        this.montantTh = Math.round(this.montantTh * 1000) /1000;
        return  this.montantTh;
      }
      else if (form.form.controls['montantActeBS'].value>qteTot){
        this.montantTh=qteTot;
        this.montantTh = Math.round(this.montantTh * 1000) /1000;
        return this.montantTh;
      }
    }
    if(this.ds.mode=='Valeur'){
      this.montantTh=0;
      form.form.controls['quantiteActeBS'].reset() ;
      if(form.form.controls['montantActeBS'].value<this.ds.valeur){
        this.montantTh=form.form.controls['montantActeBS'].value;
        this.montantTh = Math.round(this.montantTh * 1000) /1000;
        return this.montantTh;
      }
      else{
        this.montantTh=this.ds.valeur;
        this.montantTh = Math.round(this.montantTh * 1000) /1000;
        return  this.montantTh;
      }
    }
    if(this.ds.mode=='Taux'){
      this.montantTh=0;
      form.form.controls['quantiteActeBS'].reset() ;
      this.montantTh=(this.ds.valeur*form.form.controls['montantActeBS'].value)/100;
      this.montantTh = Math.round(this.montantTh * 1000) /1000;
      return  this.montantTh ;
    }
    this.montantTh = Math.round(this.montantTh * 1000) /1000 ;
    return this.montantTh ;
  }


  FindListAg(numaff:number,form:NgForm){
    this.opAgent.forEach(value => {
      if(value.matstar==numaff){
        this.agName = value.nom;
        this.agPrenom = value.prenom;
      }
    })
    this.ExistConj(numaff);
    this.ExistEnf(numaff);
    this.Cons(form,numaff);
  }


  FindAgNameBS(id : number,form:NgForm){
    this.serviceBS.FindAgName(id).subscribe(
      (response: any) => {
        this.agName = response;
        this.ExistConj(id);
        this.ExistEnf(id);
        this.Cons(form,id);
      },
      (error: HttpErrorResponse) => {
        this.agName = '';
      }
    );
  }

  Consi(numaff:number,form:NgForm){
    if (this.selectedrow2.agent.matstar == numaff){
      form.form.controls['typemalade'].reset("");
      this.agTypeMaladeNom = "" ;
      this.agTypeMaladePrenom = "" ;
      this.options = [];
    }
  }

  Cons(form:NgForm,numaff:number){
    if (this.selectedrow2) {
      if (this.selectedrow2.agent.matstar != numaff) {
        form.form.controls['typemalade'].reset("");
        this.agTypeMaladePrenom = "";
        this.agTypeMaladeNom = "";
        this.options = [];
      }

    }
    if (!this.selectedrow2){
      form.form.controls['typemalade'].reset("");
      this.agTypeMaladePrenom = "";
      this.agTypeMaladeNom = "";
      this.options = [];
    }

  }


  FindAgPrenomBS(id :number,form:NgForm){
    this.serviceBS.FindAgPrenom(id).subscribe(
      (response: any) => {
        this.agPrenom = response;
        this.ExistConj(id);
        this.ExistEnf(id);
        this.Cons(form,id);
      },
      (error: HttpErrorResponse) => {
        this.agPrenom = ''
      }
    );
  }


  fullAg : string ;
  CheckTypeMalade(typeMalade : string , id : number ){
    if (typeMalade == "00") {
      this.agTypeMaladeNom = this.agName;
      this.agTypeMaladePrenom = this.agPrenom;
    } else if (typeMalade == "99") {
      this.serviceBS.FindAgNameConj(id).subscribe(
        (response: any) => {
          this.agTypeMaladeNom = response
        },
        (error: HttpErrorResponse) => {
          this.agTypeMaladeNom = '';
        }
      );
      this.serviceBS.FindAgPrenomConj(id).subscribe(
        (response: any) => {
          this.agTypeMaladePrenom = response;
        },
        (error: HttpErrorResponse) => {
          this.agTypeMaladePrenom = '';
        }
      );
    } else {
      if (this.tempoption == undefined) {
        this.setEnfants(id)
        this.tempoption.forEach((value, index) => {
          if (typeMalade == value) {
            this.agTypeMaladeNom = this.tempoption[index + 1]
            this.agTypeMaladePrenom = this.tempoption[index + 2]
          }
        })
      } else {
        this.tempoption.forEach((value, index) => {
          if (typeMalade == value) {
            this.agTypeMaladeNom = this.tempoption[index + 1]
            this.agTypeMaladePrenom = this.tempoption[index + 2]
          }
        })

      }
    }



  }




  len : any[] = [] ;
  getBS(id : number){
    this.len = [] ;
    this.serviceBS.getBulletinSoin(id).subscribe(
      (response : Bulletinsoin[]) => {
        this.dataSourceBSparBorEnv = new MatTableDataSource(response);
        this.len = response ;
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );
  }

  onRowClicked(row: any,bsForm : NgForm , acteForm : NgForm){
    this.selectedRowBorEnv = row ;
    this.getBS(this.selectedRowBorEnv.id);
    this.ExistNomBordEnv(this.selectedRowBorEnv.nom);
    this.equalsNom(this.selectedRowBorEnv.nom , this.selectedRowBorEnv.nom);
    window.scrollTo(0,500);
    this.getBordV();
    this.cancelClickBS(bsForm,acteForm);

    this.setAgent()
  }


  onRowClicked2(row :any,form :NgForm){
    this.selectedrow2 = row;
    this.getActeBS(this.selectedrow2.id);
    //this.onRowClicked(row);
    this.FindAgNameBS(this.selectedrow2.agent.matstar,form);
    this.FindAgPrenomBS(this.selectedrow2.agent.matstar,form);
    this.FindListAg(this.selectedrow2.agent.matstar,form);
    this.ExistAg(this.selectedrow2.agent.matstar);
    this.ExistConj(this.selectedrow2.agent.matstar);
    setTimeout(()=>{
      if (this.re==true){
        this.setEnfants(this.selectedrow2.agent.matstar);
      }
    },200)
    setTimeout(()=>{
      this.setList();
    },300)
    window.scrollTo(0,800);
    setTimeout(()=>{
      this.CheckTypeMalade(this.selectedrow2.typemalade , this.selectedrow2.agent.matstar);
    },400);

    this.ExistAgBS(this.selectedrow2.numbs);
    this.equalsNumBS(this.selectedrow2.numbs,this.selectedrow2.numbs);
    this.ExistAg(this.selectedrow2.agent.matstar);
    this.setMed();
    this.setPharmacie();
    this.setPraticien();
    this.setActeMedical();
    this.getBullSoinsByAgentAff();
    this.checkAff();
    this.getBull();
    this.cancelClickActBS(form);
    this.numBS = null ;
    this.nyBS = null ;
    this.mu = false ;
    this.ds=null;
  }

  act : Actemedical ;
  FindActeinSelectwithSetMont() : number{
    this.montantTh = 0.0 ;
    this.serviceActeBS.findActeMedByCode(this.selectedActeBS.acteMedical.code).subscribe(
      (response: Actemedical) => {
        this.act = response;
        if(this.act.mode=='Quantité'){
          this.montantTh=0;
          this.montantTh=this.act.valeur*this.selectedActeBS.quantiteActeBS;
          let qteTot=(this.selectedActeBS.quantiteActeBS*this.act.valeur);
          if(this.selectedActeBS.montantActeBS<qteTot){
            this.montantTh=this.selectedActeBS.montantActeBS;
            this.montantTh = Math.round(this.montantTh * 1000) /1000 ;
            return  this.montantTh;
          }
          else if (this.selectedActeBS.montantActeBS>qteTot){
            this.montantTh=qteTot;
            this.montantTh = Math.round(this.montantTh * 1000) /1000 ;
            return this.montantTh;
          }
        }
        if(this.act.mode=='Valeur'){
          this.montantTh=0;
          if(this.selectedActeBS.montantActeBS<this.act.valeur){
            this.montantTh=this.selectedActeBS.montantActeBS;
            this.montantTh = Math.round(this.montantTh * 1000) /1000 ;
            return this.montantTh;
          }
          else{
            this.montantTh=this.ds.valeur;
            this.montantTh = Math.round(this.montantTh * 1000) /1000 ;
            return  this.montantTh;
          }
        }
        if(this.act.mode=='Taux'){
          this.montantTh=0;
          this.montantTh=(this.act.valeur*this.selectedActeBS.montantActeBS)/100;
          this.montantTh = Math.round(this.montantTh * 1000) /1000 ;
          return  this.montantTh;
        }
        this.montantTh = Math.round(this.montantTh * 1000) /1000 ;
        return this.montantTh ;
      }
    );
    this.montantTh = Math.round(this.montantTh * 1000) /1000 ;
    return this.montantTh ;
  }


  onRowClicked3(row2 : any){
    this.selectedActeBS = row2;
    window.scrollTo(0,1750);
    if (this.selectedActeBS.medecin != null && this.selectedActeBS.matPraticienActeBS == null && this.selectedActeBS.pharmacie == null && this.selectedActeBS.praticien == null){
      this.getMedcinNomByMatriculeMed(this.selectedActeBS.medecin.matriculeMedecin);
      this.getMedcinPrenomByMatriculeMed(this.selectedActeBS.medecin.matriculeMedecin);
      this.getMedcinTypeByMatriculeMed(this.selectedActeBS.medecin.matriculeMedecin);
      this.fullAll = "" ;
      setTimeout(()=>{ this.ExistPharInActeBS(this.selectedActeBS.medecin.matriculeMedecin);},1000);
      this.ExistMed(this.selectedActeBS.medecin.matriculeMedecin);
    }
    if (this.selectedActeBS.pharmacie != null && this.selectedActeBS.matPraticienActeBS == null && this.selectedActeBS.medecin == null && this.selectedActeBS.praticien == null){
      this.getPharmacieByMatriculePhar(this.selectedActeBS.pharmacie.matriculePharmacie);
      this.fullAll = "" ;
      setTimeout(()=>{this.ExistPharInActeBS(this.selectedActeBS.pharmacie.matriculePharmacie);},1000);
      this.ExistPhar(this.selectedActeBS.pharmacie.matriculePharmacie);
    }
    if ((this.selectedActeBS.pharmacie != null || this.selectedActeBS.medecin != null || this.selectedActeBS.praticien != null) && this.selectedActeBS.matPraticienActeBS != null) {
      this.getFullAll(this.selectedActeBS.matPraticienActeBS);
      setTimeout(() => {
        this.ExistPharInActeBS(this.selectedActeBS.matPraticienActeBS);
      }, 1000);
    }
    this.FindDesign(this.selectedActeBS.acteMedical.code);
    this.FindActeinSelectwithSetMont();
    this.ExistActeMedical(this.selectedActeBS.acteMedical.code);
    this.selectMed();
    this.selectPhar();
  }

  validateDatesBS(BsDate: Date,eDate:Date){
    this.isValidDateBS = true;
    if((BsDate == null) && (eDate == null)){
      this.error={isError:true,errorMessage:'BStart date and end date are required.'};
      this.isValidDateBS = false;
    }

    if((BsDate != null && eDate != null) && (eDate < BsDate)){
      this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDateBS = false;
    }
    return this.isValidDateBS;
  }

  isValidDateBSS : boolean ;
  validateDatesBSStart(BsDate: Date,eDate:Date){
    this.isValidDateBSS = true;
    if((BsDate == null) && (eDate == null)){
      this.error={isError:true,errorMessage:'BStart date and end date are required.'};
      this.isValidDateBSS = false;
    }

    if((BsDate != null && eDate != null) && (eDate > BsDate)){
      this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDateBSS = false;
    }
    return this.isValidDateBSS;
  }


  isValidDateActeBS : boolean ;
  validateDatesActeBS(BsDate: Date,eDate:Date){
    this.isValidDateActeBS = true;
    if((BsDate == null) && (eDate == null)){
      this.error={isError:true,errorMessage:'BStart date and end date are required.'};
      this.isValidDateActeBS = false;
    }

    if((BsDate != null && eDate != null) && (eDate < BsDate)){
      this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDateActeBS = false;
    }
    return this.isValidDateActeBS;
  }

  isValidDateActeBSS : boolean ;
  validateDatesActeBSStart(BsDate: Date,eDate:Date){
    this.isValidDateActeBSS = true;
    if((BsDate == null) && (eDate == null)){
      this.error={isError:true,errorMessage:'BStart date and end date are required.'};
      this.isValidDateActeBSS = false;
    }

    if((BsDate != null && eDate != null) && (eDate > BsDate)){
      this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDateActeBSS = false;
    }
    return this.isValidDateActeBSS;
  }

  isValidDateActeBSBull : boolean ;
  validateDatesActeBSwithBullStart(BsDate: Date,eDate:Date){
    this.isValidDateActeBSBull = true;
    if((BsDate == null) && (eDate == null)){
      this.error={isError:true,errorMessage:'BStart date and end date are required.'};
      this.isValidDateActeBSBull = false;
    }

    if((BsDate != null && eDate != null) && (eDate > BsDate)){
      this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDateActeBSBull = false;
    }
    return this.isValidDateActeBSBull;
  }



  onaddBS(BSForm : NgForm ,idBorEnv : number, numaff : number,ActeBSForm : NgForm):void{
    this.serviceBS.addBulletinDeSoins(BSForm.value ,idBorEnv, numaff).subscribe(
      (response : bordereauxEnvoi) => {
        this.getBS(this.selectedRowBorEnv.id);
        this.cancelClickBS(BSForm,ActeBSForm);
        this.toaster.success("Ajout d'un bulletin de soins avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );
  }


  onaddActeBSMed(ActeBS : NgForm ,idBull : number, code : string , matMed : string , AgentForm : NgForm,BSForm:NgForm ):void{
    this.serviceActeBS.ajouterMedecinForActeBS(ActeBS.value ,idBull , code, matMed).subscribe(
      (response : Bulletinsoin) => {
        this.getActeBS(this.selectedrow2.id);
        this.cancelClickActBS(ActeBS);
        this.getBullSoinsByAgentAff();
        this.getBull();
        this.toaster.success("Ajout d'un acte de bulletin de soins avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );
    setTimeout(() =>{
      this.onupdateBSForSomme(BSForm);
    },2000);

    setTimeout(() => {
      this.onupdateAgent(AgentForm);
    },2000);

  }

  onaddActeBSPhar(ActeBS : NgForm,idBull : number, code : string, matPhar : string , AgentForm :NgForm,BSForm:NgForm):void{
    this.serviceActeBS.ajouterPharmacieForActeBS(ActeBS.value , idBull , code , matPhar).subscribe(
      (response : Bulletinsoin) => {
        this.getActeBS(this.selectedrow2.id);
        this.cancelClickActBS(ActeBS);
        this.getBullSoinsByAgentAff();
        this.getBull();
        this.toaster.success("Ajout d'un acte de bulletin de soins avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );

    setTimeout(() =>{
      this.onupdateBSForSomme(BSForm);
    },2000);

    setTimeout(() => {
      this.onupdateAgent(AgentForm);
    },2000);

  }



  onaddActeBSPra(ActeBS : NgForm ,idBull : number , code : string , matPra : string , AgentForm : NgForm,BSForm:NgForm):void{
    this.serviceActeBS.ajouterPraticienForActeBS(ActeBS.value ,idBull, code , matPra).subscribe(
      (response : Bulletinsoin) => {
        this.getActeBS(this.selectedrow2.id);
        this.cancelClickActBS(ActeBS);
        this.getBullSoinsByAgentAff();
        this.getBull();
        this.toaster.success("Ajout d'un acte de bulletin de soins avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );

    setTimeout(() =>{
      this.onupdateBSForSomme(BSForm);
    },2000);

    setTimeout(() => {
      this.onupdateAgent(AgentForm);
    },2000);

  }

  onupdateActeBSMed(ActeBS : NgForm ,idBull : number ,idActeBS:number, code : string , matMed : string , AgentForm : NgForm,BSForm:NgForm):void{
    this.serviceActeBS.updateMedecinForActeBS(ActeBS.value ,idBull,idActeBS, code , matMed).subscribe(
      (response : ActeBS) => {
        this.getActeBS(this.selectedrow2.id);
        this.cancelClickActBS(ActeBS);
        this.getBullSoinsByAgentAff();
        this.getBull();
        this.toaster.success("Modification d'un acte de bulletin de soins avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );

    setTimeout(() =>{
      this.onupdateBSForSomme(BSForm);
    },2000);
    setTimeout(() => {
      this.onupdateAgent(AgentForm);
    },2000);

  }
  onupdateActeBSPhar(ActeBS : NgForm ,idBull : number ,idActeBS:number, code : string , matPhar : string , AgentForm : NgForm,BSForm : NgForm):void{
    this.serviceActeBS.updatePharmacieForActeBS(ActeBS.value ,idBull,idActeBS, code , matPhar).subscribe(
      (response : ActeBS) => {
        this.getActeBS(this.selectedrow2.id);
        this.cancelClickActBS(ActeBS);
        this.getBullSoinsByAgentAff();
        this.getBull();
        this.toaster.success("Modification d'un acte de bulletin de soins avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );

    setTimeout(() =>{
      this.onupdateBSForSomme(BSForm);
    },2000);

    setTimeout(() => {
      this.onupdateAgent(AgentForm);
    },2000);

  }
  onupdateActeBSPra(ActeBS : NgForm ,idBull : number ,idActeBS:number, code : string , matPra : string , AgentForm:NgForm , BSForm:NgForm):void{
    this.serviceActeBS.updatePraticienForActeBS(ActeBS.value ,idBull,idActeBS, code , matPra).subscribe(
      (response : ActeBS) => {
        this.getActeBS(this.selectedrow2.id);
        this.cancelClickActBS(ActeBS);
        this.getBullSoinsByAgentAff();
        this.getBull();
        this.toaster.success("Modification d'un acte de bulletin de soins avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );

    setTimeout(() =>{
      this.onupdateBSForSomme(BSForm);
    },2000);

    setTimeout(() => {
      this.onupdateAgent(AgentForm);
    },2000);

  }

  onupdateBS(BSForm : NgForm , idBord , idAg :number , idBS : number,BSFormForSomme:NgForm , ActeBSForm : NgForm){
    if (this.disabledActeAff.length == 0){
      this.serviceBS.updateBulletinSoins(BSForm.value, idBord, idAg, idBS)
        .subscribe(data => {
          this.getBS(this.selectedRowBorEnv.id);
          this.cancelClickBS(BSForm, ActeBSForm);
          //this.getBull();
          this.toaster.success("Modification d'un bulletin de soins avec succès.", "SUCCES", {positionClass: 'toast-bottom-right'});
        }, error => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
        });
    }

    if(this.disabledActeAff.length != 0) {
      this.serviceBS.updateBulletinSoins(BSForm.value, idBord, idAg, idBS)
        .subscribe(data => {
          this.onupdateBSForSomme(BSFormForSomme);
          this.getBS(this.selectedRowBorEnv.id);
          this.cancelClickBS(BSForm, ActeBSForm);
          this.toaster.success("Modification d'un bulletin de soins avec succès.", "SUCCES", {positionClass: 'toast-bottom-right'});
        }, error => {
          this.toaster.error("svp entrer une valide proposition", "ERREUR", {positionClass: 'toast-bottom-right'});
        });

      setTimeout(() => {
        this.somMontRes = 0.0;
        this.somMontParBull = 0.0;
        this.somMontPhar = 0.0;
        this.somMontMed = 0.0;
        this.somMontPrati = 0.0;
      }, 500);
    }



  }

  onupdateBSForSomme(BSForm : NgForm){
    this.serviceBS.updateBulletinSoins(BSForm.value,this.selectedRowBorEnv.id,this.selectedrow2.agent.matstar,this.selectedrow2.id)
      .subscribe(data => {
        this.getBS(this.selectedRowBorEnv.id);
        this.getBordV();
      });
  }


  onDeleteBS(id : number,BSForm:NgForm,ActeBSForm : NgForm):void{
    if(this.disabledActeAff.length == 0) {
      this.serviceBS.DeleteBSWithId(id).subscribe(
        (response: void) => {
          this.getBS(this.selectedrow2.id);
          this.cancelClickBS(BSForm,ActeBSForm);
          //this.getBull();
          this.toaster.success("Suppression d'un bulletin de soins avec succès.", "SUCCES",
            {positionClass: 'toast-bottom-right'});
        },
        (error: HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
        }
      );
    }else {
      this.toaster.error("Il ya encore des actes dans le bulletin.","Error",
        {positionClass:'toast-bottom-right'});
    }
  }


  onDeleteActeBS(id : number,addForm:NgForm , AgentForm:NgForm , BSForm :NgForm):void{
    this.serviceActeBS.DeleteActeBS(id).subscribe(
      (response : void) => {
        this.getActeBS(this.selectedrow2.id);
        this.cancelClickActBS(addForm);
        this.getBullSoinsByAgentAff();
        this.getBull();
        this.toaster.success("Suppression d'un bulletin de soins avec succès.","SUCCES",
          {positionClass:'toast-bottom-right'});
      },
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}

    );

    setTimeout(() =>{
      this.onupdateBSForSomme(BSForm);
    },2000);

    setTimeout(() => {
      this.onupdateAgent(AgentForm);
    },2000);

  }

  onaddBorEnv(addForm : NgForm,BSForm:NgForm):void{
    this.service.addBordereauxEnvoi(addForm.value).subscribe(
      (response : bordereauxEnvoi) => {this.getBorEnvoi();this.cancelClick(addForm,BSForm);
        window.scrollTo(0,0)
        this.toaster.success("Ajout d'un bordereau d'envoi avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );
  }

  onupdateBorEnv(addForm : NgForm,BSForm:NgForm){
    this.service.updateBordereauxEnvoi(addForm.value,this.selectedRowBorEnv.id)
      .subscribe(data => {
        this.getBorEnvoi();
        this.cancelClick(addForm,BSForm);
        window.scrollTo(0,0);
        this.toaster.success("Modification d'un bordereau d'envoi avec succès.","SUCCES",{positionClass:'toast-bottom-right'});
      }, error => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});})

  }

  onDeleteBorEnv(id : number,addForm:NgForm,BSForm:NgForm):void{
    if(this.len.length == 0){
      this.service.deleteBordereauxEnvoi(id).subscribe(
        (response : void) => {
          this.getBorEnvoi();
          this.cancelClick(addForm,BSForm);
          window.scrollTo(0,0);
          this.toaster.success("Suppression d'un bordereau d'envoi avec succès.","SUCCES",
            {positionClass:'toast-bottom-right'});
        },
        (error : HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
      );
    }else {
      this.toaster.error("Il ya encore des bulletin de soins dans le bordereau.","Error",
        {positionClass:'toast-bottom-right'});
    }
  }

  validateDates(sDate: Date, eDate: Date){
    this.isValidDate = true;
    if((sDate == null || eDate ==null)){
      this.error={isError:true,errorMessage:'Start date and end date are required.'};
      this.isValidDate = false;
    }

    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      this.error={isError:true,errorMessage:'End date should be grater then start date.'};
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

  verificationBS : boolean ;
  verificationActeBS : boolean ;
  validateDateWithBordAndBS(dateBordStart : Date) : boolean {
    this.verificationBS = true ;
    this.selectedRowBorEnv.bulletinSoinList.forEach(value => {
      if (dateBordStart > value.datebs){
        this.verificationBS = false ;
      }
    });
    return this.verificationBS ;
  }

  validationDateStartBordWithActeBS(dateStart : Date) : boolean {
    this.verificationActeBS = true ;
    this.selectedRowBorEnv.bulletinSoinList.forEach(value => {
      value.acteBS.forEach(value => {
        if (dateStart > value.dateActeBS){
          this.verificationActeBS = false ;
        }
      });
    });
    return this.verificationActeBS ;
  }

  verifEnd : boolean ;
  verifEndActeBS : boolean ;
  validationDateEndBordWithBS(dateEnd : Date) : boolean {
    this.verifEnd = true ;
    this.selectedRowBorEnv.bulletinSoinList.forEach(value => {
      if (dateEnd < value.datebs){
        this.verifEnd = false ;
      }
    });
    return this.verifEnd ;
  }

  validationDateEndBordWithActeBS(dateEnd : Date) : boolean {
    this.verifEndActeBS = true ;
    this.selectedRowBorEnv.bulletinSoinList.forEach(value => {
      value.acteBS.forEach(value => {
        if (dateEnd < value.dateActeBS){
          this.verifEndActeBS = false ;
        }
      });
    });
    return this.verifEndActeBS ;
  }




  cancelClickActBS(BSForm : NgForm){
    BSForm.reset(BSForm) ;
    this.selectedActeBS = null;
    this.opMedFull="";
    this.opMedPrenom="";
    this.opMedType="";
    this.fullAll="";
    this.ExistAll="";
    this.opPharNom="";
    this.ExistActeMedCodeActeMed="";
    this.acteMedicalDes="";
    this.ExistMedMatMed="";
    this.ExistPharMatPhar="";
    this.ds = null;

    this.acteMedVerif = null ;
    this.ExistActeMedCodeActeMed = "" ;
    this.medVerif = null ;
    this.ExistMedMatMed = null ;
    this.exiMedBS = false ;
    this.exiPharBS = false ;
    this.pharVerif = null ;
    this.ExistPharMatPhar = "";
    this.ExistAll = "" ;

    this.isValidDateActeBS = null ;
    this.isValidDateActeBSS = null ;
    this.isValidDateActeBSBull = null ;
    this.montantTh=0.0;
    this.actebs = null ;

    window.scrollTo(0,1050);
    this.pharmacirInActeBS = null ;
    this.phPra = false ;
    setTimeout(()=>{ BSForm.form.controls['montantTheoriqueActeBS'].setValue(0.0);},100);
    setTimeout(()=>{ BSForm.form.controls['montantActeBS'].setValue(0.0);},100);
  }

  cancelClickBS(BSForm : NgForm,ActeBSForm : NgForm){
    BSForm.reset(BSForm);
    this.dataSourceActeBS = null ;
    this.cancelClickActBS(ActeBSForm);
    this.ny = "";
    this.agName= "";
    this.agPrenom = "" ;
    this.agTypeMaladeNom = "" ;
    this.agTypeMaladePrenom ="";
    this.selectedrow2 = null;
    this.somMontParBull = 0.0 ;
    this.somMontMed = 0.0 ;
    this.somMontRes = 0.0 ;
    this.somMontPrati = 0.0 ;
    this.somMontPhar = 0.0 ;
    this.sommeBull = 0.0 ;
    this.sommePhar = 0.0 ;
    this.sommeRes = 0.0 ;
    this.numBS = null ;
    this.nyBS = null ;
    this.mu = false ;
    this.isValidDateBS = null ;
    this.isValidDateBSS = null ;
    this.eqnumBS = null ;
    window.scrollTo(0,500)
    this.bse = null ;
    this.alo = false ;
  }

  cancelClick(addForm : NgForm,BSForm:NgForm){
    addForm.reset(addForm);
    this.dataSourceBSparBorEnv = null ;
    this.cancelClickBS(addForm,BSForm);
    this.ny = "";
    this.agName= "";
    this.agPrenom = "" ;
    this.agTypeMaladeNom = "" ;
    this.agTypeMaladePrenom ="";
    this.selectedRowBorEnv = null ;
    this.isValidDate = null ;
    this.verificationBS = null ;
    this.verificationActeBS = null ;
    this.verifEnd = null ;
    this.verifEndActeBS = null ;
    this.eqNom = null ;
    this.be = null ;
    window.scrollTo(0,0)
  }

  findBorEnvByName(name : HTMLInputElement){
    this.applyfilter(name.value);
  }

  applyfilter (filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceBorEnv.filter = filterValue ;

  }

  findBSByPren(prenom : HTMLInputElement){
    this.applyfilterBS(prenom.value)
  }
  applyfilterBS (filterValueBS : string){
    filterValueBS = filterValueBS.trim();
    filterValueBS = filterValueBS.toLowerCase();
    this.dataSourceBSparBorEnv.filter = filterValueBS;
  }

  som : number = 0.0 ;
  th : bordereauxEnvoi;
  getBull() {
    this.serviceBS.findBullParId(this.selectedrow2.id).subscribe(response => {
      this.SomMontTotParBull(response);
      this.SomMontPhar(response);
      this.SomMontPrati(response);
      this.SomMontMed(response);
      this.SomMontResTot();
    });
  }
  somMontRes : number = 0.0 ;
  SomMontResTot() : number{
    this.somMontRes = 0.0;
    this.somMontRes = Math.abs(this.somMontParBull - this.somMontPhar);
    this.somMontRes = Math.round(this.somMontRes * 1000) / 1000 ;
    return this.somMontRes ;
  }


  somMontParBull : number = 0.0 ;
  SomMontTotParBull(v:Bulletinsoin) : number{
    this.somMontParBull = 0.0;
    v.acteBS.forEach(value => {
      this.somMontParBull += value.montantActeBS ;
    });
    this.somMontParBull = Math.round(this.somMontParBull * 1000) / 1000 ;
    return this.somMontParBull ;
  }
  somMontMed : number = 0.0 ;
  SomMontMed(v:Bulletinsoin) : number {
    this.somMontMed = 0.0 ;
    v.acteBS.forEach(value => {
      if (value.medecin != null && value.matPraticienActeBS == null){
        this.somMontMed += value.montantActeBS ;
      }else {
        this.somMontMed ;
      }
    });
    this.somMontMed = Math.round(this.somMontMed * 1000) / 1000 ;
    return this.somMontMed ;
  }

  somMontPhar : number = 0.0 ;
  SomMontPhar(v : Bulletinsoin) : number{
    this.somMontPhar = 0.0 ;
    v.acteBS.forEach(value => {
      if (value.pharmacie != null && value.matPraticienActeBS == null){
        this.somMontPhar += value.montantActeBS ;
      }else {
        this.somMontPhar ;
      }
    });
    this.somMontPhar = Math.round(this.somMontPhar * 1000) / 1000 ;
    return this.somMontPhar ;
  }

  somMontPrati : number = 0.0 ;
  SomMontPrati(v:Bulletinsoin) : number {
    this.somMontPrati = 0.0 ;
    v.acteBS.forEach(value => {
      if (value.matPraticienActeBS != null){
        this.somMontPrati += value.montantActeBS ;
      }else {
        this.somMontPrati ;
      }
    });
    this.somMontPrati = Math.round(this.somMontPrati * 1000) / 1000 ;
    return this.somMontPrati ;
  }

  getBordV(){
    this.service.getBordereauxEnvoibyid2(this.selectedRowBorEnv.id).subscribe(reponse => {
      this.sommeDesBullTot(reponse);
      this.sommeDesMedTot(reponse);
      this.sommeDesPharTot(reponse);
      this.sommeDesPratiTot(reponse);
      this.sommeDesResTot(reponse);
    });
  }
  sommeDesBull : number = 0.0 ;
  sommeDesMed : number = 0.0 ;
  sommeDesPhar : number = 0.0 ;
  sommeDesPrati : number = 0.0 ;
  sommeDesRes : number = 0.0 ;
  sommeDesBullTot(v:bordereauxEnvoi) : number{
    this.sommeDesBull = 0.0 ;
    v.bulletinSoinList.forEach(value => {
      this.sommeDesBull += value.sommeTotBull ;
    });
    this.sommeDesBull = Math.round(this.sommeDesBull * 1000) / 1000 ;
    return this.sommeDesBull ;
  }

  sommeDesResTot(v:bordereauxEnvoi) : number{
    this.sommeDesRes = 0.0 ;
    v.bulletinSoinList.forEach(value => {
      this.sommeDesRes += value.sommeTotRestant ;
    });
    this.sommeDesRes = Math.round(this.sommeDesRes * 1000) / 1000 ;
    return this.sommeDesRes ;
  }

  sommeDesPharTot(v:bordereauxEnvoi) : number{
    this.sommeDesPhar = 0.0 ;
    v.bulletinSoinList.forEach(value => {
      this.sommeDesPhar += value.sommeTotPhar ;
    });
    this.sommeDesPhar = Math.round(this.sommeDesPhar * 1000) / 1000 ;
    return this.sommeDesPhar ;
  }

  sommeDesMedTot(v:bordereauxEnvoi) : number {
    this.sommeDesMed = 0.0 ;
    v.bulletinSoinList.forEach(value => {
      this.sommeDesMed += value.sommeTotMed ;
    });
    this.sommeDesMed = Math.round(this.sommeDesMed * 1000) / 1000 ;
    return this.sommeDesMed ;
  }

  sommeDesPratiTot(v:bordereauxEnvoi) : number {
    this.sommeDesPrati = 0.0 ;
    v.bulletinSoinList.forEach(value => {
      this.sommeDesPrati += value.sommeTotPrati ;
    });
    return this.sommeDesPrati ;
  }



  displayedColumnsPrintBS:string[] = ['N°: B.S','MATR','CD','EMPLOYÉ(E)','MONT MED','MONT PHAR',
    'MONT PRA' ,'MONT TOT' ,'DATE SOINS'];
  displayBSBS : string[] = ['Montant Des Frais Bulletin de Soins En Dinart DT'];
  pdfGenerateBorEnv(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png' ;
    var data = [];
    this.dataSourceBSparBorEnv.data.forEach(res =>{
      data.push([[res.numbs],[res.agent.matstar],[res.typemalade],[(res.agent.nom).concat(' ').concat(res.agent.prenom)]
        ,[res.sommeTotMed],[res.sommeTotPhar],[res.sommeTotPrati],[res.sommeTotBull],[res.datebs]]);
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Montant des frais est en DT', 14, 176);
    // doc.setFontSize(11);
    doc.setFontSize(16);
    doc.text("Bordereau d'envoi", 83, 70);
    doc.text('Référence : ', 75, 80);
    doc.text(this.selectedRowBorEnv.nom, 106, 80);
    doc.text("Durée du bordereau d'envoi : du " + this.selectedRowBorEnv.dateDebut + " jusqu'à " +
      this.selectedRowBorEnv.dateFin, 23,90);
    doc.setLineWidth(0.5);
    doc.rect(15, 55, 180, 48);
    doc.rect(15, 110, 180, 48);
    doc.text("Liste des bulletins de soins", 70, 170);
    doc.setFontSize(11);
    doc.text("Bulletins de soins par bordereau d'envoi", 70, 118);
    doc.text('Total des bulletins de soins : ' + this.selectedRowBorEnv.bulletinSoinList.length, 80, 130);
    doc.text('Total des sommes des bulletins de soins : ' + this.sommeDesBull + ' DT', 63, 135);
    doc.text('Total des sommes des frais des médecins : ' + this.sommeDesMed + ' DT', 63, 140);
    doc.text('Total des sommes des frais des pharmacies : ' + this.sommeDesPhar + ' DT', 63, 145);
    doc.text('Total des Sommes des frais des praticiens : ' + this.sommeDesPrati + ' DT', 63, 150);



    autoTable(doc,{
      head : [this.displayedColumnsPrintBS],
      body: data,
      theme: 'striped',
      headStyles :{
        cellPadding: 2,
        fontSize: 8,
        cellWidth : "wrap"
      },
      tableWidth: 'auto',
      startY: 177,
      didDrawCell: data => {
      }
    })

    const pageCount = doc.getNumberOfPages();
    for (var i=1 ; i<=pageCount;i++){
      //let PageCurrent = doc.getPageInfo(i).pageNumber;
      doc.setPage(i);
      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 0, 0);
      doc.line(14, 284, 200, 284);
      doc.text('Page ' + String(i) + ' sur ' + String(pageCount) , 210-32,297-8,null,null);
      doc.text("Date d'impression : " + this.datePipe.transform(new Date(),'yyyy-MM-dd , HH:mm:ss'),20-5,297-8,null,null);

    }

    doc.setTextColor(100);


    // below line for Open PDF document in new tab
    doc.output('dataurlnewwindow')

    // below line for Download PDF document
    doc.save('BordereauxEnvoi.pdf');
  }




  setCodeMalade(value:any) {
    let res;
    if(value=='99'){
      res=true
    }
    else if(value=='00'){
      res=false;
    }
    return res
  }
  disabledActeAff : any[]  = [];
  getActeBS(id:number){
    this.disabledActeAff = [] ;
    this.serviceActeBS.getActeBullSoin(id).subscribe(
      (response : ActeBS[]) => {
        this.dataSourceActeBS = new MatTableDataSource(response);
        this.disabledActeAff = response ;
      },(error :HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }




  applyfilterActeBS (filterValueActeBS : string){
    filterValueActeBS = filterValueActeBS.trim();
    filterValueActeBS = filterValueActeBS.toLowerCase();
    this.dataSourceActeBS.filter = filterValueActeBS;
  }

  findActeBSByFull(full : HTMLInputElement){
    this.applyfilterActeBS(full.value);
  }

  response : Pharmacie ;
  pharmacirInActeBS : boolean = null ;
  phPra : boolean = false ;
  ExistPharInActeBS(matPhar : string) {
    this.pharmacirInActeBS = null;
    this.phPra = false ;
    this.serviceActeBS.findPharInActeBS(matPhar).subscribe(
      (response : Pharmacie) => {
        this.response = response ;
          if (this.response != null) {
            this.phPra = true;
            if (response.isconventioned == true) {
              this.pharmacirInActeBS = true;
            } else {
              this.pharmacirInActeBS = false;
            }
          } else if (this.response == null) {
            this.phPra = false;
          }
      }
    );
  }





  getBullSoinsByAgentAff(){
    this.serviceBS.findBullByAgAff(this.selectedrow2.agent.matstar).subscribe(response => {
      this.SommeBullSoin(response);
      this.SommePharmacie(response);
      this.SommeRestant() ;
    });
  }

  sommeBull : number = 0.00;
  sommePhar : number = 0.00;
  sommeRes : number = 0.00 ;

  SommeRestant() : number {
    this.sommeRes = 0.0 ;
    this.sommeRes = Math.abs(this.sommeBull - this.sommePhar) ;
    this.sommeRes = Math.round(this.sommeRes * 1000) / 1000
    return this.sommeRes ;
  }

  SommeBullSoin(v:Bulletinsoin[]) : number {
    this.sommeBull = 0 ;
    v.forEach(value => {
      value.acteBS.forEach(value1 => {
        if(new Date().getFullYear() == new Date(value1.dateActeBS).getFullYear()){
          this.sommeBull += value1.montantTheoriqueActeBS;
          this.sommeBull = Math.round(this.sommeBull * 1000) / 1000 ;
        }
      });
    });
    return this.sommeBull  ;
  }

  alertPlafond : number ;
  alo : boolean = false ;
  SommePharmacie(v:Bulletinsoin[]) : number {
    this.sommePhar = 0 ;
    this.alo = false ;
    v.forEach(value => {
      value.acteBS.forEach(value1 => {
        if((value1.pharmacie != null && value1.matPraticienActeBS == null) && (new Date().getFullYear() == new Date(value1.dateActeBS).getFullYear())) {
          this.sommePhar += value1.montantTheoriqueActeBS;
          this.sommePhar = Math.round(this.sommePhar * 1000) / 1000 ;
          this.alertPlafond = value1.acteMedical.plafond ;
        }else {
          this.sommePhar ;
          this.sommePhar = Math.round(this.sommePhar * 1000) / 1000 ;
        }
      });
    });
    if (this.sommePhar > this.alertPlafond){
      this.alo = true ;
    }
    else if (this.sommePhar <= this.alertPlafond){
      this.alo = false ;
    }
    return this.sommePhar;
  }

  onupdateAgent(addForm : NgForm) : void{
    this.serviceBS.updateAgentByMatStar(this.selectedrow2.agent.matstar,addForm.value)
      .subscribe(data => {
        this.toaster.success("modification d'un Agent avec succès","SUCCES",{positionClass:'toast-bottom-right'});
      }, error => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});});

  }




  disableQueMont(form : NgForm){
    setTimeout(()=>{
      form.form.controls['quantiteActeBS'].reset();
      form.form.controls['montantActeBS'].setValue(0.0);
      form.form.controls['montantTheoriqueActeBS'].setValue(0.0);

    },20);
  }



  checkAff() : boolean{
    if (this.selectedrow2){
      if (this.disabledActeAff.length != 0){
        return this.verifAll = true ;
      }else {
        return this.verifAll = false ;
      }
    }
    return this.verifAll ;
  }

  medi:string ;
  selectMed():string{
    this.medi = null ;
    if (this.selectedActeBS){
      if ((this.selectedActeBS.matPraticienActeBS == null || this.selectedActeBS.matPraticienActeBS == "") &&
        (this.selectedActeBS.medecin != null && this.selectedActeBS.medecin != "") &&
        (this.selectedActeBS.pharmacie == null || this.selectedActeBS.pharmacie == "") &&
        (this.selectedActeBS.praticien == null || this.selectedActeBS.praticien == "")){
        this.medi = this.selectedActeBS.medecin.matriculeMedecin ;
      }else if ((this.selectedActeBS.matPraticienActeBS != null && this.selectedActeBS.matPraticienActeBS != "")
        && (this.selectedActeBS.medecin != null && this.selectedActeBS.medecin != "") &&
        (this.selectedActeBS.pharmacie == null || this.selectedActeBS.pharmacie == "") &&
        (this.selectedActeBS.praticien == null || this.selectedActeBS.praticien == "")){
        this.medi = null ;
      }
    }
    return this.medi ;
  }

  phari:string ;
  selectPhar():string{
    this.phari = null ;
    if (this.selectedActeBS){
      if ((this.selectedActeBS.matPraticienActeBS == null || this.selectedActeBS.matPraticienActeBS == "") &&
        (this.selectedActeBS.pharmacie != null && this.selectedActeBS.pharmacie != "") &&
        (this.selectedActeBS.medecin == null || this.selectedActeBS.medecin == "") &&
        (this.selectedActeBS.praticien == null || this.selectedActeBS.praticien == "")){
        this.phari = this.selectedActeBS.pharmacie.matriculePharmacie;
      }else if ((this.selectedActeBS.matPraticienActeBS != null && this.selectedActeBS.matPraticienActeBS != "")
        && (this.selectedActeBS.pharmacie != null && this.selectedActeBS.pharmacie != "") &&
        (this.selectedActeBS.medecin == null || this.selectedActeBS.medecin == "") &&
        (this.selectedActeBS.praticien == null || this.selectedActeBS.praticien == "")){
        this.phari = null ;
      }
    }
    return this.phari ;
  }


}
