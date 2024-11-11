
import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MedecinService} from "../../../../services/medecin.service";
import {MedecinModule} from "../../../../model/medecin/medecin.module";
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {MatPaginator} from "@angular/material/paginator";
import {NgForm} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Title} from "@angular/platform-browser";
import {PraticienService} from "../../../../services/praticien.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-medecins',
  templateUrl: './medecins.component.html',
  styleUrls: ['./medecins.component.css']
})
export class MedecinsComponent implements OnInit {
  displayedColumns1:string[] = ['NOM','PRENOM','MATR FISCALE','MATR MED','N° TEL','VILLE','ADR','TYPE'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator : MatPaginator | undefined ;
  displayedColumns:string[] = ['matriculeMedecin' ,'nom','prenom', 'Type','matriculeFiscale','phoneNumber'];
  selectedRow: any;
  msg : string = "";
  @ViewChild('scroll') scroll: any;
  med : string = "Med" ;
  existMedMat: Boolean;
  existMedMatMed: string;
  medVerif: boolean;
  existMedMatFisMed: string;
  medFisVerif: boolean;
  existMedMatFis: Boolean;
  eq: boolean;
  eqFis : boolean;
  mat :string ;
  phone : string ;
  constructor(private service : MedecinService ,
              private toaster : ToastrService,
              private titleService: Title ,
              private cdref: ChangeDetectorRef,private datePipe : DatePipe, ) { }


  ngOnInit(): void {
    this.titleService.setTitle('Médecins');
    this.getMedecin();
  }
  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  mede : any ;
  highlightMed(){
    if (this.selectedRow){
      this.mede = this.selectedRow.id ;
    }
    return this.mede ;
  }

  totMed : MedecinModule[] ;
  public getMedecin():void {
    this.service.getMedecinall().subscribe(
      (response : MedecinModule[]) => {
        this.dataSource = new MatTableDataSource<MedecinModule>(response);
        this.dataSource.paginator = this.paginator;
        this.totMed = response ;
        }
      ,(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); }
    );

  }

  onRowClicked(row: any){
    this.selectedRow = row ;
    window.scrollTo(0,700)
    this.mat = this.selectedRow.matriculeMedecin.substring(3,this.selectedRow.matriculeMedecin.length);
    this.phone = this.selectedRow.phoneNumber.substring(7,this.selectedRow.phoneNumber.length);
    this.ExistMedByMatActeBS();
    this.ExistMedByMat(this.selectedRow.matriculeMedecin);
    this.equals(this.selectedRow.matriculeMedecin,this.selectedRow.matriculeMedecin);
    this.ExistMedByMatFis(this.selectedRow.matriculeFiscale);
    this.equalsFis(this.selectedRow.matriculeFiscale,this.selectedRow.matriculeFiscale);
  }


  onaddMedecin(addForm : NgForm):void{
    addForm.form.controls['matriculeMedecin'].setValue('MED'+ addForm.form.controls['matriculeMedecin'].value);
    if (addForm.form.controls['phoneNumber'].value) {
      addForm.form.controls['phoneNumber'].setValue('(+216) ' + addForm.form.controls['phoneNumber'].value);
    }
    if (!addForm.form.controls['phoneNumber'].value) {
      addForm.form.controls['phoneNumber'].setValue('(+216) ');
    }
    this.service.addMedecin(addForm.value).subscribe(
      (response : MedecinModule) => {this.getMedecin();this.cancelClick(addForm);
        window.scrollTo(0,0);
        this.toaster.success("Ajout d'un médecin avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );
  }

  onupdateMedecin(addForm : NgForm){
    addForm.form.controls['matriculeMedecin'].setValue('MED'+ addForm.form.controls['matriculeMedecin'].value);
    if (addForm.form.controls['phoneNumber'].value) {
      addForm.form.controls['phoneNumber'].setValue('(+216) ' + addForm.form.controls['phoneNumber'].value);
    }
    if (!addForm.form.controls['phoneNumber'].value) {
      addForm.form.controls['phoneNumber'].setValue('(+216) ');
    }
    this.service.updateMedecin(addForm.value,this.selectedRow.id)
      .subscribe(data => {
        this.getMedecin();
        this.cancelClick(addForm);
        window.scrollTo(0,0);
        this.toaster.success("Modification d'un medecin avec succès.","SUCCES",{positionClass:'toast-bottom-right'});
      }, error => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});})

  }

  onDeleteMedecin(id : number,addForm:NgForm):void{
    if (this.ExistMedByMatActeBS() == true){
      this.toaster.error("Vous ne pouvez pas supprimer un médecin lorsqu'il est utilisé dans un acte par bulletins des soins.","ERREUR",{positionClass:'toast-bottom-right'});
    }else {
      this.service.deleteMedecin(id).subscribe(
        (response : void) => {
          this.getMedecin();
          this.cancelClick(addForm);
          window.scrollTo(0,0);
          this.toaster.success("Suppression d'un medecin avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
        (error : HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
      );
    }
  }

  cancelClick(addForm : NgForm){
    addForm.reset(addForm);
    this.selectedRow = null ;
    this.mede = null ;
    window.scrollTo(0,0);
  }

  findMedecinByName(name : HTMLInputElement){
    this.applyfilter(name.value);
  }

  applyfilter (filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue ;

  }


  exportMedecinPdf(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png';
    var data = [];
    this.dataSource.data.forEach(res =>{
      data.push([[res.nom],[res.prenom],[res.matriculeFiscale],[res.matriculeMedecin],[res.phoneNumber == '(+216) ' ? 'Aucun numéro de téléphone' : res.phoneNumber],[(res.ville == '' || res.ville == null) ? 'Aucune ville' : res.ville],[(res.adresse == '' || res.adresse == null) ? 'Aucune adresse' : res.adresse],[res.type]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des médecins est : ' + this.totMed.length, 14, 83);
    doc.setFontSize(16);
    doc.text('Liste des médecins', 79, 73);
    doc.setFontSize(11);
    //doc.setTextColor(100);
    autoTable(doc,{
      head: [this.displayedColumns1],
      body: data,
      theme: 'striped',
      headStyles :{
        cellPadding: 2,
        fontSize: 8,
        cellWidth : "wrap"
      },
      tableWidth: 'auto',
      startY: 84,
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
    doc.save('médecins.pdf');
  }


  ExistMedByMat(mat : string){
    let matricule : string = "MED" ;
    this.service.getMedExistByMat(matricule.concat(mat)).subscribe(
      (response :Boolean) => {
        this.existMedMat = response ;
        if (this.existMedMat == true){
          this.existMedMatMed="cette matricule de médecin existe";
          return this.medVerif=true;
        }
        else {
          return this.medVerif = false ;
        }
        return this.medVerif;
      });
  }

  matricule : string = "MED" ;
  equals(matriafter : string , matribefore : string):boolean{
   // this.eq = true ;
    let matricule : string = "MED" ;
    if (matriafter != matricule.concat(matribefore)){
      return this.eq = false ;
    }else if (matriafter == matricule.concat(matribefore)){
      return this.eq = true ;
    }
    return this.eq ;
  }

  equalsFis(matriafter  :string , matribefore : string):boolean{
    if (matribefore != matriafter){
      return this.eqFis = false ;
    }else if (matribefore == matriafter){
      return this.eqFis = true ;
    }
    return this.eqFis ;
  }

  ExistMedByMatFis(matFis : string){
    this.service.getMedExistByMatFis(matFis).subscribe(
      (response :Boolean) => {
        this.existMedMatFis = response;
        if (this.existMedMatFis == true) {
          this.existMedMatFisMed = "cette matricule fiscale de médecin existe";
          return this.medFisVerif = true;
        } else {
          return this.medFisVerif = false;
        }
        return this.medFisVerif;
      });
  }

  existActeBS : boolean ;
  ExistMedByMatActeBS() : boolean{
    let matricule : string = "MED" ;
    this.service.ExistMedByMatActeBS(this.selectedRow.matriculeMedecin).subscribe((response : any) => {this.existActeBS = response});
    return this.existActeBS ;
  }
}
