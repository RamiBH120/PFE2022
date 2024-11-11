import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./Guard/auth.guard";
import {NotfoundComponent} from "./notfound/notfound.component";
import {ResetComponent} from "./reset/reset/reset.component";


const routes: Routes = [
  { path:'' ,redirectTo:'/loginPage' ,pathMatch:'full' },
  { path:'loginPage' , component:LoginComponent },
  { path:'resetPage' , component:ResetComponent },
  { path: 'homePage', loadChildren: () => import('./recap/orders/orders.module').then(m => m.OrdersModule) , canActivate:[AuthGuard]},
  { path:"**" , component:NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
