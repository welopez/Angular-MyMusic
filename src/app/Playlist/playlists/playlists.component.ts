import { Component, OnInit } from '@angular/core';
import { Playlist } from '@app/playlist';
import { PlaylistService } from '@app/playlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

  playlists: Playlist[] = [];
  errorMessage: string | null = null;

  constructor(private playlistService: PlaylistService, private router: Router) { }

  ngOnInit(): void {
    this.getPlaylists();
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

}
