import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

  getPlaylist(id: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${environment.apiUrl}/playlists/${id}`)
      //.pipe(
      //  catchError(this.handleError<Playlist[]>('getPlaylists', []))
      //);
  }

  addPlaylist(playlistName:string): Observable<Playlist> {
    const body = { name: playlistName };
    return this.http.post<Playlist>(`${environment.apiUrl}/playlists`, body);
  }

  changeName(playlistId: string, newName:string): Observable<HttpResponse<any>> {
    const body = { name: newName };
    return this.http.put(`${environment.apiUrl}/playlists/${playlistId}`, body, { observe: 'response'});
  }

  deletePlaylist(id: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${environment.apiUrl}/playlists/${id}`, { observe: 'response'});
  }

  addSong(playlistId: string, songId: string): Observable<HttpResponse<any>> {
    const body = { id: songId };
    return this.http.post(`${environment.apiUrl}/playlists/${playlistId}/songs`, body, { observe: 'response'});
  }

  deleteSong(playlistId: string, songId: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${environment.apiUrl}/playlists/${playlistId}/songs/${songId}`, { observe: 'response'});
  }
}
