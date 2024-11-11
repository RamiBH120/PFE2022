import {Component, OnDestroy, OnInit, VERSION, ViewChild} from '@angular/core';
import {RegistrationService} from "../services/registration.service";
import {User} from "../model/user/user";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {FormGroup, NgModel} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  user = new User();
  msg = null;
  msgerr = null;
  msgMat=""
  fieldTextType: boolean;
  emailrp: string;
  err:boolean
  networkStatus: any;
  networkStatus$: Subscription = Subscription.EMPTY;

  constructor(private registrationService : RegistrationService ,
              private router : Router,
              private toaster : ToastrService,
              private titleService: Title) { }

  ngOnInit(): void {
    this.register_tab_GUID()
    this.titleService.setTitle('Se connecter');
    this.checkNetworkStatus();
    if(this.registrationService.isUserLoggedIn()){
      this.registrationService.logOut();
    }
  }

  register_tab_GUID() {
    // detect local storage available
    if (typeof (Storage) !== "undefined") {
      // get (set if not) tab GUID and store in tab session
      if (sessionStorage["tabGUID"] == null) sessionStorage["tabGUID"] = this.tab_GUID();
      var guid = sessionStorage["tabGUID"];

      // add eventlistener to local storage
      window.addEventListener("storage", this.storage_Handler, false);

      // set tab GUID in local storage
      localStorage["tabGUID"] = guid;
    }
  }

  storage_Handler(e) {
    // if tabGUID does not match then more than one tab and GUID
    if (e.key == 'tabGUID') {
      if (e.oldValue != e.newValue) alert("Un autre onglet de l'application est déjà ouvert!.");
    }
  }

  tab_GUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  ngOnDestroy(): void {
    this.networkStatus$.unsubscribe();
  }

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        console.log('status', status);
        this.networkStatus = status;
      });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  //new
  loginUserToken(){
    this.registrationService.authenticate(this.user.matricule,this.user.password).subscribe(
      data => {console.log("response received");
        this.router.navigate(['/homePage']);
        this.toaster.success("Vous etes connecté(e)","CONNEXTION",{positionClass:'toast-bottom-right'}); } ,
      error => {console.log("exception occured");
        this.msgerr = "Matricule ou mot de passe incorrecte";
        this.msg=null
        this.toaster.error("Entrer un matricule ou Mot de passe valide","ERREUR");}
    )
  }

  resetForm(form: FormGroup) {
    form.reset()
  }

  checkMailandMat(email: NgModel, matricule: NgModel,form: FormGroup) {
    this.registrationService.getUserByMatricule(matricule.value).subscribe(
      (response :any) => {
        if(response){
          this.registrationService.ExistUserByMatricule(matricule.value).subscribe(value => {
            if(value){
              if(email.value==response.email && value){
                if(response.tokenCreationDate==null){
                this.msgerr=null
                this.msg="Succés! Verifier votre courriel."
                this.registrationService.forgetPassword(email.value).subscribe(value1 => {
                })
                this.resetForm(form)
                }
                if(response.tokenCreationDate!=null){
                  this.msgerr="Une requête mail a été déjà envoyée."
                  this.msg=null
                }
              }
              else {
                this.msg=null
                this.msgerr="Matricule ou adresse mail incorrecte."
              }
            }
            else {
              this.msg=null
              this.msgerr='Matricule ou adresse mail incorrecte.'
            }
          })

        }
        else {
          this.msg=null
          this.msgerr='Matricule ou adresse mail incorrecte.'
        }
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
      })
  }
}
