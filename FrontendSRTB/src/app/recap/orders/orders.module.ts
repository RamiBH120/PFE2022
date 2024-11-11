import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './components/orders.component';
import { MedecinsComponent } from './components/medecins/medecins.component';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {ToastrModule} from "ngx-toastr";
import { PraticiensComponent } from './components/praticiens/praticiens.component';
import { BordereauxEnvoiComponent } from './components/bordereaux-envoi/bordereaux-envoi.component';
import { MatDatepickerModule } from "@angular/material/datepicker";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule} from "@angular/material/core";
import { PharmacieComponent } from './components/pharmacie/pharmacie.component';
import { ActesmedicauxComponent } from './components/actesmedicaux/actesmedicaux.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {ScrollingModule} from "@angular/cdk/scrolling";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatRadioModule} from "@angular/material/radio";
import {BordereauxReglementComponent} from "./components/bordereaux-reglement/bordereaux-reglement.component";
import {MatSortModule} from "@angular/material/sort";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MY_DATE_FORMATS, VisitePeriodiqueComponent} from "./components/visite/visite-periodique.component";
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {FlatpickrModule} from "angularx-flatpickr";
import {CalendarModule, DateAdapter} from "angular-calendar";
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateModule} from '@angular/material-moment-adapter';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {MatButtonModule} from "@angular/material/button";
import {MatMenuModule} from "@angular/material/menu";


@NgModule({
  declarations: [
    OrdersComponent,
    MedecinsComponent,
    PraticiensComponent,
    BordereauxEnvoiComponent,
    PharmacieComponent,
    ActesmedicauxComponent,
    BordereauxReglementComponent,
    VisitePeriodiqueComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    ToastrModule.forRoot(), // ToastrModule added
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    ScrollingModule,
    MatToolbarModule,
    MatRadioModule,
    MatSortModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatDatepickerModule,
    MatNativeDateModule,
    MomentDateModule,
    MatButtonModule,
    MatMenuModule,

  ],
  providers: [
    DatePipe,
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }},
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})

export class OrdersModule { }
