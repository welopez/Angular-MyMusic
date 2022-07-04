import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Playlist } from './playlist';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getPlaylists(): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${environment.apiUrl}/playlists`)
      //.pipe(
      //  catchError(this.handleError<Playlist[]>('getPlaylists', []))
      //);
  }

}
