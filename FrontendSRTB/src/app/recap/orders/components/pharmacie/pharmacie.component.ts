import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {PharmacieService} from "../../../../services/pharmacie.service";
import {Pharmacie} from "../../../../model/pharmacie/pharmacie";
import {Title} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-pharmacie',
  templateUrl: './pharmacie.component.html',
  styleUrls: ['./pharmacie.component.css']
})
export class PharmacieComponent implements OnInit {
  dataSource: any;
  @ViewChild(MatPaginator) paginator : MatPaginator | undefined ;
  displayedColumns:string[] = ['NOM','MATR PHAR','MATR FISCALE','VILLE', 'ADR','N° TEL','CONVENTIONNEMENT'];
  displayedColumns1:string[] = ['matriculePharmacie','nom', 'matfisc','numtel','isconventioned'];
  selectedRow: any;
  msg : string = "Non";
  @ViewChild('scroll') scroll: any;
  res: string="";
  constructor(private service : PharmacieService ,
              private toaster : ToastrService,
              private titleService: Title,private datePipe : DatePipe,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Pharmacies');
    this.getPharmacie();
  }
  phar : any ;
  highlightPhar(){
    if (this.selectedRow){
      this.phar = this.selectedRow.id ;
    }
    return this.phar;
  }

  totPhar : Pharmacie[] ;
  public getPharmacie():void {
    this.service.getPharmacies().subscribe(
      (response : Pharmacie[]) => {
        this.dataSource = new MatTableDataSource<Pharmacie>(response);
        this.dataSource.paginator = this.paginator;
        this.totPhar = response ;
        }
      ,(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); }
    );

  }

  mat : string ;
  phone : string ;
  onRowClicked(row: any){
    this.selectedRow = row ;
    window.scrollTo(0,500);
    this.ExistPharByMatActeBS();
    this.mat = this.selectedRow.matriculePharmacie.substring(4,this.selectedRow.matriculePharmacie.length);
    this.phone = this.selectedRow.numtel.substring(7,this.selectedRow.numtel.length);
    this.ExistMedByMatFis(this.selectedRow.matfisc);
    this.ExistMPHARByMat(this.selectedRow.matriculePharmacie);
    this.equals(this.selectedRow.matriculePharmacie,this.selectedRow.matriculePharmacie);
    this.equalsFis(this.selectedRow.matfisc,this.selectedRow.matfisc);
  }


  onAdd(addForm : NgForm):void{
    addForm.form.controls['matriculePharmacie'].setValue('PHAR'+addForm.form.controls['matriculePharmacie'].value)
    //addForm.form.controls['numtel'].setValue('(+216) '+addForm.form.controls['numtel'].value);
    //addForm.form.controls['matriculePharmacie'].setValue('PHAR' + addForm.form.controls['matriculePharmacie'].value);
    //addForm.form.controls['numtel'].setValue('(+216)' + addForm.form.controls['numtel'].value);
    if (addForm.form.controls['numtel'].value) {
      addForm.form.controls['numtel'].setValue('(+216) ' + addForm.form.controls['numtel'].value);
    }
    if (!addForm.form.controls['numtel'].value) {
      addForm.form.controls['numtel'].setValue('(+216) ');
    }
    if (addForm.form.controls['isconventioned'].value){
      addForm.form.controls['isconventioned'].setValue(true);
    }else if (!addForm.form.controls['isconventioned'].value){
      addForm.form.controls['isconventioned'].setValue(false);
    }
    this.service.addPharmacie(addForm.value).subscribe(
      (response : Pharmacie) => {this.getPharmacie();this.cancelClick(addForm);
        window.scrollTo(0,0);
        this.toaster.success("Ajout d'une pharmacie avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );
  }

  onUpdate(addForm : NgForm){
    addForm.form.controls['matriculePharmacie'].setValue('PHAR' + addForm.form.controls['matriculePharmacie'].value);
    if (addForm.form.controls['numtel'].value) {
      addForm.form.controls['numtel'].setValue('(+216) ' + addForm.form.controls['numtel'].value);
    }
    if (!addForm.form.controls['numtel'].value) {
      addForm.form.controls['numtel'].setValue('(+216) ');
    }
    if (addForm.form.controls['isconventioned'].value){
      addForm.form.controls['isconventioned'].setValue(true);
    }else if (!addForm.form.controls['isconventioned'].value){
      addForm.form.controls['isconventioned'].setValue(false);
    }
    this.service.updatePharmacie(addForm.value,this.selectedRow.id)
      .subscribe(data => {
        this.getPharmacie();
        this.cancelClick(addForm);
        window.scrollTo(0,0);
        this.toaster.success("Modification d'une pharmacie avec succès.","SUCCES",{positionClass:'toast-bottom-right'});
      }, error => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});})

  }

  onDelete(id : number,addForm:NgForm):void {
    if (this.ExistPharByMatActeBS() == true) {
      this.toaster.error("Vous ne pouvez pas supprimer un pharmacie lorsqu'elle est utilisée dans un acte par bulletins des soins.", "ERREUR", {positionClass: 'toast-bottom-right'});
    } else {
    this.service.deletePharmacie(id).subscribe(
      (response: void) => {
        this.getPharmacie();
        this.cancelClick(addForm);
        window.scrollTo(0, 0);
        this.toaster.success("Suppression d'une pharmacie avec succès.", "SUCCES", {positionClass: 'toast-bottom-right'});
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
    this.res=null
    this.phar = null ;
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

  exportPdf(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png';
    var data = [];
    this.dataSource.data.forEach(res =>{
      data.push([[res.nom],[res.matriculePharmacie],[res.matfisc],[res.ville],[res.adr],[res.numtel],[res.isconventioned]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des pharmacies est : ' + this.totPhar.length, 14, 83);
    doc.setFontSize(16);
    doc.text('Liste des pharmacies', 79, 73);
    doc.setFontSize(11);
   // doc.setTextColor(100);
    autoTable(doc,{
      head: [this.displayedColumns],
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
    doc.save('pharmacies.pdf');
  }


  existPharMat : boolean ;
  existPharMatPhar : string ;
  PharVerif : boolean ;
  ExistMPHARByMat(mat : string){
    let matricule : string = "PHAR" ;
    this.service.existPharByMatr(matricule.concat(mat)).subscribe(
      (response :boolean) => {
        this.existPharMat = response ;
        if (this.existPharMat == true){
          this.existPharMatPhar="cette matricule de pharmacie existe";
          return this.PharVerif=true;
        }
        else {
          return this.PharVerif = false ;
        }
        return this.PharVerif;
      });
  }


  eq : boolean ;
  equals(matriafter : string , matribefore : string):boolean{
    // this.eq = true ;
    let matricule : string = "PHAR" ;
    if (matriafter != matricule.concat(matribefore)){
      return this.eq = false ;
    }else if (matriafter == matricule.concat(matribefore)){
      return this.eq = true ;
    }
    return this.eq ;
  }

  eqFis : boolean ;
  equalsFis(matriafter  :string , matribefore : string):boolean{
    if (matribefore != matriafter){
      return this.eqFis = false ;
    }else if (matribefore == matriafter){
      return this.eqFis = true ;
    }
    return this.eqFis ;
  }


  existPharMatFis : boolean ;
  existPharMatFisPhar : string ;
  pharFisVerif : boolean ;
  ExistMedByMatFis(matFis : string){
    this.service.existPharByMatFis(matFis).subscribe(
      (response :boolean) => {
        this.existPharMatFis = response;
        if (this.existPharMatFis == true) {
          this.existPharMatFisPhar = "cette matricule fiscale de médecin existe";
          return this.pharFisVerif = true;
        } else {
          return this.pharFisVerif = false;
        }
        return this.pharFisVerif;
      });
  }




  existActeBS : boolean ;
  ExistPharByMatActeBS() : boolean{
    this.service.exists(this.selectedRow.matriculePharmacie).subscribe((response : any) => {this.existActeBS = response});
    return this.existActeBS ;
  }

}
