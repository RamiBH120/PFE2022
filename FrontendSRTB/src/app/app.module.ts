import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageModule } from 'ngx-webstorage';
import {ProfileComponent} from "./recap/orders/components/profile/profile.component";
import { NotfoundComponent } from "./notfound/notfound.component";
import {MatSliderModule} from "@angular/material/slider";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {ToastrModule} from "ngx-toastr";
import {CalendarModule, DateAdapter} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/date-fns";
import {BasicAuthHtppInterceptorService} from "./services/basic-auth-htpp-interceptor.service";
import { ResetComponent } from './reset/reset/reset.component';
import {NgbModalModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
    ProfileComponent,
    NotfoundComponent,
    AppComponent,
    LoginComponent,
    ResetComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxWebstorageModule.forRoot(),
    BrowserAnimationsModule,
    MatSliderModule,
    MatTableModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatIconModule,
    ToastrModule.forRoot(), // ToastrModule added
    NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [{provide:HTTP_INTERCEPTORS, useClass:BasicAuthHtppInterceptorService, multi:true}],
  exports: [
    ProfileComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
