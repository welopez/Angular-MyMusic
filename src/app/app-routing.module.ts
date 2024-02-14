import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LoginComponent } from './login/login.component';
import { PlaylistsComponent } from './Playlist/playlists/playlists.component';
import { AddPlaylistComponent } from './Playlist/add-playlist/add-playlist.component';
import { EditPlaylistComponent } from './Playlist/edit-playlist/edit-playlist.component';
import { SongsComponent } from './songs/songs.component';
import { NewUserComponent } from './new-user/new-user.component';

const preTitle = 'MyMusic | '
const routes: Routes = [
    { path: '', redirectTo: '/playlists', pathMatch: 'full' }, //{ path: '',component: PlaylistsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, title: preTitle + 'Iniciar Sesión' },
    { path: 'user/new', component: NewUserComponent, title: preTitle + 'Nuevo Usuario' },
    { path: 'playlists', component: PlaylistsComponent, canActivate: [AuthGuard], title: preTitle + 'Playlists' },
    { path: 'playlists/new', component: AddPlaylistComponent, canActivate: [AuthGuard], title: preTitle + 'Nueva Playlist' },
    { path: 'playlists/:id', component: EditPlaylistComponent, canActivate: [AuthGuard] , title: preTitle + 'Editar Playlist'},
    { path: 'songs', component: SongsComponent, canActivate: [AuthGuard] , title: preTitle + 'Canciones'},
    // otherwise redirect to home
    { path: '**', redirectTo: '/playlists' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
