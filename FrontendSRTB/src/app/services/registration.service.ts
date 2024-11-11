import { Injectable } from '@angular/core';
import { User } from "../model/user/user";
import {map, Observable} from "rxjs";
import { environment } from "../../environments/environment";
import {HttpClient, HttpHeaders, HttpRequest} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  Name : string | undefined ;
  user = new User();
  // BASE_PATH: 'http://localhost:8081'
  constructor(private httpClient : HttpClient) { }

  authenticate(matricule, password) {
    return this.httpClient.post<any>(`${environment.hostUrl}/authenticate`,{matricule,password}).pipe(
      map(
        userData => {
          sessionStorage.setItem('login',new Date().toDateString()+' '+new Date().toTimeString());
          sessionStorage.setItem('matricule',matricule);
          let tokenStr= 'Bearer '+userData.token;
          sessionStorage.setItem('token', tokenStr);
          return userData;
        }
      )

    );
  }


  refreshToken(matricule, password) {
    const headers= new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*')
      .set('isRefreshToken', 'true ');
    return this.httpClient.post<any>(`${environment.hostUrl}/refreshtoken`, {matricule, password },{'headers':headers}).pipe(
      map(
        userData => {
          sessionStorage.setItem('login',new Date().toDateString()+' '+new Date().toTimeString());
          let tokenStr= 'Bearer '+userData.token;
          sessionStorage.setItem('token', tokenStr);
          return userData;
        }
      )
    );
  }

  isUserLoggedIn():boolean {
    let user = sessionStorage.getItem('matricule')
    //console.log(!(user === null))
    return !(user === null)
  }

  logOut() {
    sessionStorage.removeItem('login')
    sessionStorage.removeItem('matricule')
    sessionStorage.removeItem('token')
  }

  updateUser(matricule : string, user: User): Observable<User> {
    return this.httpClient.put<User>(`${environment.hostUrl}/updateUser?matricule=${matricule}`, user);
  }

  updateUserwithImg(matricule : string,imgId:number, user: User): Observable<User> {
    return this.httpClient.put<User>(`${environment.hostUrl}/updateUserImg?matricule=${matricule}&imgId=${imgId}`, user);
  }
  resetPassword(token : string,password:string): Observable<any> {
    return this.httpClient.post<any>(`${environment.hostUrl}/reset?token=${token}&password=${password}`, { token,password });
  }
  resetToken(token : string): Observable<any> {
    return this.httpClient.post<any>(`${environment.hostUrl}/resetToken?token=${token}`, { token });
  }


  forgetPassword(email:string):Observable<any>{
    return this.httpClient.post(`${environment.hostUrl}/forgot?email=${email}`, { email })
  }

  getUserByMatricule(matricule : string): Observable<User> {
    return this.httpClient.get<User>(`${environment.hostUrl}/getUserByMatricule?matricule=${matricule}`);
  }
  getUserByToken(token : string): Observable<User> {
    return this.httpClient.get<User>(`${environment.hostUrl}/getUserByToken?token=${token}`);
  }
  public ExistUserByMatricule(matricule : string) : Observable<Boolean>{
    return this.httpClient.get<Boolean>(`${environment.hostUrl}/existUserByMatricule?matricule=${matricule}`);
  }
  public ExistUserByToken(token : string) : Observable<Boolean>{
    return this.httpClient.get<Boolean>(`${environment.hostUrl}/existUserByToken?token=${token}`);
  }

  uploadImg(file):Observable<any>{
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', file, file.name);
    return this.httpClient.post(`${environment.hostUrl}/image/upload`, uploadImageData);
  }

  getImg(id : number): Observable<any> {
    return this.httpClient.get(`${environment.hostUrl}/image/get/${id}`);
  }

  getAllImg(): Observable<any> {
    return this.httpClient.get(`${environment.hostUrl}/image/getImageAll`);
  }

  deleteImage(id : number) : Observable<void> {
    return this.httpClient.get<void>(`${environment.hostUrl}/image/delete/${id}`);
  }
}
