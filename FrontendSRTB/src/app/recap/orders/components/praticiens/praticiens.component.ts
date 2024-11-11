import {Component, OnInit, ViewChild} from '@angular/core';
import {PraticienService} from "../../../../services/praticien.service";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {Praticien} from "../../../../model/praticien/praticien";
import {MatPaginator} from "@angular/material/paginator";
import {NgForm} from "@angular/forms";
import  jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Title} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-praticiens',
  templateUrl: './praticiens.component.html',
  styleUrls: ['./praticiens.component.css']
})
export class PraticiensComponent implements OnInit {
  displayedColumns1:string[] = ['NOM','PRENOM','MATR FISCALE','MATR PRA','N° TEL','VILLE','ADR','DESCR'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator : MatPaginator | undefined ;
  displayedColumns:string[] = ['matriculePraticien','nom','prenom','matriculeFiscale','phoneNumber'];
  selectedRow: any;
  // dataSource2 = new MatTableDataSource<Praticien>();
  existPraMatPra: string;
  praVerif: boolean;
  existPraMat : boolean ;
  existPraMatFis: boolean;
  existPraMatFisPra: string;
  praFisVerif: boolean;
  eq: boolean;
  eqFis: boolean;
  mat: string;
  phone: string;
  constructor(private service : PraticienService ,
              private toaster : ToastrService,
              private titleService: Title,private datePipe : DatePipe,) { }


  ngOnInit(): void {
    this.titleService.setTitle('Praticiens');
    this.getPraticien();
  }

  pra : any ;
  highlightPhar(){
    if(this.selectedRow){
      this.pra = this.selectedRow.id ;
    }
    return this.pra ;
  }

  totPra : Praticien[] ;
  public getPraticien():void {
    this.service.getPraticienall().subscribe(
      (response : Praticien[]) => {
        this.dataSource = new MatTableDataSource<Praticien>(response);
        this.dataSource.paginator = this.paginator;
        this.totPra = response ;
        }
      ,(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); }
    );

  }

  onRowClicked(row: any){
    this.selectedRow = row ;
    window.scrollTo(0,500)
    this.mat = this.selectedRow.matriculePraticien.substring(3,this.selectedRow.matriculePraticien.length);
    this.phone = this.selectedRow.phoneNumber.substring(7,this.selectedRow.phoneNumber.length);
    this.ExistPraByMatActeBS();
    this.getPraByMatFis(this.selectedRow.matriculeFiscale);
    this.getPraByMat(this.selectedRow.matriculePraticien);
    this.equals(this.selectedRow.matriculePraticien,this.selectedRow.matriculePraticien);
    this.equalsFis(this.selectedRow.matriculeFiscale,this.selectedRow.matriculeFiscale);
  }



  onaddPraticien(addForm : NgForm):void{

      addForm.form.controls['matriculePraticien'].setValue('PRA' + addForm.form.controls['matriculePraticien'].value);
    if (addForm.form.controls['phoneNumber'].value) {
      addForm.form.controls['phoneNumber'].setValue('(+216) ' + addForm.form.controls['phoneNumber'].value);
    }
    if (!addForm.form.controls['phoneNumber'].value) {
      addForm.form.controls['phoneNumber'].setValue('(+216) ');
    }
    this.service.addPraticien(addForm.value).subscribe(
      (response : Praticien) => {this.getPraticien();this.cancelClick(addForm);
        window.scrollTo(0,0)
      this.toaster.success("ajout d'un praticien avec succès","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );
  }


  onupdatePraticien(addForm : NgForm){
    addForm.form.controls['matriculePraticien'].setValue('PRA'+ addForm.form.controls['matriculePraticien'].value);
    if (addForm.form.controls['phoneNumber'].value) {
      addForm.form.controls['phoneNumber'].setValue('(+216) ' + addForm.form.controls['phoneNumber'].value);
    }
    if (!addForm.form.controls['phoneNumber'].value) {
      addForm.form.controls['phoneNumber'].setValue('(+216) ');
    }
    this.service.updatePraticien(addForm.value,this.selectedRow.id)
      .subscribe(data => {
        this.getPraticien();
        this.cancelClick(addForm);
        window.scrollTo(0,0);
        this.toaster.success("Modification d'un praticien avec succès.","SUCCES",{positionClass:'toast-bottom-right'});
      }, error => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});})

  }

  onDeletePraticien(id : number,addForm:NgForm):void{
    if (this.ExistPraByMatActeBS() == true){
      this.toaster.error("Vous ne pouvez pas supprimer un praticien lorsqu'il est utilisé dans un acte par bulletins des soins","ERREUR",{positionClass:'toast-bottom-right'});
    }else {
      this.service.deletePraticien(id).subscribe(
        (response: void) => {
          this.getPraticien();
          this.cancelClick(addForm);
          window.scrollTo(0, 0);
          this.toaster.success("Suppression d'un praticien avec succès.", "SUCCES", {positionClass: 'toast-bottom-right'});
        },
        (error: HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
        }
      );
    }
  }

  cancelClick(addForm : NgForm){
    addForm.reset(addForm);
    this.selectedRow = null ;
    this.pra = null ;
    window.scrollTo(0,0);
  }

  findPraticienByName(name : HTMLInputElement){
    this.applyfilter(name.value);
  }

  applyfilter (filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue ;

  }

  pdfGenerate(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png';
    var data = [];
    this.dataSource.data.forEach(res =>{
      data.push([[res.nom],[res.prenom],[res.matriculeFiscale],[res.matriculePraticien],[res.phoneNumber == '(+216) ' ? 'Aucun numéro de téléphone' : res.phoneNumber],[(res.ville == '' || res.ville == null) ? 'Aucune ville' : res.ville],[(res.adresse == '' || res.adresse == null) ? 'Aucune adresse' : res.adresse],[(res.description == '' || res.description == null) ? 'Aucune description' : res.description]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des praticiens est : ' + this.totPra.length, 14, 83);
    doc.setFontSize(16);
    doc.text('Liste des praticiens', 79, 73);
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
    doc.save('praticiens.pdf');
  }
  matricule : string = "PRA" ;
  getPraByMat(mat : string){
    let matricule : string = "PRA" ;
    this.service.ExistPraMat(matricule.concat(mat)).subscribe((response : any) => {
      this.existPraMat = response ;
      if (this.existPraMat == true){
        this.existPraMatPra="cette matricule du praticien existe";
        return this.praVerif=true;
      }else {
        return this.praVerif=false;
      }
    });
  }

  getPraByMatFis(matFis : string){
    this.service.ExistPraMatFis(matFis).subscribe((response : any) => {
      this.existPraMatFis = response ;
      if (this.existPraMatFis == true){
        this.existPraMatFisPra="cette matricule fiscale de praticien existe";
        return this.praFisVerif=true;
      }else {
        return this.praFisVerif=false;
      }
    });
  }

  equals(matriafter : string , matribefore : string):boolean{
    this.eq = true ;
    let matricule : string = "PRA" ;
    if (matriafter != matricule.concat(matribefore)){
      return this.eq = false ;
    }else if (matriafter == matricule.concat(matribefore)){
      return this.eq = true ;
    }
    return this.eq ;
  }

  equalsFis(matriafter  :string , matribefore : string):boolean{
    this.eqFis = true ;
    if (matribefore != matriafter){
      return this.eqFis = false ;
    }else if (matribefore == matriafter){
      return this.eqFis = true ;
    }
    return this.eqFis ;
  }


  existActeBS : boolean ;
  ExistPraByMatActeBS() : boolean{
    let matricule : string = "PRA" ;
    this.service.ExistPraByMatActeBS(this.selectedRow.matriculePraticien).subscribe((response : any) => {this.existActeBS = response});
    return this.existActeBS ;
  }


}
