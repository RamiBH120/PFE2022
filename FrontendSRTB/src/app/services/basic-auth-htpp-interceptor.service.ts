import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";

import {tap} from 'rxjs/operators';
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root'
})
export class BasicAuthHtppInterceptorService implements HttpInterceptor{

  constructor(private router : Router ,
              private toaster : ToastrService,) { }


  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (sessionStorage.getItem('matricule') && sessionStorage.getItem('token')) {
      req = req.clone({
        setHeaders: {
          Authorization: sessionStorage.getItem('token'),
        }
      })
    }

    return next.handle(req).pipe( tap(() => {},
      (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 0) {
            return;
          }
          this.router.navigate(['/loginPage']);
          this.toaster.error("Votre session a expirée!","ERREUR");
        }
      }));

  }
}
