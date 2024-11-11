import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {ToastrService} from "ngx-toastr";
import {MatTableDataSource} from "@angular/material/table";
import {HttpErrorResponse} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {Actemedical} from "../../../../model/actemedical/actemedical";
import {ActemedicalService} from "../../../../services/actemedical.service";
import {Title} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-actesmedicaux',
  templateUrl: './actesmedicaux.component.html',
  styleUrls: ['./actesmedicaux.component.css']
})
export class ActesmedicauxComponent implements OnInit {
  dataSource: any;
  @ViewChild(MatPaginator) paginator : MatPaginator | undefined ;
  displayedColumns:string[] = ['code', 'designation', 'mode','valeur','plafond'];
  displayedColumns1:string[] = ['CODE', 'DESIGNATION', 'MODE','VALEUR EN (DT,%,UNITÉ)','PLAFOND EN DT','OBSERVATION'];
  selectedRow: any;
  selectedMode=''
  msg : string = "";
  @ViewChild('scroll') scroll: any;
  constructor(private service : ActemedicalService ,
              private toaster : ToastrService,
              private titleService: Title,private datePipe : DatePipe,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Actes médicaux');
    this.getActemedical();
  }
  codeAct : any;
  highlightMedical(){
    if (this.selectedRow){
      this.codeAct = this.selectedRow.id ;
    }
    return this.codeAct ;
  }

  setMode(value){
    this.selectedMode=value
    if(this.selectedRow!=null) this.selectedRow.reset
  }

  setPercent(valeur: number,mode:string) {
    if(mode=="Taux") return valeur+'%'
    else if (mode == "Quantité") return valeur+ ' DT/UNITÉ'
    else if (mode == "Valeur") return valeur+ ' DT'
  }
  totActeMed : Actemedical[] ;
  public getActemedical():void {
    this.service.getActemedicals().subscribe(
      (response : Actemedical[]) => {
        this.dataSource = new MatTableDataSource<Actemedical>(response);
        this.dataSource.paginator = this.paginator;
        this.totActeMed = response ;}
      ,(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );

  }

  onRowClicked(row: any){
    this.selectedRow = row ;
    this.ExistByCodeActeBS();
    this.ExistActMedByCode(this.selectedRow.code);
    this.equalsAct(this.selectedRow.code,this.selectedRow.code);
    window.scrollTo(0,500);
  }

  setDigit(addForm : NgForm){
    addForm.form.controls['plafond'].setValue(addForm.form.controls['plafond'].value*1.000);
    if(addForm.form.controls['mode'].value=='Valeur' || addForm.form.controls['mode'].value=='Quantité'){
      addForm.form.controls['valeur'].setValue(addForm.form.controls['valeur'].value*1.000);
    }
  }

  onAdd(addForm : NgForm):void{
    this.setDigit(addForm)
    this.service.addActemedical(addForm.value).subscribe(
      (response : Actemedical) => {this.getActemedical();this.cancelClick(addForm);
        window.scrollTo(0,0);
        this.toaster.success("Ajout d'un acte médical avec succès.","SUCCES",{positionClass:'toast-bottom-right'});},
      (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});}
    );
  }

  onUpdate(addForm : NgForm){
    this.setDigit(addForm)
    this.service.updateActemedical(addForm.value,this.selectedRow.id)
      .subscribe(data => {
        this.getActemedical();
        this.cancelClick(addForm);
        window.scrollTo(0,0);
        this.toaster.success("Modification d'un acte médical avec succès.","SUCCES",{positionClass:'toast-bottom-right'});
      }, (error: HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
      })
  }

  onDelete(id : number,addForm:NgForm):void{
    if (this.ExistByCodeActeBS()==true){
      this.toaster.error("Vous ne pouvez pas supprimer un acte médical lorsqu'il est utilisé dans un acte par bulletins des soins","ERREUR",{positionClass:'toast-bottom-right'});
    }else {
      this.service.deleteActemedical(id).subscribe(
        (response: void) => {
          this.getActemedical();
          this.cancelClick(addForm);
          window.scrollTo(0, 0);
          this.toaster.success("Suppression d'un acte médical avec succès.", "SUCCES", {positionClass: 'toast-bottom-right'});
        },
        (error: HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR","ERREUR",{positionClass:'toast-top-right'});
        }
      );
    }
  }


  cancelClick(addForm : NgForm){
    addForm.reset(addForm);
    this.selectedRow = null ;
    this.codeAct = null ;
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
      data.push([[res.code],[res.designation],[res.mode],[this.setPercent(res.valeur,res.mode)],[res.plafond],[(res.observation == '' || res.observation == null) ? 'Aucune observation' : res.observation]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 82, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des actes médicaux est : ' + this.totActeMed.length, 14, 83);
    doc.setFontSize(16);
    doc.text('Liste des actes médicaux', 77, 73);
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
    doc.save('actesmedicaux.pdf');
  }

  existActeMed : Boolean ;
  existActeMedexpr : string ;
  acteMedVerif : boolean ;
  ExistActMedByCode(code : string){
    this.service.exists(code).subscribe(
      (response :Boolean) => {
        this.existActeMed = response ;
        if (this.existActeMed == true){
          this.existActeMedexpr="Ce code existe déjà";
          return this.acteMedVerif=true;
        }
        else {
          return this.acteMedVerif = false ;
        }
      });
  }

  eqAct : boolean ;
  equalsAct(codeafter  :string , codebefore : string):boolean{
    //this.eqFis = true ;
    if (codebefore != codeafter){
      return this.eqAct = false ;
    }else if (codebefore == codeafter){
      return this.eqAct = true ;
    }
    return this.eqAct ;
  }

  existActeBS : boolean ;
  ExistByCodeActeBS() : boolean{
    this.service.existActeBS(this.selectedRow.code).subscribe((response : any) => {this.existActeBS = response});
    return this.existActeBS ;
  }


}
