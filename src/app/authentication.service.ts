import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<HttpResponse<any>> {
    const body = { email: email, password: password };
    return this.http.post(`${environment.apiUrl}/login`, body, { observe: 'response' })
    .pipe(
      tap(response => this.setSession(response, email)),
      tap(() => this.isLoggedInSubject.next(true))
    );
  }

  private setSession(response: any, email: string) {
    const keys = response.headers.keys();
    const headers = keys.map((key: any) =>
    `${key}: ${response.headers.get(key)}`);

    console.table(headers);

    localStorage.setItem('bearer_token', response.headers.get('Authorization'));
    localStorage.setItem('user_email', email);
  }

  logout() {
    localStorage.removeItem('bearer_token');
    localStorage.removeItem('user_email');
    this.isLoggedInSubject.next(false);
  }

  public isLoggedIn(): boolean {
    return !!localStorage.getItem('bearer_token');
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return moment(expiresAt);
    }
    return null;
  }
}
