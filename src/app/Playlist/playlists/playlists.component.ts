import { Component, OnInit } from '@angular/core';
import { Playlist } from '@app/playlist';
import { PlaylistService } from '@app/playlist.service';
import { Router } from '@angular/router';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;
  faPlus = faPlus;

  constructor(private playlistService: PlaylistService, private router: Router) { }

  ngOnInit(): void {
    this.getPlaylists();
    this.successMessage = history.state.deletePlaylistMsg ?? null;
  }

  getPlaylists(): void {
    this.playlistService.getPlaylists().subscribe(playlists => this.playlists = playlists);
  }

  goToPlaylist(id: DoubleRange) {
    this.router.navigateByUrl(`/playlists/${id}`);
  }

  addPlaylist(): void {
    this.router.navigateByUrl('/playlists/new');
  }

  handleHover(event: MouseEvent): void {
    const targetElement = event.currentTarget as HTMLElement;
    const imgElement = targetElement.querySelector('.card-img') as HTMLImageElement;

    imgElement.style.opacity = '0.3';
  }

  handleMouseOut(event: MouseEvent): void {
    const targetElement = event.currentTarget as HTMLElement;
    const imgElement = targetElement.querySelector('.card-img') as HTMLImageElement;

    imgElement.style.opacity = '0.6';
    imgElement.style.transition = 'opacity 0.3s ease';
  }

  closeErrorMessage() {
    this.errorMessage = null;
  }

  closeSuccessMessage() {
    this.successMessage = null;
  }
}
