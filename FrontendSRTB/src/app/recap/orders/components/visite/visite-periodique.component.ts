import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit, Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {isSameDay, isSameMonth, startOfDay} from 'date-fns';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent, CalendarView,
  DAYS_OF_WEEK
} from 'angular-calendar';
import localeEs from '@angular/common/locales/fr';
import {DatePipe, registerLocaleData} from "@angular/common";
import {AgentService} from "../../../../services/agent.service";
import {Agents} from "../../../../model/agent/agent";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {NgForm} from "@angular/forms";
import {Visite} from "../../../../model/visite/visite";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {HttpErrorResponse} from "@angular/common/http";


registerLocaleData(localeEs);


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
  green: {
    primary: '#00A300',
    secondary: '#FDF1BA',
  },
};


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'YYYY-MM-DD',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
}
@Component({
  selector: 'app-visite-periodique-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './visite-periodique.component.html',
  styleUrls: ['./visite-periodique.component.css'],
  styles: [
    `
      h3 {
        margin: 0 0 10px;
      }

      pre {
        background-color: #f5f5f5;
        padding: 15px;
      }
    `,
  ],
  encapsulation:ViewEncapsulation.None,
})

export class VisitePeriodiqueComponent implements OnInit {


  dates : Date = new Date() ;
  myFilter = (d: Date | null): boolean => {
    const day = (new Date(d) || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0  && day !== 1 && day !== 6;
  };



  text:string[]=['Fête du Travail','Jour de l’an','Fête de l’Indépendance',
    'Journée des Martyrs','Fête de la République','Fête de la Femme',
    'Fête de l’Evacuation','Fête de la révolution'];
   days : any[] = [{}];



  datasource : any ;
  @ViewChild(MatPaginator) paginator : MatPaginator | undefined ;
  displayedColumns:string[] = ['matsrtb','direction','fonction','nom','prenom','visite','visitePro'];
  selectedRow: Agents;

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;


  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  locale: string = "fr";


  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;


  constructor(private modal: NgbModal,
              private service:AgentService,
              private datePipe:DatePipe,
              private cdref: ChangeDetectorRef,
              private renderer: Renderer2,
              private toaster : ToastrService,
              private titleService: Title) { }



  ngOnInit(): void {
    this.titleService.setTitle('Visite périodique');
    this.getAllAgentByPriority();
    this.getAllVisite();
    this.getIsVisitedDeleted();
    this.getAllAgent();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  dateClass = (d: Date) => {
    const date = (new Date(d) || new Date());
    const dateSearch = this.dateToString(new Date(d));
    if (date.getMonth() == 4 && date.getDate()==1){
      //this.days = [{}] ;
      this.days.push({date : date , text :this.text[0]})
      //1er mai – Fête du Travail
    }
    if (date.getMonth()==0 && date.getDate()==1){
      //this.days = [{}] ;
      this.days.push({date : date,text : this.text[1]}) ;
      //1er janvier – Jour de l’an
    }
    if (date.getMonth()==2 && date.getDate()==20){
      //this.days = [{}] ;
      this.days.push({date:date,text :this.text[2]}) ;
      //20 mars – Fête de l’Indépendance
    }
    if (date.getMonth()==3 && date.getDate()==9){
      //this.days = [{}] ;
      this.days.push({date : date,text : this.text[3]}) ;
      //9 avril – Journée des Martyrs
    }
    if (date.getMonth()==6 && date.getDate()==25){
      //this.days = [{}] ;
      this.days.push({date : date,text :this.text[4]}) ;
      //25 juillet – Fête de la République
    }
    if (date.getMonth()==7 && date.getDate()==13){
      //this.days = [{}] ;
      this.days.push({date : date,text : this.text[5]}) ;
      //13 août – Fête de la Femme
    }
    if (date.getMonth()==9 && date.getDate()==15){
      //this.days = [{}] ;
      this.days.push({date : date,text : this.text[6]}) ;
      //15 octobre – Fête de l’Evacuation
    }
    if (date.getMonth()==11 && date.getDate()==17){
      //this.days = [{}] ;
      this.days.push({date : date,text : this.text[7]}) ;
      //17 décembre – Fête de la révolution
    }


    let varia : any ;
    if (this.days.length != 0){
      this.days.forEach(value => {
       varia = this.dateToString(new Date(value.date)) == dateSearch;
      })
    }

    return (varia) ? 'example-custom-date-class' : undefined;
  }



  dateToString(date: any) {
    return (
      date.getFullYear() +
      "-" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2)
    );
  }
  displayMonth() {
    let elements = document.querySelectorAll(".endDate");
    let x = elements[0].querySelectorAll(".mat-calendar-body-cell");
    x.forEach(y => {
      const dateSearch = this.dateToString(
        new Date(y.getAttribute("aria-label"))
      );
      var data ;
      this.days.forEach(value => {
        if (this.dateToString(new Date(value.date)) == dateSearch){
          data = value.text ;
        }
      });
      if (data) y.setAttribute("aria-label", data);
    });
  }

  streamOpened(event) {
    setTimeout(() => {
      let buttons = document.querySelectorAll("mat-calendar .mat-icon-button");

      buttons.forEach(btn =>
        this.renderer.listen(btn, "click", () => {
          setTimeout(() => {
            //debugger
            this.displayMonth();
          });
        })
      );
      this.displayMonth();
    });
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0);
        this.viewDate = date;
    }
  }



  eventTimesChanged({
                      event,
                      newStart,
                      newEnd,
                    }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    let date1 = event.start.toString();
    date1 = this.datePipe.transform(date1, 'yyyy-MM-dd');
    this.dateForCompare = new Date(date1);
    this.service.getAllAgByEvent(date1).subscribe(rep => {
      this.checkDayClickEvent(rep);
      this.clickEvented = this.clickEvented.filter(value => {
        let val = "visite planifiée : " + value.nom + ' ' + value.prenom+ ' ' + value.matsrtb ;
        if (val === event.title){
          return value ;
        }
        else {
          return null
        }
      })
      this.datasourceClickEvent = new MatTableDataSource<Agents>(this.clickEvented);
    },(error : HttpErrorResponse) => {
      this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
    this.service.getAllAgByNextEvent(date1).subscribe(repi => {
      this.checkDayClickNextEvent(repi);
      this.clickNextEvented = this.clickNextEvented.filter(value => {
        let val = "visite replanifiée : " + value.nom + ' ' + value.prenom+ ' ' + value.matsrtb ;
        if (event.title === val){
          return  value
        }else {
          return null
        }
      })
      this.datasourceClickNextEvent = new MatTableDataSource<Agents>(this.clickNextEvented);
    },(error : HttpErrorResponse) => {
      this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); })

    this.service.getAllAgByNextEvent(date1).subscribe(repi => {
      this.checkDayClickNextEvent2(repi);
      this.clickNextEvented2 = this.clickNextEvented2.filter(value => {
        let val1 = 'visite replanifiée dans la zone rouge : ' + value.nom + ' ' + value.prenom + ' ' + value.matsrtb ;
        if (event.title === val1){
          return  value
        }else {
          return null
        }
      })
      this.datasourceNext2 = new MatTableDataSource<Agents>(this.clickNextEvented2);
    },(error : HttpErrorResponse) => {
      this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); })
  }


  addEvent(addForm:NgForm): void {
    this.service.updateEvent(addForm.value , this.selectedRow.visite.id).subscribe(response=>{
      this.events = [
        ...this.events,
        {
          title: 'évenement',
          start: startOfDay(new Date(response.event)),
          color: colors.blue,
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
        },
      ];
      this.getAllAgent();
      this.getAllVisite();
      this.refresh.next();
      setTimeout(()=>{
        this.getAllAgentByPriority();
      },100)
      this.selectedRow = null ;
      this.select = null ;
      this.toaster.success("Ajout d'un évenement avec succès!.","SUCCES",{positionClass:'toast-bottom-right'});
    },(error : HttpErrorResponse) => {
      this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'}); });
  }

  oui : boolean = true ;
  non : boolean = true ;
  getAllVisiteSelectedAgent():void{
    this.oui = true ;
    this.non = true ;
    this.events = [] ;
    this.service.getAgentMatsrtb(this.selectedAgent.matsrtb).subscribe(reponse=>{
      if (reponse.visite.event != null && reponse.visite.nextEvent == null ){
        if (reponse.visite.visited==false){
          this.events = [
            ...this.events,
            {
              title: "visite planifiée : " + reponse.nom + ' ' + reponse.prenom+ ' ' + reponse.matsrtb,
              start: startOfDay(new Date(reponse.visite.event)),
              color: colors.blue,
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false,
              },
            },
          ];
        }
      }
      if (reponse.visite.event != null && reponse.visite.nextEvent != null) {
        var dt = new Date(reponse.visite.event);
        var month = dt.getMonth();
        var year = dt.getFullYear();
        new Date(year, month, 0).getDate();
        var Difference_In_Time = new Date(reponse.visite.nextEvent).getTime() - new Date(reponse.visite.event).getTime() ;
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (reponse.visite.visited==false && Difference_In_Days <= 30){
          this.events = [
            ...this.events,
            {
              title: 'visite replanifiée : ' + reponse.nom + ' ' + reponse.prenom + ' ' + reponse.matsrtb,
              start: startOfDay(new Date(reponse.visite.nextEvent)),
              color: colors.yellow,
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false,
              },
            },
          ];
        }
        if (reponse.visite.visited==false && Difference_In_Days > 30){
          this.events = [
            ...this.events,
            {
              title: 'visite replanifiée dans la zone rouge : ' + reponse.nom + ' ' + reponse.prenom + ' ' + reponse.matsrtb,
              start: startOfDay(new Date(reponse.visite.nextEvent)),
              color: colors.red,
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false,
              },
            },
          ];
        }
      }
      if (reponse.visite.nextEvent == null && reponse.visite.event == null && reponse.visite.visited==false){
        this.non = false ;
        }
      if (reponse.visite.nextEvent == null && reponse.visite.event == null && reponse.visite.visited==true){
        this.oui = false ;
        }
   },(error : HttpErrorResponse) => {
      this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
      this.refresh.next();
  }

  getAllVisite():void{
    this.events = [] ;
    this.service.getAgents().subscribe(reponse => {
      this.getAllEvent(reponse) ;
      this.eve.forEach(value => {

        if (value.visite.visited==false){
          this.events = [
            ...this.events,
            {
              title: "visite planifiée : " + value.nom + ' ' + value.prenom+ ' ' + value.matsrtb,
              start: startOfDay(new Date(value.visite.event)),
              color: colors.blue,
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false,
              },
            },
          ];
        }
      });
      this.getALlNextEvent(reponse);
      this.nexeve.forEach(value1 => {
        var dt = new Date(value1.visite.event);
        var month = dt.getMonth();
        var year = dt.getFullYear();
        new Date(year, month, 0).getDate();
        var Difference_In_Time = new Date(value1.visite.nextEvent).getTime() - new Date(value1.visite.event).getTime() ;
        // To calculate the no. of days between two dates
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        if (value1.visite.visited==false && Difference_In_Days <= 30){
          this.events = [
            ...this.events,
            {
              title: 'visite replanifiée : ' + value1.nom + ' ' + value1.prenom + ' ' + value1.matsrtb,
              start: startOfDay(new Date(value1.visite.nextEvent)),
              color: colors.yellow,
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false,
              },
            },
          ];
        }
        if (value1.visite.visited==false && Difference_In_Days > 30){
          this.events = [
            ...this.events,
            {
              title: 'visite replanifiée dans la zone rouge : ' + value1.nom + ' ' + value1.prenom + ' ' + value1.matsrtb,
              start: startOfDay(new Date(value1.visite.nextEvent)),
              color: colors.red,
              draggable: false,
              resizable: {
                beforeStart: false,
                afterEnd: false,
              },
            },
          ];
        }
      });
      this.refresh.next();
    },(error : HttpErrorResponse) => {
      this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
  }
  eve : Agents[] = [] ;
  getAllEvent(v:Agents[]):any[]{
    this.eve = [] ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent == null) {
        this.eve.push(value);
      }
    });
    return this.eve ;
  }
  nexeve : Agents[] = [] ;
  getALlNextEvent(v:Agents[]):any[]{
    this.nexeve = [] ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent != null){
        this.nexeve.push(value);
      }
    });
    return this.nexeve ;
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  mois : boolean = true ;
  semaine : boolean = false ;
  Mois(){
    this.mois = true ;
    this.semaine = false ;
  }

  Semaine(){
    this.mois = false ;
    this.semaine = true ;
  }


  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


  excludeDays: number[] = [0, 6 , 1];
  weekStartsOn = DAYS_OF_WEEK.SUNDAY;


  agPrio : boolean = true;
  dateForPrio : Date = null ;
  getAllAgentByPriority(){
    this.agPrio = true ;
    this.dateForPrio = null ;
    this.service.getAgents().subscribe(resp=>{
      this.getArr(resp);
      if (this.gg == true) {
        if (this.agent.length != 0) {
          this.dateForPrio = new Date(Math.min.apply(Math, this.agent.map(function (o) {
            return new Date(o.visite.nextdate);
          })));
          if (this.dateForPrio != null) {
            this.agPrio = false;
          } else if (this.dateForPrio == null) {
            this.agPrio = true;
          }

          let datee = (this.datePipe.transform(this.dateForPrio, 'yyyy-MM-dd'));
          this.service.getAgByNextDate(datee).subscribe(response => {
            this.getDateAftergetArray(response);
            this.datasource = new MatTableDataSource<Agents>(this.agent2);
          },(error : HttpErrorResponse) => {
            this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
        }else if (this.agent.length == 0){
          this.agent2 = [] ;
          this.agPrio = true ;
          this.datasource = new MatTableDataSource<Agents>(this.agent2);
        }
      }
    },(error : HttpErrorResponse) => {
      this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
  }

  agent : Agents[] = [];
  gg : boolean = false ;
  getArr(v:Agents[]):Agents[]{
    this.agent = [] ;
    this.gg = false ;
    v.forEach(value => {
      if (value.visite.event == null && value.visite.nextEvent == null && value.visite.visited==false ){
        this.agent.push(value);
      }
      this.gg = true ;
    });
    return this.agent ;
  }

  agent2 : Agents[] = [] ;
  getDateAftergetArray(v:Agents[]):Agents[]{
    this.agent2 = [] ;
    v.forEach(value => {
      if (value.visite.event == null && value.visite.nextEvent == null && value.visite.visited==false){
        this.agent2.push(value);
      }
    });
    return this.agent2 ;
  }

  OnRowClicked(row:any,form:NgForm){
    this.selectedRow = row ;
    this.getConvertedMinus();
    form.form.controls['event'].reset();
  }

  select : any ;
  highlight():any{
    if (this.selectedRow){
     this.select = this.selectedRow.matsrtb;
    }
    return this.select ;
  }

  exiEve : boolean = false ;
  ExistEvent(date : string):boolean{
    this.exiEve = false ;
    date = this.datePipe.transform(date,'yyyy-MM-dd');
    if (this.selectedRow && date != null) {
      this.service.getAllAgByEvent(date).subscribe(reponse => {
        this.CheckAgenceEvent(reponse);
        if (this.agence == true) {
          this.exiEve = true;
        }
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
    return this.exiEve ;
  }

  exiNextEve : boolean = false ;
  ExistNextEvent(date:string):boolean{
    this.exiNextEve = false ;
    date = this.datePipe.transform(date,'yyyy-MM-dd');
    if (this.selectedRow && date != null) {
      this.service.getAllAgByNextEvent(date).subscribe(response => {
        this.CheckAgenceNextEvent(response);
        if (this.agenceNextEvent == true) {
          this.exiNextEve = true;
        }
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
    return this.exiNextEve ;
  }



  agence : boolean = false ;
  CheckAgenceEvent(v:Agents[]):boolean{
    this.agence = false ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent == null) {
          if (((value.fonction.toLowerCase() == 'chauffeur' && this.selectedRow.fonction.toLowerCase()=='chauffeur')
            || (value.agence.id == this.selectedRow.agence.id))){
            this.agence = true;
          }
      }
    });
    return this.agence ;
  }

  agenceNextEvent : boolean = false ;
  CheckAgenceNextEvent(v:Agents[]):boolean{
    this.agenceNextEvent = false ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent != null){
        if (((value.fonction.toLowerCase() == 'chauffeur' && this.selectedRow.fonction.toLowerCase()=='chauffeur')
          || (value.agence.id == this.selectedRow.agence.id))){
          this.agenceNextEvent = true ;
        }
      }
    });
    return this.agenceNextEvent ;
  }



  datasourceClickEvent : any ;
  displayedColumnsEvent:string[] = ['matsrtb','direction','fonction','nom','prenom','event'];
  datasourceClickNextEvent : any ;
  displayedColumnsNextEvent:string[] = ['matsrtb','direction','fonction','nom','prenom','Nextevent'];
  displayedColumnsNextEvent2:string[] = ['matsrtb','direction','fonction','nom','prenom','Nextevent'];
  datasourceNext2 : any ;
  dateForCompare : Date = new Date();
  dayClickedEventAndNextEvent({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate) && !this.selectedAgent) {
     let date1 = date.toString()
     date1 = this.datePipe.transform(date1,'yyyy-MM-dd');
     this.dateForCompare = new Date(date1) ;
      this.service.getAllAgByEvent(date1).subscribe(rep=>{
        this.checkDayClickEvent(rep);
        this.datasourceClickEvent = new MatTableDataSource<Agents>(this.clickEvented);
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
      this.service.getAllAgByNextEvent(date1).subscribe(repi=>{
        this.checkDayClickNextEvent(repi);
        this.clickNextEvented = this.clickNextEvented.filter(value => {
          var dt = new Date(value.visite.event);
          var month = dt.getMonth();
          var year = dt.getFullYear();
          new Date(year, month, 0).getDate();
          var Difference_In_Time = new Date(value.visite.nextEvent).getTime() - new Date(value.visite.event).getTime() ;
          // To calculate the no. of days between two dates
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          if (Difference_In_Days<=30){
            return value ;
          }else {
            return null
          }
        })
        this.datasourceClickNextEvent = new MatTableDataSource<Agents>(this.clickNextEvented);
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
      this.service.getAllAgByNextEvent(date1).subscribe(repi=>{
        this.checkDayClickNextEvent2(repi);
        this.clickNextEvented2 = this.clickNextEvented2.filter(value => {
          var dt = new Date(value.visite.event);
          var month = dt.getMonth();
          var year = dt.getFullYear();
          new Date(year, month, 0).getDate();
          var Difference_In_Time = new Date(value.visite.nextEvent).getTime() - new Date(value.visite.event).getTime() ;
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          if (Difference_In_Days>30){
            return value ;
          }else {
            return null
          }
        })
        this.datasourceNext2 = new MatTableDataSource<Agents>(this.clickNextEvented2);
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
    if (isSameMonth(date, this.viewDate) && this.selectedAgent) {
      let date1 = date.toString()
      date1 = this.datePipe.transform(date1,'yyyy-MM-dd');
      this.dateForCompare = new Date(date1) ;
      this.service.getAllAgByEvent(date1).subscribe(rep=>{
        this.checkDayClickEvent(rep);
        this.clickEvented = this.clickEvented.filter(value => {
          if (value.matsrtb === this.selectedAgent.matsrtb){
            return value ;
          }
          else {
            return null
          }
        })
        this.datasourceClickEvent = new MatTableDataSource<Agents>(this.clickEvented);
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
      this.service.getAllAgByNextEvent(date1).subscribe(repi=>{
        this.checkDayClickNextEvent(repi);
        this.clickNextEvented = this.clickNextEvented.filter(value => {
          if (value.matsrtb === this.selectedAgent.matsrtb){
            var dt = new Date(value.visite.event);
            var month = dt.getMonth();
            var year = dt.getFullYear();
            new Date(year, month, 0).getDate();
            var Difference_In_Time = new Date(value.visite.nextEvent).getTime() - new Date(value.visite.event).getTime() ;
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if (Difference_In_Days <= 30){
              return value ;
            }
          }
          else {
            return null
          }
        })
        this.datasourceClickNextEvent = new MatTableDataSource<Agents>(this.clickNextEvented);
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); })

      this.service.getAllAgByNextEvent(date1).subscribe(repi=>{
        this.checkDayClickNextEvent2(repi);
        this.clickNextEvented2 = this.clickNextEvented2.filter(value => {
          if (value.matsrtb === this.selectedAgent.matsrtb){
            var dt = new Date(value.visite.event);
            var month = dt.getMonth();
            var year = dt.getFullYear();
            new Date(year, month, 0).getDate();
            var Difference_In_Time = new Date(value.visite.nextEvent).getTime() - new Date(value.visite.event).getTime() ;
            // To calculate the no. of days between two dates
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            if (Difference_In_Days>30){
              return value ;
            }
          }
          else {
          }
        })
        this.datasourceNext2 = new MatTableDataSource<Agents>(this.clickNextEvented2);
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'}); })
    }
  }

  clickEvented:Agents[]=[];
  checkDayClickEvent(v:Agents[]):Agents[]{
    this.clickEvented = [] ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent == null){
        this.clickEvented.push(value);
      }
    });
    return this.clickEvented ;
  }

  clickNextEvented : Agents[]=[];
  checkDayClickNextEvent(v:Agents[]):Agents[]{
    this.clickNextEvented=[];
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent != null){
        this.clickNextEvented.push(value);
      }
    });
    return this.clickNextEvented ;
  }

  clickNextEvented2 : Agents[]=[];
  checkDayClickNextEvent2(v:Agents[]):Agents[]{
    this.clickNextEvented2=[];
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent != null){
        this.clickNextEvented2.push(value);
      }
    });
    return this.clickNextEvented2 ;
  }

  selectEvent : Agents ;
  OnRowClickedEvent(row : any , form:NgForm){
    this.selectEvent = row ;
    this.selectNextEvent = null ;
    this.seleNextEvent = null ;
    this.getConvertedMinusEvent();
    this.getConvertedMinusEventForMaxSelectEvent();
    form.form.controls['nextEvent'].reset();
  }

  selectNextEvent : Agents ;
  OnRowClickedNextEvent(row : any,form:NgForm){
    this.selectNextEvent = row ;
    this.selectEvent = null ;
    this.seleEvent = null ;
    this.getConvertedMinusNext();
    this.getConvertedMinusEventForMaxSelectNextEvent();
    form.form.controls['nextEvent'].reset();
  }

  seleEvent : any ;
  highlightEvent():any{
    if (this.selectEvent){
      this.seleEvent = this.selectEvent.matsrtb;
    }
    return this.seleEvent ;
  }

  seleNextEvent : any ;
  highlightNextEvent():any{
    if (this.selectNextEvent){
      this.seleNextEvent = this.selectNextEvent.matsrtb;
    }
    return this.seleNextEvent ;
  }



  exiUpdateEve : boolean = false ;
  ExistUpdateEvent(date : string):boolean{
    this.exiUpdateEve = false ;
    date = this.datePipe.transform(date,'yyyy-MM-dd');
    if (this.selectEvent && date != null) {
      this.service.getAllAgByEvent(date).subscribe(reponse => {
        this.CheckUpdateAgenceEvent(reponse);
        if (this.agenceUpdate == true) {
          this.exiUpdateEve = true;
        }
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
    return this.exiUpdateEve ;
  }

  bool : boolean = false ;
  ExistForm(value:any):boolean{
    this.bool = false ;
    if (value == null || value==""){
      this.bool = false ;
    }
    else if (value != null || value != ""){
      this.bool = true ;
    }
    return  this.bool ;
  }

  exiUpdateNextEve : boolean = false ;
  ExistUpdateNextEvent(date:string):boolean{
    this.exiUpdateNextEve = false ;
    date = this.datePipe.transform(date,'yyyy-MM-dd');
    if (this.selectEvent && date != null) {
      this.service.getAllAgByNextEvent(date).subscribe(response => {
        this.CheckUpdateAgenceNextEvent(response);
        if (this.agenceUpdateNextEvent == true) {
          this.exiUpdateNextEve = true;
        }
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR.", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
    return this.exiUpdateNextEve ;
  }



  agenceUpdate : boolean = false ;
  CheckUpdateAgenceEvent(v:Agents[]):boolean{
    this.agenceUpdate = false ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent == null) {
        if (((value.fonction.toLowerCase() == 'chauffeur' && this.selectEvent.fonction.toLowerCase()=='chauffeur')
          || (value.agence.id == this.selectEvent.agence.id))){
          this.agenceUpdate = true;
        }
      }
    });
    return this.agenceUpdate ;
  }

  agenceUpdateNextEvent : boolean = false ;
  CheckUpdateAgenceNextEvent(v:Agents[]):boolean{
    this.agenceUpdateNextEvent = false ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent != null){
        if (((value.fonction.toLowerCase() == 'chauffeur' && this.selectEvent.fonction.toLowerCase()=='chauffeur')
          || (value.agence.id == this.selectEvent.agence.id))){
          this.agenceUpdateNextEvent = true ;
        }
      }
    });
    return this.agenceUpdateNextEvent ;
  }

  compareDate : boolean = false ;
  CompareDates(date:Date):boolean{
    let date1 = this.datePipe.transform(date,'yyyy-MM-dd');
    if ((this.selectEvent.visite.event).toString() !== date1){
      this.compareDate = true
    }
    else if ((this.selectEvent.visite.event).toString() === date1){
      this.compareDate = false ;
    }
    return this.compareDate ;
  }



  exiUpdateEveForNext : boolean = false ;
  ExistUpdateEventForNext(date : string):boolean{
    this.exiUpdateEveForNext = false ;
    date = this.datePipe.transform(date,'yyyy-MM-dd');
    if (this.selectNextEvent && date != null) {
      this.service.getAllAgByEvent(date).subscribe(reponse => {
        this.CheckUpdateAgenceEventForNext(reponse);
        if (this.agenceUpdateForNext == true) {
          this.exiUpdateEveForNext = true;
        }
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
    return this.exiUpdateEveForNext ;
  }

  exiUpdateNextEveForNext : boolean = false ;
  ExistUpdateNextEventForNext(date:string):boolean{
    this.exiUpdateNextEveForNext = false ;
    date = this.datePipe.transform(date,'yyyy-MM-dd');
    if (this.selectNextEvent && date != null) {
      this.service.getAllAgByNextEvent(date).subscribe(response => {
        if (this.agenceUpdateNextEventForNext == true) {
          this.exiUpdateNextEveForNext = true;
        }
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
    return this.exiUpdateNextEveForNext ;
  }



  agenceUpdateForNext : boolean = false ;
  CheckUpdateAgenceEventForNext(v:Agents[]):boolean{
    this.agenceUpdateForNext = false ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent == null) {
        if (((value.fonction.toLowerCase() == 'chauffeur' && this.selectNextEvent.fonction.toLowerCase()=='chauffeur')
          || (value.agence.id == this.selectNextEvent.agence.id))){
          this.agenceUpdateForNext = true;
        }
      }
    });
    return this.agenceUpdateForNext ;
  }

  agenceUpdateNextEventForNext : boolean = false ;
  CheckUpdateAgenceNextEventForNext(v:Agents[]):boolean{
    this.agenceUpdateNextEventForNext = false ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent != null){
        if (((value.fonction.toLowerCase() == 'chauffeur' && this.selectNextEvent.fonction.toLowerCase()=='chauffeur')
          || (value.agence.id == this.selectNextEvent.agence.id))){
          this.agenceUpdateNextEventForNext = true ;
        }
      }
    });
    return this.agenceUpdateNextEventForNext ;
  }

  compareDateForNext : boolean = false ;
  CompareDatesForNext(date:Date):boolean{
    let date1 = this.datePipe.transform(date,'yyyy-MM-dd');
    if ((this.selectNextEvent.visite.nextEvent).toString() !== date1){
      this.compareDateForNext = true
    }
    else if ((this.selectNextEvent.visite.nextEvent).toString() === date1){
      this.compareDateForNext = false ;
    }
    return this.compareDateForNext ;
  }

  cancelClick(){
    this.seleEvent = null ;
    this.seleNextEvent = null ;
    this.selectNextEvent = null ;
    this.selectEvent = null ;
    this.bolli = false ;
    this.leted=null ;
    this.datasourceClickEvent = null ;
    this.datasourceClickNextEvent = null ;
    this.datasourceNext2 = null ;
    this.leted = null ;
    this.bool = false ;
    this.compareDate = false ;
    this.exiUpdateEve = false ;
    this.exiUpdateNextEve = false ;
    this.exiUpdateEveForNext = false ;
    this.exiUpdateNextEveForNext = false ;
    this.compareDateForNext = false ;

  }

  cancelClick2(){
    this.selectedRow = null ;
    this.select = null ;
    this.bool = false ;
    this.exiEve = false ;
    this.exiNextEve = false ;
  }

  updatNextEventNonReplanfifier(addForm:NgForm){
    this.service.updateNextEvent(this.selectEvent.visite.id,addForm.value).subscribe(rep=>{
         if (rep.visited == true){
           this.service.updateForNextDate(rep.id,rep,this.selectEvent.matsrtb).subscribe(reps=>{
             this.service.updateForLastDate(reps.id,this.selectEvent.matsrtb , reps).subscribe(repss=>{
               this.service.updateForEvent(repss.id,repss).subscribe(repp=>{
                 this.leted=null ;
                 this.events = [];
                 if (!this.selectedAgent) {
                   this.getAllVisite();
                 }
                 if (this.selectedAgent) {
                   this.getAllVisiteSelectedAgent();
                 }
                 this.getIsVisitedDeleted();
                 this.getAllAgent();
                 this.cancelClick();
                 this.toaster.success("Modification d'un évenement avec succès!.", "SUCCES", {positionClass: 'toast-bottom-right'});
               },(error : HttpErrorResponse) => {
                 this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
             },(error : HttpErrorResponse) => {
               this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
           },(error : HttpErrorResponse) => {
             this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
         }
         if(rep.visited == false) {
           this.events = [];
           if (!this.selectedAgent) {
             this.getAllVisite();
           }
           if (this.selectedAgent) {
             this.getAllVisiteSelectedAgent();
           }
           this.getIsVisitedDeleted();
           this.getAllAgent();
           this.cancelClick();
           this.toaster.success("Modification d'un évenement avec succès!.", "SUCCES", {positionClass: 'toast-bottom-right'});
         }
    });
    this.refresh.next();
  }

  updatNextEventReplanfifier(addForm:NgForm){
    this.service.updateNextEvent(this.selectNextEvent.visite.id,addForm.value).subscribe(rep=>{
      if (rep.visited == true){
        this.service.updateForNextDate(rep.id,rep,this.selectNextEvent.matsrtb).subscribe(reps=>{
          this.service.updateForLastDate(reps.id,this.selectNextEvent.matsrtb , reps).subscribe(repss=>{
            this.service.updateForEvent(repss.id,repss).subscribe(repp=>{
              this.leted=null ;
              this.events = [];
              if (!this.selectedAgent) {
                this.getAllVisite();
              }
              if (this.selectedAgent) {
                this.getAllVisiteSelectedAgent();
              }
              this.getIsVisitedDeleted();
              this.getAllAgent();
              this.cancelClick();
              this.toaster.success("Modification d'un évenement avec succès!.", "SUCCES", {positionClass: 'toast-bottom-right'});
            },(error : HttpErrorResponse) => {
              this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
          },(error : HttpErrorResponse) => {
            this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
        },(error : HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
      }
      if (rep.visited == false) {
        this.events = [];
        if (!this.selectedAgent) {
          this.getAllVisite();
        }
        if (this.selectedAgent) {
          this.getAllVisiteSelectedAgent();
        }
        this.getIsVisitedDeleted();
        this.getAllAgent();
        this.cancelClick();
        this.toaster.success("Modification d'un évenement avec succès!.", "SUCCES", {positionClass: 'toast-bottom-right'});
      }
    });
    this.refresh.next();
  }

  replani : boolean = false ;

  cancelClickForReplanfier(){
    this.selectEvent=null;
    this.seleEvent=null;
    this.selectNextEvent=null;
    this.seleNextEvent=null;
    this.bolli = false ;
    this.leted=null ;
    this.bool = false ;
    this.compareDate = false ;
    this.exiUpdateEve = false ;
    this.exiUpdateNextEve = false ;
    this.exiUpdateEveForNext = false ;
    this.exiUpdateNextEveForNext = false ;
    this.compareDateForNext = false ;
  }

  nonRep : boolean = false ;

  cancelClickForNonReplanifier(){
    this.selectEvent=null;
    this.seleEvent=null;
    this.selectNextEvent=null;
    this.seleNextEvent=null;
    this.bolli = false ;
    this.leted=null ;
    this.bool = false ;
    this.compareDate = false ;
    this.exiUpdateEve = false ;
    this.exiUpdateNextEve = false ;
    this.exiUpdateEveForNext = false ;
    this.exiUpdateNextEveForNext = false ;
    this.compareDateForNext = false ;
  }

  zoneRouge : boolean = false ;

  cancelClickForZoneRouge(){
    this.selectEvent = null;
    this.seleEvent = null ;
    this.selectNextEvent=null;
    this.seleNextEvent=null;
    this.bolli = false ;
    this.leted = null ;
    this.bool = false ;
    this.compareDate = false ;
    this.exiUpdateEve = false ;
    this.exiUpdateNextEve = false ;
    this.exiUpdateEveForNext = false ;
    this.exiUpdateNextEveForNext = false ;
    this.compareDateForNext = false ;
  }

  zoneR(){
    this.zoneRouge = true ;
    this.nonRep = false ;
    this.replani = false ;
  }

  nonRepl(){
    this.nonRep = true ;
    this.zoneRouge = false ;
    this.replani = false ;
  }

  Repla(){
    this.replani = true ;
    this.zoneRouge = false ;
    this.nonRep = false ;
  }



  CompareDatesForVisite():boolean{
    let date1 : Date = new Date() ;
    let bol : boolean = false ;
    if (this.dateForCompare>date1){
       bol = true ;
    }
    else if (this.dateForCompare<=date1){
       bol = false ;
    }
    return bol ;
  }

  dd : Date ;
  getConvertedMinus(){
    this.service.getConvertedMinus(this.selectedRow.visite.id).subscribe(resp =>{
      this.dd = resp ;
    });
  }

  ddNext : Date ;
  getConvertedMinusNext(){
    this.service.getConvertedMinus(this.selectNextEvent.visite.id).subscribe(resp =>{
      this.ddNext = resp ;
    });
  }

  ddEvent : Date ;
  getConvertedMinusEvent(){
    this.service.getConvertedMinus(this.selectEvent.visite.id).subscribe(resp =>{
      this.ddEvent = resp ;
    });
  }

  ddEventForSelectNext : Date ;
  getConvertedMinusEventForMaxSelectNextEvent(){
    this.service.getConvertedMinus(this.selectNextEvent.visite.id).subscribe(resp =>{
      this.ddEventForSelectNext = resp ;
    });
  }

  ddEventForSelect : Date ;
  getConvertedMinusEventForMaxSelectEvent(){
    this.service.getConvertedMinus(this.selectEvent.visite.id).subscribe(resp =>{
      this.ddEventForSelect = resp ;
    });
  }


bolli:boolean=false ;
  leted:boolean=null;
  CompareDatesSupp():boolean{
    this.leted=false ;
    let date1 : Date = new Date() ;
     this.bolli = false ;
    if (this.dateForCompare>date1){
      this.bolli = true ;
    }
    else if (this.dateForCompare<=date1){
      this.bolli = false ;
    }
    return this.bolli ;
  }

  clickForUpdate(){
    this.leted=true;
    this.bolli = false ;
  }

  UpdateForDelete(){
    if (this.selectNextEvent && !this.selectEvent) {
      this.service.updateForDelete(this.selectNextEvent.visite.id, this.selectNextEvent.visite).subscribe(rep=>{
        this.events=[];
        this.leted=null ;
        if (!this.selectedAgent){
          this.getAllVisite();
        }
        if (this.selectedAgent){
          this.getAllVisiteSelectedAgent();
        }
        this.getAllAgent();
        this.cancelClick();
        this.toaster.success("Supression d'un évenement avec succès!.","SUCCES",{positionClass:'toast-bottom-right'});
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
  }

  UpdateForDelete2(){
    if (this.selectEvent && !this.selectNextEvent) {
      this.service.updateForDelete(this.selectEvent.visite.id, this.selectEvent.visite).subscribe(rep=>{
        this.events=[];
        this.leted=null ;
        if (!this.selectedAgent){
          this.getAllVisite();
        }
        if (this.selectedAgent){
          this.getAllVisiteSelectedAgent();
        }
        this.getAllAgent();
        this.cancelClick();
        this.toaster.success("Suppression d'un évenement avec succès!.","SUCCES",{positionClass:'toast-bottom-right'});
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
    }
  }


  getIsVisitedDeleted(){
    this.service.getAllVisite().subscribe(resp=>{
      this.getIsVisitedInSameDate(resp);
      if (this.forTruth==true) {
        this.isVis.forEach(value => {
          this.service.updateVisiteForIsVisited(value.id, value).subscribe(respo => {
          },(error : HttpErrorResponse) => {
            this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
        });
      }
    });
  }

  isVis:Visite[]=[];
  forTruth : boolean = false ;
  getIsVisitedInSameDate(v:Visite[]):Visite[]{
    this.isVis=[];
    this.forTruth = false ;
    let date = this.datePipe.transform(new Date(),'yyyy-MM-dd');
    v.forEach(value => {
      if (value.nextdate.toString()<=date && value.visited==true && value.event==null && value.nextEvent==null){
        this.isVis.push(value);
        this.forTruth = true;
      }
    });
    return this.isVis ;
  }

  str = "";
  calculBetweenDays(date1 : Date):string{
    this.str = "" ;
    var dt = new Date(this.selectNextEvent.visite.event);
    var month = dt.getMonth();
    var year = dt.getFullYear();
    let daysInMonth = new Date(year, month, 0).getDate();
    var Difference_In_Time = new Date(date1).getTime() - new Date(this.selectNextEvent.visite.event).getTime() ;
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (Difference_In_Days > 30){
      this.str = "Ce agent est dans la zone rouge!."

    }

    return this.str ;
  }




  stre = "";
  calculBetweenDayse(date1 : Date):string{
    this.stre = "" ;
    var dt = new Date(this.selectEvent.visite.event);
    var month = dt.getMonth();
    var year = dt.getFullYear();
    new Date(year, month, 0).getDate();
    var Difference_In_Time = new Date(date1).getTime() - new Date(this.selectEvent.visite.event).getTime() ;
    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    if (Difference_In_Days > 30){
      this.stre = "Ce agent est dans la zone rouge!."

    }

    return this.stre ;
  }



  datasourceForAllAgent:any;
  displayColumnsFarAllAgent : string[]=['matsrtb','direction','fonction','agence','nom','prenom','visNonRep','visRep','visited'];
  getAllAgent(){
    this.service.getAgents().subscribe(res=>{
      this.getWithNoNextEvent(res);
      this.getWithNextEvent(res);
      this.getWithRedZone(res);
      this.getWithTruthlyVisited(res);
      this.getWithNoVisited(res);
      this.datasourceForAllAgent = new MatTableDataSource<Agents>(res);
      this.datasourceForAllAgent.paginator = this.paginator ;
    },(error : HttpErrorResponse) => {
      this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'}); });
  }

  jspdfForNoNext : Agents[]=[];
  getWithNoNextEvent(v:Agents[]):Agents[]{
    this.jspdfForNoNext = [];
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent == null && value.visite.visited==false){
        this.jspdfForNoNext.push(value);
      }
    });
    return this.jspdfForNoNext ;
  }

  jspfForNext : Agents[]=[];
  getWithNextEvent(v:Agents[]):Agents[]{
    this.jspfForNext = [] ;
    v.forEach(value => {
      if (value.visite.event != null && value.visite.nextEvent != null && value.visite.visited==false){
        this.jspfForNext.push(value);
      }
    });
    return this.jspfForNext ;
  }

  jspdfForRedZone : Agents[] = [];
  getWithRedZone(v:Agents[]):Agents[]{
    this.jspdfForRedZone = [] ;
    v.forEach(value => {
      var dt = new Date(value.visite.event);
      var month = dt.getMonth();
      var year = dt.getFullYear();
      new Date(year, month, 0).getDate();
      var Difference_In_Time = new Date(value.visite.nextEvent).getTime() - new Date(value.visite.event).getTime() ;
      // To calculate the no. of days between two dates
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      if (value.visite.event != null && value.visite.nextEvent != null){
        if (Difference_In_Days > 30){
          this.jspdfForRedZone.push(value);
        }
      }
    });
    return this.jspdfForRedZone ;
  }

  jspdfForVisited : Agents[] = [] ;
  getWithTruthlyVisited(v:Agents[]):Agents[]{
    this.jspdfForVisited = [] ;
    v.forEach(value => {
      if (value.visite.visited==true){
        this.jspdfForVisited.push(value);
      }
    });
    return this.jspdfForVisited ;
  }

  jspdfForNoVisited : Agents[] = [] ;
  getWithNoVisited(v:Agents[]):Agents[]{
    this.jspdfForNoVisited = [] ;
    v.forEach(value => {
      if (value.visite.visited==false){
        this.jspdfForNoVisited.push(value);
      }
    });
    return this.jspdfForNoVisited ;
  }



  displayedColumns1:string[]=['MATR AGENT','DIRECTION AGENT','FONCTION AGENT','AGENCE AGENT','NOM AGENT','PRENOM AGENT','DATE DE LA VISITE PLANIFIÉE'];
  exportNoNextPdf(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png';
    var data = [];
    this.jspdfForNoNext.forEach(res =>{
      data.push([[res.matsrtb],[res.direction],[res.fonction],[res.agence.nomAgence],[res.nom],[res.prenom],[res.visite.event]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des visites est : ' + this.jspdfForNoNext.length, 14, 83);
    doc.setFontSize(16);
    doc.text('Liste des visites planifiées', 70, 73);
    doc.setFontSize(11);
    //doc.setTextColor(100);
    autoTable(doc,{
      head: [this.displayedColumns1],
      body: data,
      theme: 'striped',
      headStyles :{
        cellPadding: 2,
        fontSize: 6,
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
    doc.save('VisitesPlanifiées.pdf');
  }


  displayedColumns2:string[]=['MATR AGENT','DIRECTION AGENT','FONCTION AGENT','AGENCE AGENT','NOM AGENT','PRENOM AGENT','DATE DE LA VISITE PLANIFIÉE','DATE DE LA VISITE REPLANIFIÉE'];
  exportNextPdf(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png';
    var data = [];
    this.jspfForNext.forEach(res =>{
      data.push([[res.matsrtb],[res.direction],[res.fonction],[res.agence.nomAgence],[res.nom],[res.prenom],[res.visite.event],[res.visite.nextEvent]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des visites est : ' + this.jspfForNext.length, 14, 83);
    doc.setFontSize(16);
    doc.text('Liste des visites replanifiées', 68, 73);
    doc.setFontSize(11);
    //doc.setTextColor(100);
    autoTable(doc,{
      head: [this.displayedColumns2],
      body: data,
      theme: 'striped',
      headStyles :{
        cellPadding: 2,
        fontSize: 5,
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
    doc.save('VisitesReplanifiés.pdf');
  }

  displayedColumns3:string[]=['MATR AGENT','DIRECTION AGENT','FONCTION AGENT','AGENCE AGENT','NOM AGENT','PRENOM AGENT','DATE DE LA VISITE PLANIFIÉE','DATE DE LA VISITE REPLANIFIÉE'];
  exportRedZonePdf(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png';
    var data = [];
    this.jspdfForRedZone.forEach(res =>{
      data.push([[res.matsrtb],[res.direction],[res.fonction],[res.agence.nomAgence],[res.nom],[res.prenom],[res.visite.event],[res.visite.nextEvent]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des visites est : ' + this.jspdfForRedZone.length, 14, 83);
    doc.setFontSize(16);
    doc.text('Liste des visites dans la zone rouge', 60, 73);
    doc.setFontSize(11);
    //doc.setTextColor(100);
    autoTable(doc,{
      head: [this.displayedColumns3],
      body: data,
      theme: 'striped',
      headStyles :{
        cellPadding: 2,
        fontSize: 5,
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
    doc.save('VisitesDanslaZoneRouge.pdf');
  }


  displayedColumns4:string[]=['MATR AGENT','DIRECTION AGENT','FONCTION AGENT','AGENCE AGENT','NOM AGENT','PRENOM AGENT','DEBUT DE LA VISITE','FIN DE LA VISITE'];
  exportTruthlyVisitedPdf(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png';
    var data = [];
    this.jspdfForVisited.forEach(res =>{
      data.push([[res.matsrtb],[res.direction],[res.fonction],[res.agence.nomAgence],[res.nom],[res.prenom],[res.visite.nextdate],[res.visite.lastdate]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des visites est : ' + this.jspdfForVisited.length, 14, 83);
    doc.setFontSize(16);
    doc.text('Liste des agents qui ont effectué leurs visites', 50, 73);
    doc.setFontSize(11);
    //doc.setTextColor(100);
    autoTable(doc,{
      head: [this.displayedColumns4],
      body: data,
      theme: 'striped',
      headStyles :{
        cellPadding: 2,
        fontSize: 5,
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
    doc.save('VisitesEffectuées.pdf');
  }


  displayedColumns5:string[]=['MATR AGENT','DIRECTION AGENT','FONCTION AGENT','AGENCE AGENT','NOM AGENT','PRENOM AGENT','FIN DE LA VISITE'];
  exportTruthlyNotVisitedPdf(){
    var doc = new jsPDF();
    var img = new Image() ;
    img.src = 'assets/srtb.png';
    var data = [];
    this.jspdfForNoVisited.forEach(res =>{
      data.push([[res.matsrtb],[res.direction],[res.fonction],[res.agence.nomAgence],[res.nom],[res.prenom],[res.visite.lastdate]])
    });
    doc.setFontSize(9);
    doc.addImage(img, 'PNG', 79, 6, 0, 0);
    doc.text('Société Régionale de Transport de Bizerte', 11, 8);
    doc.text('Total des visites est : ' + this.jspdfForNoVisited.length, 14, 83);
    doc.setFontSize(16);
    doc.text("Liste des agents qui n'ont pas effectué leurs visites", 45, 73);
    doc.setFontSize(11);
    //doc.setTextColor(100);
    autoTable(doc,{
      head: [this.displayedColumns5],
      body: data,
      theme: 'striped',
      headStyles :{
        cellPadding: 2,
        fontSize: 5,
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
    doc.save('VisitesNonEffectuées.pdf');
  }


  findMedecinByName(name : HTMLInputElement){
    this.applyfilter(name.value);
  }

  applyfilter (filterValue : string){
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.datasourceForAllAgent.filter = filterValue ;

  }


  selectedAgent : Agents ;
  onRowClickAgent(row:any){
    this.selectedAgent = row ;
    this.getAllVisiteSelectedAgent();
    this.mois = true ;
    this.semaine = false ;
    this.aujour = true ;
    this.suiv = false ;
    this.prece = false ;
    window.scrollTo(0,900);
  }

  cancelAgentSelect(){
    this.selectedAgent = null ;
    this.seleAg = null ;
    this.getAllVisite();
    this.mois = true ;
    this.semaine = false ;
    this.aujour = true ;
    this.suiv = false ;
    this.prece = false ;
    window.scrollTo(0,0);
  }

  seleAg : any ;
  highlights(){
    if (this.selectedAgent){
      this.seleAg = this.selectedAgent.matsrtb;
    }
    return this.seleAg ;
  }

  score(){
    setTimeout(()=>{
      window.scrollTo(0,10600);
    },200);
  }

  aujour : boolean = true ;
  suiv : boolean = false ;
  prece : boolean = false ;

  Aujour(){
    this.aujour = true ;
    this.suiv = false ;
    this.prece = false ;
  }

  Suiv(){
    this.aujour = false ;
    this.suiv = true ;
    this.prece = false ;
  }

  Prece(){
    this.aujour = false ;
    this.suiv = false ;
    this.prece = true ;
  }


}
