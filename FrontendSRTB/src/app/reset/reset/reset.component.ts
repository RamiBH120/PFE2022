import { Component, OnInit, OnDestroy } from '@angular/core';
import {NgModel} from "@angular/forms";
import {RegistrationService} from "../../services/registration.service";
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";

import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit, OnDestroy {

  password1;
  password2;
  fieldTextType: boolean;
  fieldTextType2: boolean;
  token: string;
  isValidToken: boolean;
  user:any

  private subscription: Subscription;

  public dateNow = new Date();
  public dDay = new Date('May 24 2022 12:10:00');
  public timer:Date;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute  = 60;

  public timeDifference;
  public secondsToDday;
  public minutesToDday;
  public hoursToDday;
  public daysToDday;

  constructor(private registrationService : RegistrationService,
              private route: ActivatedRoute,
              private router : Router,
              private toaster : ToastrService,
              private titleService: Title) { }

  private getTimeDifference () {
    if(this.isValidToken){
    this.timeDifference = this.timer.getTime() - new  Date().getTime();
    this.allocateTimeUnits(this.timeDifference);}
    if(this.timeDifference<=0){
      this.isValidToken=false
      this.registrationService.resetToken(this.token).subscribe(() => {
        console.log('stop')
        this.subscription.unsubscribe()
        this.toaster.error("Mot de passe ne peut pas être changé","ERREUR");
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
      })
    }
  }

  private allocateTimeUnits (timeDifference) {
    this.secondsToDday = ('0'+Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute)).slice(-2);
    this.minutesToDday = ('0'+Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute)).slice(-2);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngOnInit(): void {

    this.titleService.setTitle('Changer mot de passe');
    this.route.queryParams
      .subscribe(params => {
          this.token = params['token'];
        }
      );

    this.registrationService.ExistUserByToken(this.token).subscribe(
      (response :boolean) => {
        this.isValidToken = response == true;
        if (this.isValidToken){
          this.registrationService.getUserByToken(this.token).subscribe(value => {
            this.timer=new Date(value.tokenCreationDate)
            this.timer.setMinutes(this.timer.getMinutes() + 15);
          })
        }
      },(error : HttpErrorResponse) => {
        alert(error)
        this.isValidToken=false;
      }
    );
      this.subscription = interval(1000)
        .subscribe(x => {
          this.getTimeDifference();
        });
     //
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  checkPass(passwordA: NgModel, passwordB: NgModel):boolean {
    return passwordA.value==passwordB.value
  }

  resetPass(password: NgModel) {
    this.registrationService.resetPassword(this.token,password.value).subscribe(
      () => {
        this.router.navigate(['/loginPage']);
        this.toaster.success("Mot de passe changé","CHANGEMENT",{positionClass:'toast-bottom-right'});
  },(error : HttpErrorResponse) => {
        this.router.navigate(['/loginPage']);
        //this.toaster.error("Entrer un matricule ou Mot de passe exacte","ERREUR");
        this.toaster.success("Mot de passe changé","CHANGEMENT",{positionClass:'toast-bottom-right'});
    })
  }
}
