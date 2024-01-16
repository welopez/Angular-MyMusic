import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Playlist } from '@app/playlist';
import { PlaylistService } from '@app/playlist.service';
import { Song } from '@app/song';
import { SongService } from '@app/song.service';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {
  songs: Song[] = [];
  playlists: Playlist[] = [];
  userEmail: String;
  form: FormGroup;
  limpiarFiltro: Boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  faSearch = faMagnifyingGlass;
  faXmark = faXmark;

  constructor(private playlistService: PlaylistService, private songService: SongService, private fb: FormBuilder) {
    this.userEmail = localStorage.getItem('user_email') ?? '';
    this.form = this.fb.group({
      authorName: [""]
    });
  }

  ngOnInit(): void {
    this.getSongs();
    this.getPlaylists();
  }

  getPlaylists(): void {
    this.playlistService.getPlaylists().subscribe(playlists => {
      this.playlists = playlists.filter(playlist => playlist.userEmail === this.userEmail);
    });
  }

  getSongs(): void {
    this.songService.getSongs().subscribe(songs => this.songs = songs, error => this.errorMessage = error.message);
    this.form.get('authorName')?.setValue('');
    this.limpiarFiltro = false;
  }

  getSongsByAuthor(): void {
    if (this.form.valid) {
      const authorName = this.form.get('authorName')?.value;
      console.log("authorName:" + authorName);
      if (authorName == null || authorName == ""){
        this.getSongs();
      }else{
        this.songService.getSongsByAuthor(authorName).subscribe(songs => this.songs = songs, error => this.errorMessage = error.message);
        this.limpiarFiltro = true;
      }
    }
  }

  addSong(song: Song, playlist: Playlist): void {
    if(playlist != null && song != null){
      this.playlistService.addSong(playlist.id.toString(), song.id.toString()).subscribe(
        () => {
          console.log("Se agrego la cancion con id: " + song.id + " a la playlist con id: " + playlist.id);
          this.successMessage = "Se agregó la canción " + song.name + " a " + playlist.name;
          this.getPlaylists();
        },
        error => {
          console.error("Error al agregar cancion: ", error);
          this.errorMessage = error.error;
        }
      );
    }else{
      this.errorMessage = "Error en el pasaje de parametros";
    }
  }

  isSongInPlaylist(songId: DoubleRange, playlist: any): boolean {
    return playlist.songs.some((song: { id: DoubleRange; }) => song.id === songId);
  }
  
  closeErrorMessage() {
    this.errorMessage = null;
  }

  closeSuccessMessage() {
    this.successMessage = null;
  }

}
