import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Playlist } from '@app/playlist';
import { PlaylistService } from '@app/playlist.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faTrashCan, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-playlist',
  templateUrl: './edit-playlist.component.html',
  styleUrls: ['./edit-playlist.component.css']
})
export class EditPlaylistComponent implements OnInit {
  playlistId: string | null = null;
  playlist: Playlist | null = null;
  cambioNombre: boolean = false;
  form: FormGroup;
  formSubmitted = false;
  errorMessage: string | null = null;
  @ViewChild('playlistNameInput', { static: false }) playlistNameInput!: ElementRef;
  faTrash = faTrashCan;
  faPen = faPenToSquare;
  faPlus = faPlus;

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      playlistName: ["", Validators.required]
    });
  }

  ngOnInit(): void {
    // Accede al valor del parámetro 'id'
    this.playlistId = this.route.snapshot.paramMap.get('id');
    console.log("PlaylistId: " + this.playlistId);
    this.cargarPlaylist();
  }

  cargarPlaylist(): void {
    if(this.playlistId != null){
      this.playlistService.getPlaylist(this.playlistId).subscribe(
        playlist => {
          this.playlist = playlist;
          this.form = this.fb.group({
            playlistName: [this.playlist?.name, Validators.required]
          });
        },
        error => {
          console.error("Error al crear playlist:", error);
          this.errorMessage = "Error al obtener datos de la playlist.";
        });
      }else{
        console.error("Error al obtener id de playlist.");
        this.errorMessage = "No se pudo obtener el id de la playlist."
      }

    }

    puedeEditar(): boolean {
      return (localStorage.getItem("user_email") == this.playlist?.userEmail);
    }

    iniciarCambioNombre(): void {
      if(this.puedeEditar()){
        this.cambioNombre = true;
        setTimeout(() => {
          this.setFocusOnInput();
        });
      }
    }

    setFocusOnInput() {
      if (this.playlistNameInput) {
        this.playlistNameInput.nativeElement.focus();
      }
    }

    onInputBlur() {
      // Verifica si el formulario es válido antes de realizar el submit
      if (this.form.valid) {
        this.changeName(); // Llama al método para cambiar el nombre
      }
    }

    changeName(): void {
      const val = this.form.value;

      if(this.playlistId != null){
        if(val.playlistName && val.playlistName != this.playlist!.name){
          this.formSubmitted = true;

          this.playlistService.changeName(this.playlistId, val.playlistName).subscribe(
            () => {
              this.playlist!.name = val.playlistName;
              console.log("Se cambió el nombre de la playlist a " + val.playlistName);
            },
            error => {
              console.error("Error al cambiar el nombre de la playlist: ", error);
              this.errorMessage = "Error al cambiar el nombre de la playlist.";
            }
          );
        }
      }else{
        this.errorMessage = "Error al obtener id del playlist.";
      }
      this.cambioNombre = false;
    }

    deletePlaylist(): void {
      if(this.playlistId != null){
        this.playlistService.deletePlaylist(this.playlistId).subscribe(
          () => {
            console.log("Playlist eliminada");
            //this.router.navigate([this.returnUrl]);
            this.router.navigateByUrl('/');
          },
          error => {
            console.error("Error al eliminar playlist:", error);
            this.errorMessage = "Error al eliminar playlist.";
          }
        );
      }else{
        this.errorMessage = "Error al obtener id del playlist.";
      }
    }

    addSong(songId: string): void {
      if(this.playlistId != null){
        this.playlistService.addSong(this.playlistId, songId).subscribe(
          () => {
            this.cargarPlaylist();
            console.log("Se agrego la cancion con id " + songId);
            //this.router.navigate([this.returnUrl]);
            //this.router.navigateByUrl('/');
          },
          error => {
            console.error("Error al agregar cancion: ", error);
            this.errorMessage = error.error;
          }
        );
      }else{
        this.errorMessage = "Error al obtener id del playlist.";
      }
    }

    deleteSong(songId: DoubleRange): void {
      if(this.playlistId != null){
        this.playlistService.deleteSong(this.playlistId, songId.toString()).subscribe(
          () => {
            // Encuentra la posición de la canción en el arreglo por su ID
            const index = this.playlist?.songs.findIndex(song => song.id === songId);
            // Si se encuentra, elimina la canción del arreglo
            if (index !== undefined && index !== -1) {
              this.playlist?.songs.splice(index, 1);
            }
            console.log("Se eliminó la cancion con id " + songId);
            //this.router.navigate([this.returnUrl]);
            //this.router.navigateByUrl('/');
          },
          error => {
            console.error("Error al eliminar cancion: ", error);
            this.errorMessage = "Error al eliminar cancion de la playlist.";
          }
        );
      }else{
        this.errorMessage = "Error al obtener id del playlist.";
      }
    }

    // Método para obtener mensajes de error
    getErrorMessage(controlName: string): string {
      const control = this.form.get(controlName);

      if (control?.hasError('required')) {
        return 'Este campo es requerido.';
      }

      return '';
    }

    goToSongs() {
      this.router.navigateByUrl(`/songs`);
    }

  }
