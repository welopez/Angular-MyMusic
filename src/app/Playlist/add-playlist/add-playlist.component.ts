import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlaylistService } from '@app/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-playlist',
  templateUrl: './add-playlist.component.html',
  styleUrls: ['./add-playlist.component.css']
})
export class AddPlaylistComponent implements OnInit {

  form: FormGroup;
  formSubmitted = false;
  errorMessage: string | null = null;

  constructor(
    private playlistService: PlaylistService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      playlistName: ['',Validators.required],
    });
  }

  ngOnInit(): void {
    this.form.get('playlistName')?.setValidators([Validators.required]);
  }

  // Método para obtener mensajes de error
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es requerido.';
    }

    return '';
  }

  addPlaylist(): void {
    this.formSubmitted = true;

    const val = this.form.value;

    if (val.playlistName) {
      this.playlistService.addPlaylist(val.playlistName)
      .subscribe(
        playlist => {
          console.log("Playlist creada");
          this.goToPlaylist(playlist.id);
        },
        error => {
          console.error("Error al crear playlist:", error);
          this.errorMessage = "Error al crear playlist.";
        }
      );
    }
  }

  goToPlaylist(id: DoubleRange) {
    this.router.navigateByUrl(`/playlists/${id}`);
  }

}
