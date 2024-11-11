import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RegistrationService} from "../../../services/registration.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {interval, Subscription} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit, OnDestroy {
  user :any;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;

  fieldTextType: boolean;

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


  @ViewChild('btn') btn: any;
  ok:boolean=false

  constructor(public registerService : RegistrationService ,
              private router : Router ,
              private toast: ToastrService,
              private toaster : ToastrService,
              private titleService: Title) { }


  ngOnInit(): void {
    this.titleService.setTitle('Acceuil');
    this.timer=new Date(sessionStorage.getItem('login'))
    this.timer.setHours(this.timer.getHours() + 2);
    if (this.registerService.isUserLoggedIn()){
      this.router.navigate(['/homePage']);
    }
    this.registerService.getUserByMatricule(sessionStorage.getItem('matricule'))
      .subscribe(data => {
        this.user = data;
        if(this.user.image) this.getImage(this.user.image.id)
      }, error => console.log(error));

    this.subscription = interval(1000)
      .subscribe(x => {
        this.getTimeDifference();
      });
  }

  triggerClick() {
    let el: HTMLElement = this.btn.nativeElement as HTMLElement;
    setTimeout(()=> el.click(), 100);
  }

  private getTimeDifference () {
    this.timeDifference = this.timer.getTime() - new  Date().getTime();
    this.calculateTimeUnits(this.timeDifference);
    if(this.timeDifference<=0){
      console.log('stop')
      this.triggerClick()
      this.subscription.unsubscribe()
    }
  }

  private calculateTimeUnits (timeDifference) {
    this.secondsToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
    this.minutesToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
    this.hoursToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
    this.daysToDday = Math.floor((timeDifference) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  getMatricule():string{
    return sessionStorage.getItem('matricule')
  }
  getImage(id:number) {
    //Make a call to Sprinf Boot to get the Image Bytes.
    this.registerService.getImg(id).subscribe(
      res => {
        this.retrieveResonse = res;
        this.base64Data = this.retrieveResonse.picByte;
        this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
      }
    );
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  refreshToken(matricule: string,password: string){
    this.registerService.refreshToken(matricule,password).subscribe(
      data => {console.log("response received");
        this.timer=new Date(sessionStorage.getItem('login'))
        this.timer.setHours(this.timer.getHours() + 2);
        this.subscription = interval(1000)
          .subscribe(x => {
            this.getTimeDifference();
          });
        this.ok=true
        this.toaster.success("Votre session est renouvelée!","CONNEXTION",{positionClass:'toast-bottom-right'});} ,
      error => {console.log("exception occured");
        this.ok=false
        this.toaster.error("Entrer un matricule ou mot de passe valide","ERREUR");}
    )
  }

  logout(){
    this.registerService.logOut();
    this.router.navigate(['/loginPage']);
    this.toast.success("vous etes déconnecté(e)","DECONNEXION");
  }


}
