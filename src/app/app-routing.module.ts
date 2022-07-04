import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LoginComponent } from './login/login.component';
import { PlaylistsComponent } from './playlists/playlists.component';

const routes: Routes = [
    { path: '', redirectTo: '/playlists', pathMatch: 'full' }, //{ path: '',component: PlaylistsComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'playlists', component: PlaylistsComponent, canActivate: [AuthGuard] },

    // otherwise redirect to home
    { path: '**', redirectTo: '/playlists' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
