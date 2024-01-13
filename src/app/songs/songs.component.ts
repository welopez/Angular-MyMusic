import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Playlist } from '@app/playlist';
import { PlaylistService } from '@app/playlist.service';
import { Song } from '@app/song';
import { SongService } from '@app/song.service';

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

  addSong(songId: DoubleRange, playlistId: DoubleRange): void {
    if(playlistId != null && songId != null){
      this.playlistService.addSong(playlistId.toString(), songId.toString()).subscribe(
        () => {
          console.log("Se agrego la cancion con id: " + songId + " a la playlist con id: " + playlistId);
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

}
