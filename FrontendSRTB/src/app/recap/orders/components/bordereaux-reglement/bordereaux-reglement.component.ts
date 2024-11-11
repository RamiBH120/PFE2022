import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {BordereauxReglement} from "../../../../model/bordereauxReglement/bordereaux-reglement";
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {BordereauxReglementService} from "../../../../services/bordereaux-reglement.service";
import {NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {file} from "../../../../model/file/file";
import {Reglement} from "../../../../model/reglement/reglement";
import {MatSort} from "@angular/material/sort";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {BulletinDesoinsService} from "../../../../services/bulletin-desoins.service";
import {bordereauxEnvoi} from "../../../../model/bordereauxEnvoi/bordereauxEnvoi";
import {ActeBS} from "../../../../model/acteBS/acteBS";
import {Bulletinsoin} from "../../../../model/bulletinsoin/bulletinsoin";
import {ActeBSService} from "../../../../services/acte-bs.service";
import {BordereauxEnvoiService} from "../../../../services/bordereaux-envoi.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Agence} from "../../../../model/agence/agence";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-bordereaux-reglement',
  templateUrl: './bordereaux-reglement.component.html',
  styleUrls: ['./bordereaux-reglement.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BordereauxReglementComponent implements OnInit {

  @ViewChild('paginatorBr') paginatorBr: MatPaginator | undefined;
  @ViewChild('paginatorRg') paginatorRg: MatPaginator | undefined;
  @ViewChild('paginatorBs') paginatorBs: MatPaginator | undefined;
  @ViewChild('matSort',{static: false}) sort: MatSort;
  @ViewChild('MatSorts') sorts: MatSort;
  @ViewChild('MatSorts') sortPopUp: MatSort;

  @ViewChild('takeInput', {static: false})
  InputVar: ElementRef;

  dataSource: any;
  displayedColumns:string[] = ['nom', 'date','fileDB','montantreg','cloture'];

  dataSourceFichInfo: any;
  displayedColumnsFichInfo:string[] = ['codeAff', 'codePrest', 'dateBs', 'codeActe','refBS','refBord','tauxRembEnv','tauxRembRecep','motifLitige','montActe','montRemb','dateRemb'];
  expandedElement: Reglement | null;

  displayedColumnsBS:string[] = ['numaff','typemalade','datebs','codeActeBS','numbs','refbord','beneficiaire','montantActeBS','dateActeBS'];
  dataSourceBSAuto:any;
  dataSourceBSMan:any;

  displayedColumnsActeBS:string[] = [ 'id' , 'codeActeBS','montantActeBS','dateActeBS','beneficiaire'];
  dataSourceActeBS: any;


  displayedColumnsFichInfo2:string[] = ['codeAff', 'codePrest', 'dateBs', 'codeActe','refBS','refBord','tauxRembEnv','tauxRembRecep','motifLitige','montActe','montRemb','dateRemb'];
  expandedElement2 : Reglement | null ;

  public finbs:any[]=[]
  public bs:Bulletinsoin[]=[]
  public finrg:any[]=[]

  selectedRow: any;
  selectedRowBS: any;
  selectedRowrg: any;
  public selectedIndexBS: number;
  public selectedIndexRg: number;
  file: File = null;
  loading: boolean = false;
  stat: boolean = false;
  sum:number=0;
  reg : Reglement []= [];
  public currid: any;

  constructor(private serviceBR:BordereauxReglementService,
              private serviceBS:BulletinDesoinsService,
              private serviceActeBS : ActeBSService,
              private serviceBE : BordereauxEnvoiService,
              private toaster : ToastrService,
              private titleService: Title,
              private cdref: ChangeDetectorRef,
              private datePipe:DatePipe) { }

  ngOnInit(): void {
    this.titleService.setTitle('Bordereaux de règlement');
    this.getBR();
    this.getAllAgenceId();
  }
  ngAfterViewInit() {

  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  seleBR : any ;
  highlightForBR():any{
    if (this.selectedRow){
      this.seleBR = this.selectedRow.id;
    }
    return this.seleBR ;
  }

  eqNom : boolean ;
  equalsRef(nomafter  :string , nombefore : string){
    if (nombefore != nomafter){
      return this.eqNom = false ;
    }else if (nombefore == nomafter){
      return this.eqNom = true ;
    }
    return this.eqNom ;
  }

  bord : boolean ;
  bordExpression : string;
  existsBordReg(ref : string) : boolean{
    this.serviceBR.existBRbyRef(ref).subscribe((response:boolean) => {
      this.bord = response ;
      if (this.bord == true) {
        this.bordExpression = "Cette référence de ce bordereaux de règlement déjà existe.";
        return this.bord = true ;
      }else {
        this.bordExpression = "" ;
        return this.bord = false ;
      }
    },(error : HttpErrorResponse) => {
      this.bordExpression = "" ;
      this.bord = false ;
    });
    return this.bord ;
  }



  reglement : any [] = [] ;
  getBR():void {
    this.serviceBR.getBordereauxReglementall().subscribe(
      (response : BordereauxReglement[]) => {
        this.dataSource = new MatTableDataSource<BordereauxReglement>(response);
        this.dataSource.paginator = this.paginatorBr;
        this.reglement = response ;
        this.checkSelectCloture(response);}
      ,(error : HttpErrorResponse) => { alert(error.message); }
    );}

  cloForBR : boolean ;
  checkSelectCloture(b:BordereauxReglement[]):boolean{
    b.forEach(value => {
      if (this.selectedRow){
        if (this.selectedRow.id == value.id){
          this.cloForBR = value.cloture ;
        }
      }
    });
    return this.cloForBR ;
  }

  getSumData(id:number):void{
    this.serviceBR.getSumReglement(id).subscribe((response : number) => {
      this.sum=response;
      }
      ,(error : HttpErrorResponse) => { this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'}); })
  }

  getFichierById(id:number):void {
    this.serviceBR.getFileById(id).subscribe(
      (response : file) => {
        console.log(response);}
      ,(error : HttpErrorResponse) => { this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'}); }
    );}


  checkLitDec : boolean = null ;
  checkLit : any [] = [] ;
  checklist1 : any [] = [] ;
  checklist2 : any [] = [] ;
  checkCloture(reg : Reglement[]):boolean{
    if(this.selectedRow) {
      this.checkLit = [] ;
      this.checkLitDec = null ;
      this.checklist2 = [] ;
      this.checklist1 = [] ;
     if (reg.length == 0) {
        this.checkLitDec = false;
      }
      else if (reg.length != 0) {
        reg.forEach(value => {
          this.checklist2.push(value);
          if (value.motifLitige == 'Litige') {
            this.checkLit.push(value);
          }
        });
          this.checkLit.forEach(value1 => {
              this.checklist2 = this.checklist2.filter(ele => {
                if ((ele.refBS != value1.refBS && ele.codeAff != value1.codeAff)){
                  return ele ;
                }
              });
          });
            if (this.checklist2.length != 0){
              this.checkLitDec = true ;
            }else if (this.checklist2.length == 0){
              this.checkLitDec = false ;
            }
      }

      }
    return this.checkLitDec ;
  }

  onUploadUpdateNoFileCloture(addForm : NgForm){
    if (this.checkLitDec == false){
      this.serviceBR.updateBordereauxReglementNoFileCloture(this.selectedRow.id,addForm.value).subscribe(
        (response : BordereauxReglement) => {this.getBR();
          this.toaster.success("Bordereau de règlement clôturé avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
        (error : HttpErrorResponse) => {alert(error.message);
          this.toaster.error("Bordereau de règlement n'est pas clôturé, veuillez réssayer.","ERREUR",{positionClass:'toast-bottom-right'});}
      );
    }else if (this.checkLitDec == true || this.checkLitDec == null){
      this.toaster.warning("Bordereau de règlement ne peut pas être clôturé, veuillez réssayer.","ERREUR",{positionClass:'toast-bottom-right'});
    }
  }

  onUploadUpdateNoFile(addForm : NgForm){
    this.serviceBR.updateBordereauxReglementNoFile(this.selectedRow.id,addForm.value).subscribe(
      (response : BordereauxReglement) => {this.getBR();this.cancelClick(addForm);
        window.scrollTo(0,0);
        this.toaster.success("Modification d'un bordereau de règlement avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'});}
    );
  }

  onUploadUpdate(addForm : NgForm) {
    this.loading = !this.loading;
      this.serviceBR.getAllFile().subscribe(response => {
         let id = Math.max.apply(Math, response.map(function(o) { return o.id; }));
        this.serviceBR.updateBordereauxReglement(id, this.selectedRow.id, addForm.value).subscribe(
          (response: BordereauxReglement) => {
            this.getBR();
            this.cancelClick(addForm);
            window.scrollTo(0, 0);
            this.toaster.success("Modification d'un bordereau de règlement avec succès.", "SUCCES", {positionClass: 'toast-bottom-right'});
          },
          (error: HttpErrorResponse) => {
            this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'});
          }
        );
        this.loading = false; // Flag variable
      });
  }

  onDelete(id:number,addForm : NgForm):void{
    if (this.getExistBullinBR() == true){
      this.toaster.error("Vous ne pouvez pas supprimer un bordereau de règlement lorsqu'il contient des bulletins des soins.","ERREUR",{positionClass:'toast-bottom-right'});
    }else {
      this.serviceBR.deleteBordereauxReglement(id).subscribe(
        (response: void) => {
          this.getBR();
          this.cancelClick(addForm);
          this.toaster.success("Suppression d'un bordereau de règlement avec succès.", "SUCCES",
            {positionClass: 'toast-bottom-right'});
        },
        (error: HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'});
        }
      );
    }
  }

  boll : boolean
  getExistBullinBR() : boolean {
    this.serviceBR.existBullinBR(this.selectedRow.id).subscribe((response:boolean)=>{
      this.boll = response ;
    });
    return this.boll ;
  }

  dataSourceForPopUp:any;
  regleForPop : Reglement[] ;
  clickForPop : boolean = false ;
  checkSpinner : boolean = false ;
  getReglementDataForOnChangePopUp(id:number):void{
    this.checkSpinner = false ;
    this.serviceBR.getReglement(id).subscribe((response : Reglement[]) => {
          this.checkSpinner = false ;
          this.dataSourceForPopUp = new MatTableDataSource<Reglement>(response);
          this.regleForPop = response ;
        if (this.regleForPop.length != 0){
          this.clickForPop = true ;
        }else {
          this.clickForPop = false ;
        }
        this.checkSpinner = true ;
      }
      ,(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'}); })
  }


  buttonCharger(){
    this.serviceBR.getAllFile().subscribe(response => {
      let id = Math.max.apply(Math, response.map(function(o) { return o.id; }));
      this.getReglementDataForOnChangePopUp(id);
    })
  }



  checkfile : boolean = true ;
  checkExist : boolean = null ;
  checkSize : boolean = null ;
  onChange(event) {
    this.checkSize = true ;
    this.checkfile = true ;
    this.clickForPop = false ;
    this.checkExist = true ;
    this.delete = null ;
    this.file = null ;
    this.file = event.target.files[0];
    this.stat = this.file.type == 'text/plain';
    if (this.file != null){
      if (this.file.size >= 1048576){
        this.checkSize = false ;
      }
    }
    if(this.checkSize == false){
      this.toaster.info("Ce fichier dépasse la taille autorisée.","INFO",{positionClass:'toast-bottom-right'});
    }

    this.reglement.forEach(value => {
      if (!this.selectedRow){
        if ((this.file.name) === value.fileDB.name){
          this.checkfile = false ;
        }

        this.serviceBR.getAllFile().subscribe(reps => {
          reps.forEach(vali => {
            this.serviceBR.findBR(vali.id).subscribe(respo => {
              if (respo == null && this.file.name == vali.name){
                this.getReglementDataForOnChangePopUp(vali.id);
                this.getSumData(vali.id);
                this.checkExist = false ;
                this.delete = true ;
              }
            });
          });
        });
      }

      if (this.selectedRow){
        if ((this.file.name) === value.fileDB.name){
          this.checkfile =false ;
        }
        this.serviceBR.getAllFile().subscribe(reps => {
          reps.forEach(vali => {
            this.serviceBR.findBR(vali.id).subscribe(respo => {
              if (respo == null && this.file.name === vali.name){
                this.getReglementDataForOnChangePopUp(vali.id);
                this.getSumData(vali.id);
                this.checkExist = false ;
                this.delete = true ;
              }
            });
          });
        });
      }
    });
    setTimeout(() => {
      if ((this.checkExist ==false) && this.delete == true){
        this.toaster.info("Ce fichier est déjà enregistré.","INFO",{positionClass:'toast-bottom-right'});
      }
      },500);

    if (this.checkfile == true && this.stat == true){
      this.checkfilForPop = true ;
    }else {
      this.checkfilForPop = false ;
    }

    if (this.checkfile == true){
    }else if (this.checkfile == false){
      this.toaster.warning("Ce fichier est déjà lié à un autre bordereau de règlement.","ALERTE",{positionClass:'toast-bottom-right'});
    }
  }
  checkfilForPop : boolean ;
  delete : boolean = null;
  deleteFileDB(){
    if((this.checkExist == true || this.checkExist == null)) {
      this.serviceBR.getAllFile().subscribe(response => {
        let id = Math.max.apply(Math, response.map(function (o) {
          return o.id;
        }));
        this.serviceBR.deleteFile(id).subscribe(response => {
          this.clickForPop = false;
          this.delete = false;
        })
      });
    }
    if (this.checkExist == false){
      this.serviceBR.getAllFile().subscribe(reps => {
        reps.forEach(vali => {
          this.serviceBR.findBR(vali.id).subscribe(respo => {
            if (respo == null && this.file.name == vali.name){
              this.serviceBR.deleteFile(vali.id).subscribe(response => {
                this.clickForPop = false;
                this.delete = false;
                this.checkExist = true ;
              })
            }
          });
        });
      });
    }
  }

  ouiPop() {
    this.delete = true ;
  }


  buttonForUpload(){
    if (this.file != null){
      if (this.checkfile == true && this.stat == true){
        this.serviceBR.upload(this.file).subscribe(response => {
          this.getReglementDataForOnChangePopUp(response.id);
          this.getSumData(response.id);
        });
      }else {
        this.toaster.warning("Ce type de fichier ne correspond pas au format (.txt).","ALERTE",{positionClass:'toast-bottom-right'});
      }
    }
  }

  onUploadAdd(addForm : NgForm) {
    this.loading = !this.loading;
    this.serviceBR.getAllFile().subscribe(resp => {
      let id = Math.max.apply(Math, resp.map(function(o) { return o.id; }));
      this.serviceBR.addBordereauxReglement(id,addForm.value).subscribe(
        (response : BordereauxReglement) => {this.getBR();this.cancelClick(addForm);
          window.scrollTo(0,0);
          this.toaster.success("Ajout d'un bordereau de règlement avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
        (error : HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
      );
      this.loading = false;
    })
}

  getRapReg(rg:Reglement[],bs:Bulletinsoin[]){
    let list:Reglement[]=[]
    let numbsFilter = bs.map(itemY => { return itemY.numbs; });
    let affbsFilter = bs.map(itemY => { return itemY.agent.matstar; });

    let filteredRg = rg.filter(itemX => {return (!numbsFilter.includes(itemX.refBS)||!affbsFilter.includes(itemX.codeAff))});

    filteredRg.forEach(value => {
      list.push(value)
    })
    rg.forEach(value => {
      bs.forEach(value1 => {
        if(value.refBS == value1.numbs && value.codeAff == value1.agent.matstar && value1.bordereauxReglement == null){
          list.push(value)
        }
      })
    })
    return list
  }

  checkSele : boolean = false ;
  testReg : any[] = [] ;
    getReglementOtherData(id:number):void{
      this.checkSele = false ;
      this.serviceBR.getReglement(id).subscribe((response : Reglement[]) => {
          this.serviceBS.getAllBulletinSoins().subscribe((resp:Bulletinsoin[]) => {
            this.getReg(resp,response);
            this.dataSourceFichInfo = new MatTableDataSource<Reglement>(this.reg);
            this.dataSourceFichInfo.paginator = this.paginatorRg;
            this.dataSourceFichInfo.sort = this.sort;
            this.finrg=response;
            this.testReg = this.reg ;
            this.checkCloture(this.reg);
            this.getBS();
            this.getBSActeBS();
            this.checkSele = true ;
          })
      })
    }

  getReglementTest(id:number):any[]{
    this.testReg = [] ;
    this.serviceBR.getReglement(id).subscribe((response : Reglement[]) => {
      this.serviceBS.getAllBulletinSoins().subscribe((resp:Bulletinsoin[]) => {
        this.getReg(resp,response);
        this.testReg = this.reg ;
      })
    });
    return this.testReg ;
  }

  getReg(v:Bulletinsoin[],b:Reglement[]):any[]{
    this.reg = [];
    b.forEach(value => {
      this.reg.push(value);
      v.forEach(value1 => {
          this.reg = this.reg.filter(ele => {
            if (!(ele.refBS == value1.numbs && ele.codeAff == value1.agent.matstar && value1.bordereauxReglement != null)){
              return ele ;
            }
            else {
              return null
            }
          });
      });
    });
    return this.reg ;
  }


  testvBS : any[] = [] ;
  getBS(){
    this.serviceBE.getBordereauxEnvoiall().subscribe(
      (response : bordereauxEnvoi[]) => {
             this.getArray(response,this.reg);
             this.dataSourceBSMan = new MatTableDataSource(this.vBS);
             this.dataSourceBSMan.paginator = this.paginatorBs;
             this.dataSourceBSMan.sort = this.sorts ;
      },(error : HttpErrorResponse) => {alert(error.message);}
    );
  }

  getBSTest():any[]{
    this.testvBS = [] ;
    this.serviceBE.getBordereauxEnvoiall().subscribe(
      (response : bordereauxEnvoi[]) => {
        this.getArray(response,this.reg);
        this.testvBS = this.vBS ;
      },(error : HttpErrorResponse) => {alert(error.message);}
    );
    return this.testvBS ;
  }

  vBS:any[]=[];
  vBSTest : any[] = [] ;
  bReg:any[]=[];
  getArray(e:bordereauxEnvoi[],b:Reglement[]):any[]{
    this.vBS=[];
    this.vBSTest = [] ;
    e.forEach(value => {
      value.bulletinSoinList.forEach(value2 => {
        if (value2.acteBS.length == 0) {
              let merged1 = {...value, ...value2};
              this.vBSTest.push(merged1);
        }
        if (value2.acteBS.length != 0)  {
          value2.acteBS.forEach(value3 => {
                let merged3 = {...value, ...value2, ...value3};
                this.vBSTest.push(merged3);
          });
        }
      });
    });

    this.vBSTest.forEach(val => {
      b.forEach(valReg => {
        if ((val.numbs == valReg.refBS) && (val.agent.matstar == valReg.codeAff) &&
          (val.bordereauxReglement == null || val.bordereauxReglement == "")){
            this.vBS.push(val);
            this.vBS = Array.from(
              this.vBS.reduce((m, t) => m.set(t.id, t), new Map()).values()
            );
        }
      });
    });

    return this.vBS;
  }


   RemoveElementFromArray(element: number) {
    this.vBSTest.forEach((value,index)=>{
      if(value.id==element) this.vBSTest.splice(index,1);
    });
  }

  litige(Rg:Reglement[],bs:any[],v):number{
    let sumb=0;
    let sumr=0;
    Rg.forEach(value => {
      if(value.refBS==v&&value.motifLitige!="Litige") sumr++
    })
    bs.forEach(value => {
      if(value.numbs==v) sumb++
    })
    return sumr-sumb
  }

  count(Rg:Reglement[],bs:any[],v):number{
    let sumb=0;
    let sumr=0;
    Rg.forEach(value => {
      if(value.refBS==v) sumr++
    })
    bs.forEach(value => {
      if(value.numbs==v) sumb++
    })
    return sumb-sumr
  }

  diff(Rg:Reglement[],bs:any[],v):number{
    let sum=0;
    Rg.forEach(value => {
      if(value.codeActe.toLowerCase()!==v.toLowerCase()) sum--
    })
    bs.forEach(value => {
      if(value.acteMedical.code.toLowerCase()!==v.toLowerCase()) sum--
    })
    return sum
  }
 vivo : any[] = [] ;
  autoFilter(){
    this.vivo = [] ;
    let numbsFilter = this.finbs.map(itemY => { return itemY.numbs; });
    let affbsFilter = this.finbs.map(itemY => { return itemY.agent.matstar; });
    let actbsFilter = this.finbs.map(itemY => { return itemY.acteMedical.code; });

    let filteredRg = this.reg.filter(itemX => {return (itemX.motifLitige=="Litige"||!numbsFilter.includes(itemX.refBS)||!affbsFilter.includes(itemX.codeAff)||!actbsFilter.includes(itemX.codeActe)||this.count(this.reg,this.finbs,itemX.refBS)!=0||this.diff(this.reg,this.finbs,itemX.codeActe)==0)});

    let filnumrgFilter = filteredRg.map(itemY => { return itemY.refBS; });
    let filaffrgFilter = filteredRg.map(itemY => { return itemY.codeAff; });
    let filactrgFilter = filteredRg.map(itemY => { return itemY.codeActe; });


    let filteredBs = this.finbs.filter(itemX => {return !(!filnumrgFilter.includes(itemX.numbs) || !filaffrgFilter.includes(itemX.agent.matstar)|| !filactrgFilter.includes(itemX.acteMedical.code)&&this.litige(this.reg,this.finbs,itemX.numbs)==0)})


    let filnumbsFilter = filteredBs.map(itemY => { return itemY.numbs; });
    let filaffbsFilter = filteredBs.map(itemY => { return itemY.agent.matstar; });

    let filteredRgg = this.reg.filter(itemX => {return (itemX.motifLitige=="Litige"||!numbsFilter.includes(itemX.refBS)||!affbsFilter.includes(itemX.codeAff)||!actbsFilter.includes(itemX.codeActe))||filnumbsFilter.includes(itemX.refBS)||filaffbsFilter.includes(itemX.codeAff)});
    let uu : any [] = [] ;
    this.finbs.filter(itemX => {
      if(!(!(!filnumrgFilter.includes(itemX.numbs) || !filaffrgFilter.includes(itemX.agent.matstar)|| !filactrgFilter.includes(itemX.acteMedical.code)&&this.litige(this.reg,this.finbs,itemX.numbs)==0))) {
        uu.push(itemX) ;
        this.serviceBR.updateBSforBR(this.selectedRow.id, itemX.numbs, itemX).subscribe(response => {
          this.getExistBullinBR();
        })
      }
    });

    let gg = uu.map(ite => { return ite.numbs; });

    let foi = this.finbs.filter(itemP => {
      if (uu.length != 0){
        return !(gg.includes(itemP.numbs));
      }
      else {
        return itemP ;
      }
    }) ;

    this.reg = filteredRgg.filter(itemo => {
      if (uu.length != 0){
        return !(gg.includes(itemo.refBS));
      }
      else {
        return itemo ;
      }
    })

    this.vivo = this.vivo.concat(this.reg) ;


    this.dataSourceBSAuto=new MatTableDataSource(foi)
    this.dataSourceBSAuto.paginator = this.paginatorBs;
    this.dataSourceFichInfo=new MatTableDataSource(this.reg)
    this.dataSourceFichInfo.paginator = this.paginatorRg;
    this.dataSourceFichInfo.sort=this.sort;

      if ((this.testvBSActeBS.length != foi.length) && (this.testReg.length != this.reg.length)){
        this.toaster.success("Rapprochement auto effectué avec succès!.","SUCCES",{positionClass:'toast-bottom-right'});
        setTimeout(()=>{
          this.getBulletinSoin();
          this.checkCloture(this.vivo);
          this.getExistBullinBR();
        },1000);
      }
      else if ((this.testvBSActeBS.length == foi.length) && (this.testReg.length == this.reg.length)){
        this.toaster.info("Aucun rapprochement n'est effectué.","INFO",{positionClass:'toast-bottom-right'});
        setTimeout(()=>{
          this.getBulletinSoin();
          this.checkCloture(this.vivo);
          this.getExistBullinBR();
        },1000);
      }

    if (this.selectedRow){
      this.getReglementTest(this.selectedRow.fileDB.id);
      this.getBSActeBSTest();
      this.getBSTest();

    }

  }


  getBSActeBS(){
    this.serviceBE.getBordereauxEnvoiall().subscribe(
      (response2 : bordereauxEnvoi[]) =>{
        let rps:any[]=[]
        response2.forEach(value2 => {
          this.serviceBS.getBulletinSoin(value2.id).subscribe(
            (response : Bulletinsoin[]) => {
              response.forEach(value => {
                this.bs.push(value)
                if(value.bordereauxReglement == null){
                this.serviceActeBS.getActeBullSoin(value.id).subscribe(
                  (response1 : ActeBS[]) => {
                    response1.forEach(value1 => {
                      this.reg.forEach(value3 => {
                        if(value3.refBS==value.numbs&&value3.codeAff==value.agent.matstar){
                          let merged = {...value,...value2,...value1};
                          rps.push(merged)
                          rps = Array.from(
                            rps.reduce((m, t) => m.set(t.id, t), new Map()).values()
                          );
                          this.dataSourceBSAuto = new MatTableDataSource(rps);
                          this.dataSourceBSAuto.paginator = this.paginatorBs;
                          this.finbs=rps
                        }
                      })
                    })
                  })}})
            }
            ,(error : HttpErrorResponse) => {alert(error.message);}
          );
        })
      },(error : HttpErrorResponse) => {alert(error.message);}
    )

  }

  testvBSActeBS : any[] = [] ;
  getBSActeBSTest():any[]{
    this.testvBSActeBS = [] ;
    this.serviceBE.getBordereauxEnvoiall().subscribe(
      (response2 : bordereauxEnvoi[]) =>{
        let rps:any[]=[]
        response2.forEach(value2 => {
          this.serviceBS.getBulletinSoin(value2.id).subscribe(
            (response : Bulletinsoin[]) => {
              response.forEach(value => {
                this.bs.push(value)
                if(value.bordereauxReglement == null){
                  this.serviceActeBS.getActeBullSoin(value.id).subscribe(
                    (response1 : ActeBS[]) => {
                      response1.forEach(value1 => {
                        this.reg.forEach(value3 => {
                          if(value3.refBS==value.numbs&&value3.codeAff==value.agent.matstar){
                            let merged = {...value,...value2,...value1};
                            rps.push(merged)
                            rps = Array.from(
                              rps.reduce((m, t) => m.set(t.id, t), new Map()).values()
                            );
                            this.testvBSActeBS=rps;
                          }
                        })
                      })
                    })}})
            }
            ,(error : HttpErrorResponse) => {alert(error.message);}
          );
        })
      },(error : HttpErrorResponse) => {alert(error.message);}
    )
    return this.testvBSActeBS ;
  }



  getFileandBS(){

    if (this.checkSele == true){
      this.getBS();
      this.getBSActeBS();
    }
    setTimeout(()=>{
      window.scrollTo(0,10400);
    },200)
  }

  sr:any;
  highlightRGRefBS():any{
    if (this.selectedRowrg){
      this.sr = this.selectedRowrg.refBS ;
    }
    return this.sr ;
  }
  aff : any ;
  highlightRGAff():any{
    if (this.selectedRowrg){
      this.aff = this.selectedRowrg.codeAff ;
    }
    return this.aff ;
  }

  sb:any;
  highlightBSNumBS():any{
    if (this.selectedRowBS){
      this.sb = this.selectedRowBS.numbs ;
    }
    return this.sb ;
  }
  agStar:any ;
  highlightBSStar():any{
    if (this.selectedRowBS){
      this.agStar = this.selectedRowBS.agent.matstar ;
    }
    return this.agStar ;
  }


  diffRGMan():number{
    let sum=0;
    this.reg.forEach(value => {
      if(value.refBS==this.selectedRowrg.refBS && value.codeAff == this.selectedRowrg.codeAff) {
        sum++ ;
      }
    });
    return sum
  }

  diffBSMan():number{
    let sum=0;
    this.vBS.forEach(value => {
      if(value.numbs==this.selectedRowBS.numbs && value.agent.matstar == this.selectedRowBS.agent.matstar) {
        sum++;
      }
    });
    return sum
  }

  diffe : boolean ;
  difference(): boolean{
    if (this.selectedRowBS && this.selectedRowrg) {
      if (this.diffRGMan() == this.diffBSMan()) {
        return this.diffe = true;
      } else if (this.diffRGMan() != this.diffBSMan()) {
        return this.diffe = false;
      }
    }
    return this.diffe ;
  }

  filterRow(){
    if (this.selectedRowBS && this.selectedRowrg){
      this.serviceBR.onUpdateBSForBR(this.selectedRowBS,this.selectedRow.id,this.selectedRowBS.numbs).subscribe(response =>{
        this.vBS = this.vBS.filter(ele => {
          if (!(this.selectedRowBS.numbs == ele.numbs && this.selectedRowBS.agent.matstar == ele.agent.matstar)){
            return ele ;
          }else {
            return null
          }
        });
        this.reg = this.reg.filter(el => {
          if (!(this.selectedRowrg.refBS == el.refBS && this.selectedRowrg.codeAff == el.codeAff)){
            return el ;
          }else {
            return null
          }
        });

        this.dataSourceFichInfo=new MatTableDataSource(this.reg);
        this.dataSourceBSMan = new MatTableDataSource(this.vBS);
        this.dataSourceFichInfo.paginator=this.paginatorRg;
        this.dataSourceBSMan.paginator=this.paginatorBs;



          if ((this.testReg.length != this.reg.length) && (this.vBS.length != this.testvBS.length)){
            this.toaster.success("Ce bulletin de soin est rapproché.","SUCCES",{positionClass:'toast-bottom-right'});
            this.selectedRowrg = null ;
            this.selectedRowBS = null ;
            this.sb = null ;
            this.sr = null ;
            this.agStar = null;
            this.aff = null ;
            setTimeout(()=>{
              this.getBulletinSoin();
              this.checkCloture(this.reg);
              this.getExistBullinBR();
            },1000);
          }
          else if ((this.testReg.length == this.reg.length) && (this.vBS.length == this.testvBS.length)){
            this.toaster.info("Aucun bulletin est rapproché.","INFO",{positionClass:'toast-bottom-right'});
            setTimeout(()=>{
              this.getBulletinSoin();
              this.checkCloture(this.reg);
              this.getExistBullinBR();
            },1000);
          }

      });

    }

  }

  btn : boolean = false ;
  onChangeBtnForFile() : boolean {
    this.btn = true ;
    this.selectedRowrg = null ;
    this.selectedRowBS = null ;
    this.sb = null ;
    this.sr = null ;
    this.agStar = null;
    this.aff = null ;
    return this.btn ;
  }
  onChangeBtnForFileForBack() : boolean {
    if (this.delete == true){
      this.deleteFileDB();
      this.delete = null ;
    }
    this.file = null ;
    this.btn = false ;
    return this.btn ;
  }

  checkLitige : boolean = true;
  checkLitigeSelect():boolean{
    this.checkLitige = true ;
    this.reg.forEach(value => {
      if (this.selectedRowrg.refBS == value.refBS && this.selectedRowrg.codeAff == value.codeAff
        && (value.motifLitige == 'Litige' || this.selectedRowrg.motifLitige == 'Litige')){
        this.checkLitige = false ;
      }
    });
    return this.checkLitige ;
  }

  cheSel : boolean = false;
  checkSelect():boolean{
    if (this.selectedRowBS && this.selectedRowrg){
      if (this.selectedRowBS.numbs == this.selectedRowrg.refBS && this.selectedRowBS.agent.matstar == this.selectedRowrg.codeAff){
        this.cheSel = true ;
      }else if ((this.selectedRowrg.refBS != this.selectedRowBS.numbs && this.selectedRowrg.codeAff != this.selectedRowBS.agent.matstar) ||
        (this.selectedRowrg.refBS == this.selectedRowBS.numbs && this.selectedRowrg.codeAff != this.selectedRowBS.age.matstar) ||
        (this.selectedRowrg.refBS != this.selectedRowBS.numbs && this.selectedRowrg.codeAff == this.selectedRowBS.agent.matstar)){
        this.cheSel = false ;
      }
    }
    return this.cheSel ;
  }

  onRowClicked(row: any){
    this.selectedRow = row ;
    this.delete = null ;
    this.getExistBullinBR();
    this.equalsRef(this.selectedRow.nom,this.selectedRow.nom);
    this.existsBordReg(this.selectedRow.nom);
    this.selectedRowrg = null ;
    this.selectedRowBS = null ;
    this.sb = null ;
    this.sr = null ;
    this.agStar = null;
    this.aff = null ;
    setTimeout(()=>{
      this.getReglementOtherData(this.selectedRow.fileDB.id);
    },500);

    setTimeout(() => {
      if (this.reg.length == 0){
        this.dataSourceBSAuto = null ;
      }
    },700);

    this.getBulletinSoin();
    //this.checkCloture();
    this.checkSelectCloture(this.reglement);
    this.checkfile = true ;
    this.btn = false;
    this.file = null ;
    setTimeout(()=>{
      this.getReglementTest(this.selectedRow.fileDB.id);
      this.getBSActeBSTest();
      this.getBSTest();
    },700)

    setTimeout(()=>{
      window.scrollTo(0,800);
    },500)
  }
  onRowClickedReg(row : any){
    this.selectedRowrg = row ;
    this.checkLitigeSelect();
    this.checkSelect();
    setTimeout(()=>{
      this.getReglementTest(this.selectedRow.fileDB.id);
      this.getBSActeBSTest();
      this.getBSTest();
    },700)

    window.scrollTo(0,1400);
  }

  onRowClickedBS(row: any){
    this.selectedRowBS=row;
    this.checkSelect();
    setTimeout(()=>{
      this.getReglementTest(this.selectedRow.fileDB.id);
      this.getBSActeBSTest();
      this.getBSTest();
    },700)
    if (!this.selectedRowrg) {
      window.scrollTo(0, 1000)
    }
  }

  cancelSelectRg(){
    this.selectedRowrg = null ;
    this.sr = null ;
    this.aff = null ;
    window.scrollTo(0,900);
  }

  cancelSelectBS(){
    this.selectedRowBS = null ;
    this.sb = null ;
    //this.sr = null ;
    this.agStar = null;
    //this.aff = null ;
  }

  cancelSelectBSRg(){
    this.selectedRowrg = null ;
    this.selectedRowBS = null ;
    this.sb = null ;
    this.sr = null ;
    this.agStar = null;
    this.aff = null ;
    window.scrollTo(0,1200);
  }
  cancelClick(addForm : NgForm){
    addForm.reset(addForm);
    this.selectedRow = null ;
    this.dataSourceFichInfo=null;
    this.dataSourceBSMan=null;
    this.dataSourceBSAuto=null;
    this.selectedRowrg = null ;
    this.selectedRowBS = null ;
    this.sb = null ;
    this.sr = null ;
    this.agStar = null;
    this.aff = null ;
    this.boll = null ;
    this.delete = null ;
    this.file = null ;
    this.checkfile = true ;
    this.checkLitDec = null ;
    this.btn = false;
    this.seleBR = null ;
    this.cloForBR = null ;
    addForm.form.controls['montantreg'].setValue(0.0);
    setTimeout(()=>{
      if(!this.selectedRow){
        this.InputVar.nativeElement.value = "";
      }
    },100);
    window.scrollTo(0,0);
  }

  findByName(name : HTMLInputElement){
    this.applyfilter(name.value);
  }

  applyfilter (filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue ;

  }

  findByNameRg(name : HTMLInputElement){
    this.applyfilterRG(name.value);
  }

  applyfilterRG (filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceFichInfo.filter = filterValue ;
  }

  findFiltredPopUp(name : HTMLInputElement){
    this.applyfilterWithPopUp(name.value);
  }

  applyfilterWithPopUp(filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceForPopUp.filter = filterValue ;
  }

  findBS(name : HTMLInputElement){
    this.applyfilterBS(name.value);
  }

  applyfilterBS (filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceBSAuto.filter = filterValue ;
  }

  findBSMan(name : HTMLInputElement){
    this.applyfilterBSMan(name.value);
  }

  applyfilterBSMan (filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSourceBSMan.filter = filterValue;

  }



  bullRapp : any [] = [];
  getBulletinSoin() {
    this.serviceBR.getBullByBRId(this.selectedRow.id).subscribe(response => {
      this.sommeDesBullTot(response);
      this.sommeDesResTot(response);
      this.sommeDesPharTot(response);
      this.sommeDesMedTot(response);
      this.sommeDesPratiTot(response);
      this.bullRapp = response ;
    })
  }

  sommeDesBull : number = 0.0 ;
  sommeDesPhar : number = 0.0 ;
  sommeDesRes : number = 0.0 ;
  sommeDesMed : number = 0.0 ;
  sommeDesPrati : number = 0.0 ;
  sommeDesBullTot(v:Bulletinsoin[]) : number{
    this.sommeDesBull = 0.0 ;
    v.forEach(value => {
      this.sommeDesBull += value.sommeTotBull ;
    });
    this.sommeDesBull = Math.round(this.sommeDesBull * 1000) / 1000 ;
    return this.sommeDesBull ;
  }

  sommeDesResTot(v:Bulletinsoin[]) : number{
    this.sommeDesRes = 0.0 ;
    v.forEach(value => {
      this.sommeDesRes += value.sommeTotRestant ;
    });
    this.sommeDesRes = Math.round(this.sommeDesRes * 1000) / 1000 ;
    return this.sommeDesRes ;
  }

  sommeDesPharTot(v:Bulletinsoin[]) : number{
    this.sommeDesPhar = 0.0 ;
    v.forEach(value => {
      this.sommeDesPhar += value.sommeTotPhar ;
    });
    this.sommeDesPhar = Math.round(this.sommeDesPhar * 1000) / 1000 ;
    return this.sommeDesPhar ;
  }

  sommeDesMedTot(v:Bulletinsoin[]) : number {
    this.sommeDesMed = 0.0 ;
    v.forEach(value => {
      this.sommeDesMed += value.sommeTotMed ;
    });
    this.sommeDesMed = Math.round(this.sommeDesMed * 1000) / 1000 ;
    return this.sommeDesMed ;
  }

  sommeDesPratiTot(v:Bulletinsoin[]) : number {
    this.sommeDesPrati = 0.0 ;
    v.forEach(value => {
      this.sommeDesPrati += value.sommeTotPrati ;
    });
    return this.sommeDesPrati ;
  }

  checkImp : boolean = false ;
  displayedColumnsBULL:string[] = ['N°: B.S','MATR','CD','EMPLOYÉ(E)','STAR (DT)','PHARM. (DT)','RESTANT (DT)','SIGNATURE'];
   pdfGenerateBullByAgence() {
     var doc = new jsPDF();
     var img = new Image();
     img.src = 'assets/srtb.png';
     var data = [];


     this.serviceBR.getAgence().subscribe(resp => {
       this.listIDAgence = resp;
       let som :number = 0 ;
       this.listIDAgence.forEach(value => {
         this.serviceBR.getBullByAgence(value.id).subscribe(response => {
           som += 1 ;
           this.respi = [];
           data = [];
           this.respi = response;
           this.sommeDesBullTot(response);
           this.sommeDesResTot(response);
           this.sommeDesPharTot(response);
           this.respi.forEach(res => {
             data.push([[res.numbs], [res.agent.matstar], [res.typemalade], [(res.agent.nom).concat(' ').concat(res.agent.prenom)]
               , [res.sommeTotBull], [res.sommeTotPhar], [res.sommeTotRestant]]);
           });
           if (data.length != 0) {
             doc.setFontSize(9);
             doc.addImage(img, 'PNG', 75, 6, 0, 0);
             doc.text('Société Régionale de Transport de Bizerte', 11, 8);
             doc.setFontSize(15);
             doc.text("Agence", 92, 62);
             doc.text("Nom de l'agence : " + value.nomAgence, 65, 72);
             doc.text("Adresse de l'agence : " + value.adresseAgence, 60, 82);
             doc.text("Ville de l'agence : " + value.villeAgence, 70, 92);
             doc.text("Liste des B.S des agents dans " + value.nomAgence, 50, 177);
             //doc.text('Agence : ' + value.nomAgence)
             doc.setLineWidth(0.5);
             doc.setDrawColor(0, 0, 0);
             doc.rect(15, 53, 180, 48);
             doc.rect(15, 110, 180, 48);
             doc.setFontSize(11);
             doc.text("B.S des agents par agence", 75, 118);
             doc.text('Total des B.S des agents par agence est : ' + this.respi.length, 62, 130);
             doc.text('Total des sommes des bulletins de soins (STAR.) : ' + this.sommeDesBull + ' DT', 53, 135);
             doc.text('Total des sommes des frais des pharmacies (PHARM.) : ' + this.sommeDesPhar + ' DT', 53, 140);
             doc.text('Total des sommes des frais des restants (REST.) : ' + this.sommeDesRes + ' DT', 53, 145);

             autoTable(doc, {
               head: [this.displayedColumnsBULL],
               body: data,
               theme: 'striped',
               headStyles: {
                 cellPadding: 2,
                 fontSize: 8,
                 cellWidth: "wrap"
               },
               tableWidth: 'auto',
               startY: 182,
               didDrawCell: data => {
               }
             });
             doc.addPage();

           }
           if (som == this.listIDAgence.length) {
             this.checkImp = true ;
             if (this.checkImp == true){
               const pageCount = doc.getNumberOfPages();
               for (var i = 1; i <= pageCount; i++) {
                 //let PageCurrent = doc.getPageInfo(i).pageNumber;
                 doc.setPage(i);
                 doc.setLineWidth(0.5);
                 doc.setDrawColor(0, 0, 0);
                 doc.line(14, 284, 200, 284);
                 doc.text('Page ' + String(i) + ' sur ' + String(pageCount), 210 - 32, 297 - 8, null, null);
                 doc.text("Date d'impression : " + this.datePipe.transform(new Date(),'yyyy-MM-dd , HH:mm:ss'),20-5,297-8,null,null);

               }

               doc.setLineWidth(0.5);
               doc.setDrawColor(0, 0, 0);
               doc.rect(25, 120, 162, 35);
               doc.text("En cas d'une analyse ou d'une radiographie veuillez joindre une copie des resultats", 35, 135);
               doc.text("d'analyses ou du rapport de la radio. ", 35, 139);
               doc.text("MERCI.", 35, 144);

               doc.setTextColor(100);

               // below line for Open PDF document in new tab
               doc.output('dataurlnewwindow')

               // below line for Download PDF document
               doc.save('BordereauxReglementsAgence.pdf');
             }
           }
         });
       });
     });

  }

  listIDAgence : Agence[] = [];
  respi : Bulletinsoin[] = [] ;
  getAllAgenceId(){
    this.serviceBR.getAgence().subscribe(response => {
       this.listIDAgence = response ;
    });
  }


  displayedColumnsBullRapp:string[] = ['N°: B.S','MATR','CD','EMPLOYÉ(E)','MONT MED','MONT PHAR',
    'MONT PRA' ,'MONT TOT' , 'MONT RES' ,'DATE SOINS','RAPP'];
  displayBSBS : string[] = ['Montant des frais bulletin de soins est en DT'];
  pdfGenerateBorEnv(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png' ;
    var data = [];
    this.bullRapp.forEach(res =>{
      data.push([[res.numbs],[res.agent.matstar],[res.typemalade],[(res.agent.nom).concat(' ').concat(res.agent.prenom)]
        ,[res.sommeTotMed],[res.sommeTotPhar],[res.sommeTotPrati],[res.sommeTotBull],[res.sommeTotRestant],[res.datebs],[res.bordereauxReglement.nom]]);
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Montant des frais est en DT', 14, 176);
    // doc.setFontSize(11);
    doc.setFontSize(16);
    doc.text("Bordereau de réglement", 80, 70);
    doc.text('Référence : ', 75, 80);
    doc.text(this.selectedRow.nom, 110, 80);
    doc.text("Date de création du bordereau de réglement est : " + this.selectedRow.date , 27,90);
    doc.setLineWidth(0.5);
    doc.rect(15, 55, 180, 48);
    doc.rect(15, 110, 180, 48);
    doc.text("Liste des bulletins de soins rapprochées par B.R", 40, 170);
    doc.setFontSize(11);
    doc.text("Bulletins de soins rapprochées par bordereau de réglement", 50, 118);
    doc.text('Total des bulletins de soins : ' + this.bullRapp.length, 80, 130);
    doc.text('Total des sommes des bulletins de soins : ' + this.sommeDesBull + ' DT', 63, 135);
    doc.text('Total des sommes des frais des médecins : ' + this.sommeDesMed + ' DT', 63, 140);
    doc.text('Total des sommes des frais des pharmacies : ' + this.sommeDesPhar + ' DT', 63, 145);
    doc.text('Total des sommes des frais des praticiens : ' + this.sommeDesPrati + ' DT', 63, 150);



    autoTable(doc,{
      head : [this.displayedColumnsBullRapp],
      body: data,
      theme: 'striped',
      headStyles :{
        cellPadding: 1,
        fontSize: 7,
        cellWidth : "wrap"
      },
      tableWidth: 'auto',
      startY: 177,
      didDrawCell: data => {
      }
    })

    const pageCount = doc.getNumberOfPages();
    for (var i=1 ; i<=pageCount;i++){
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
    doc.save('BordereauxReglementsRapp.pdf');
  }

  checkCodeActeMed : string ;
  checkCode(element : any) : string {
    if (element.acteMedical != null){
      this.checkCodeActeMed = element.acteMedical.code ;
    }else if (element.acteMedical == null || element.acteMedical == ""){
      this.checkCodeActeMed = null ;
    }
    return this.checkCodeActeMed ;
  }
}
