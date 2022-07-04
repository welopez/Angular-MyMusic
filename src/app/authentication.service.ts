import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  login(email:string, password:string ): Observable<HttpResponse<any>> {
    const body = { email: email, password: password };
    return this.http.post(`${environment.apiUrl}/login`, body, { observe: 'response'})
      .pipe(tap(this.setSession));
  }

  private setSession(response: any) {
    const keys = response.headers.keys();
    const headers = keys.map((key: any) =>
    `${key}: ${response.headers.get(key)}`);

    console.table(headers);

    localStorage.setItem('bearer_token', response.headers.get('Authorization'));
  }

  logout() {
       localStorage.removeItem("bearer_token");
  }

  public isLoggedIn(): Boolean {
    if(localStorage.getItem("bearer_token")){
      return true;
    }else{
      return false;
    }
  }

  isLoggedOut() {
       return !this.isLoggedIn();
  }

  getExpiration() {
       const expiration = localStorage.getItem("expires_at");
       if (expiration) {
         const expiresAt = JSON.parse(expiration);
         return moment(expiresAt);
       }
       return null;
  }

}
