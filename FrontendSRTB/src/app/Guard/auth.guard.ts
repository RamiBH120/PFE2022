import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {RegistrationService} from "../services/registration.service";

@Injectable({
  providedIn: 'root'
})



export class AuthGuard implements CanActivate {
 msg = false ;
  constructor(private registerService : RegistrationService , private router : Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let isAuthentificated = this.registerService.isUserLoggedIn();
    if(isAuthentificated){
     this.msg = true;
      return this.msg;
    } else {
      this.router.navigateByUrl("/loginPage");
      this.msg = false ;
      return this.msg;
    }


  }

}
