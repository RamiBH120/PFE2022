import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {RegistrationService} from "../../../../services/registration.service";
import {User} from "../../../../model/user/user";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {FormGroup, NgForm, NgModel} from "@angular/forms";
import * as _ from 'lodash';
import {HttpErrorResponse} from "@angular/common/http";
import { fromEvent, merge, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  id : number = 0;
  matricule : string = "";
  user :any;

  msg = null;
  msgerr = null;

  networkStatus: any;
  networkStatus$: Subscription = Subscription.EMPTY;

  password1;

  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResonse: any;
  message: string;
  imageName: any;

  imageError: string;
  isImageSaved: boolean = false;
  cardImageBase64: string;

  constructor(private registerService : RegistrationService , private router : Router ,
              private toaster : ToastrService,private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle('Profile');
    this.checkNetworkStatus();
    this.registerService.getUserByMatricule(sessionStorage.getItem('matricule'))
      .subscribe(data => {
        this.user = data;
        if(this.user.image) this.getImage(this.user.image.id)
      }, (error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});})
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
        this.networkStatus = status;
      });
  }

  //Gets called when the user selects an image
  public onFileChanged(event) {
    //Select File
    this.selectedFile = event.target.files[0];
    const URL = window.URL || window.webkitURL;
    const Img = new Image();

    const filesToUpload = (event.target.files);
    Img.src = URL.createObjectURL(filesToUpload[0]);

    Img.onload = (e: any) => {
      const height = e.path[0].height;
      const width = e.path[0].width;

      console.log(height,width);
    }
  }

  fileChangeEvent(fileInput: any) {
    this.selectedFile = fileInput.target.files[0];
    this.imageError = null;
    if (fileInput.target.files && this.selectedFile) {
      // Size Filter Bytes
      const max_size = 20971520;
      const allowed_types = ['image/png', 'image/jpeg'];
      const max_height = 256;
      const max_width = 256;

      if (this.selectedFile.size > max_size) {
        this.imageError =
          'Maximum taille autorisé est : ' + max_size / 1000 + 'MB';

        return false;
      }

      if (!_.includes(allowed_types, this.selectedFile.type)) {
        this.imageError = 'Les formats autorisés sont : ( JPG | PNG )';
        return false;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          const img_height = rs.currentTarget['height'];
          const img_width = rs.currentTarget['width'];


          if (img_height > max_height && img_width > max_width) {
            this.imageError =
              'Résolution maximale dépassée ' +
              max_height +
              '*' +
              max_width +
              'px';
            return false;
          } else {
            const imgBase64Path = e.target.result;
            this.cardImageBase64 = imgBase64Path;
            this.isImageSaved = true;
            // this.previewImagePath = imgBase64Path;
          }
        };
      };

      reader.readAsDataURL(fileInput.target.files[0]);
      setTimeout(()=>{
        this.registerService.getUserByMatricule(sessionStorage.getItem('matricule'))
          .subscribe(data => {
            this.user = data;
          }, error => console.log(error));
      },100);
    }
  }
  @ViewChild('takeInput', {static: false})
  InputVar: ElementRef;
  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
    this.imageError=null;
    this.InputVar.nativeElement.value = "";
  }

  //Gets called when the user clicks on submit to upload the image
  onUpload(addForm : NgForm) {
    this.registerService.uploadImg(this.selectedFile).subscribe((response) => {
          if (response.status === 200) {
            this.message = 'image chargée avec succès';
          } else {
            this.message = "image n'est pas charger avec succès";
          }

        setTimeout(()=>{
          this.registerService.getAllImg().subscribe(reponse=>{
            let id = Math.max.apply(Math, reponse.map(function(o) { return o.id; }));
          this.registerService.updateUserwithImg(this.user.matricule,id, addForm.value).subscribe((response: User) => {
            if (reponse.length>1) {
              let idMin = Math.min.apply(Math, reponse.map(function (o) {return o.id;}));
              this.registerService.deleteImage(idMin);
              this.getImage(id);
              this.toaster.success("modification de l'image de " + this.user.username + " avec succès", "SUCCES", {positionClass: 'toast-bottom-right'});
              window.location.reload();
            }
          })
        });
        },150);

        }
      );
  }

  onUploadImgUpdate(addForm : NgForm) {
    this.user.password=this.password1
    let imag : any ;
    if (this.user.imageId != null){
      this.user.image.id = imag ;
    }

    if (this.isImageSaved == false){
      this.registerService.updateUser(this.user.matricule,addForm.value).subscribe(
        (response: User) => {
          this.toaster.success("modification d'un utilisateur avec succès", "SUCCES", {positionClass: 'toast-bottom-right'});
          window.location.reload();
        },
        (error : HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
        }
      );
    }else if (this.isImageSaved == true){
      this.registerService.uploadImg(this.selectedFile).subscribe((response) => {
        this.registerService.updateUserwithImg(this.user.matricule,response.id, addForm.value).subscribe((response: User) => {
            this.registerService.deleteImage(response.id);
            this.getImage(response.id);
            this.toaster.success("modification d'un utilisateur avec succès", "SUCCES", {positionClass: 'toast-bottom-right'});
            window.location.reload();
        },  (error : HttpErrorResponse) => {
          this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
        })

      });
    }



  }

  //Gets called when the user clicks on retieve image button to get the image from back end
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

  checkPass(passwordA: NgModel, passwordB: NgModel):boolean {
    return passwordA.value==passwordB.value
  }
  resetForm(form: FormGroup) {
    form.reset()
  }

  checkMailandMat(email: NgModel, matricule: NgModel) {
    this.registerService.getUserByMatricule(matricule.value).subscribe(
      (response :any) => {
        if(response){
          this.registerService.ExistUserByMatricule(matricule.value).subscribe(value => {
            if(value){
              if(email.value==response.email && value){
                if(response.tokenCreationDate==null) {
                  this.msgerr = null
                  this.msg = "Succès! Verifier votre courriel."
                  this.registerService.forgetPassword(email.value).subscribe(value1 => {
                  })
                }
                else {
                  this.msgerr="Une requête mail a été déjà envoyée."
                  this.msg=null
                }
              }
              else {
                this.msg=null
                this.msgerr="Adresse mail incorrecte."
              }
            }
            else {
              this.msg=null
              this.msgerr='Adresse mail incorrecte.'
            }
          })

        }
        else {
          this.msg=null
          this.msgerr='Adresse mail incorrecte.'
        }
      },(error : HttpErrorResponse) => {
        this.toaster.error("Le serveur a répondu avec une ERREUR", "ERREUR", {positionClass: 'toast-top-right'});
      })
  }
}

