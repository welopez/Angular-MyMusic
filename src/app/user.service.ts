import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  newUser(email: string, password: string): Observable<HttpResponse<any>> {
    const body = { email: email, password: password };
    return this.http.post(`${environment.apiUrl}/users`, body, { observe: 'response' });
  }
}
