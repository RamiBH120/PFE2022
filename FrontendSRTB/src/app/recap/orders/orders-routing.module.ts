import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './components/orders.component';
import {ProfileComponent} from "./components/profile/profile.component";
import {MedecinsComponent} from "./components/medecins/medecins.component";
import {PraticiensComponent} from "./components/praticiens/praticiens.component";
import {BordereauxEnvoiComponent} from "./components/bordereaux-envoi/bordereaux-envoi.component";
import {PharmacieComponent} from "./components/pharmacie/pharmacie.component";
import {ActesmedicauxComponent} from "./components/actesmedicaux/actesmedicaux.component";
import {BordereauxReglementComponent} from "./components/bordereaux-reglement/bordereaux-reglement.component";
import {VisitePeriodiqueComponent,} from "./components/visite/visite-periodique.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [{ path: '', component: OrdersComponent , children:[
    {path:'ProfilePage' , component:ProfileComponent},
    {path:'MedecinPage' , component:MedecinsComponent},
    {path:'PraticienPage' , component:PraticiensComponent},
    {path:'BordereauxEnvoi' , component:BordereauxEnvoiComponent},
    {path:'PharmaciePage' , component:PharmacieComponent},
    {path:'ActeMedicalPage' , component:ActesmedicauxComponent},
    {path:'BordereauxReglement' , component:BordereauxReglementComponent},
    {path:'VisitePage' , component:VisitePeriodiqueComponent},
    {path:'',redirectTo:'Dashboard' , pathMatch:'full'},
    {path:'Dashboard' , component:DashboardComponent},
  ] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
