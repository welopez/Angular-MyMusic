import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PlaylistsComponent } from './Playlist/playlists/playlists.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth.interceptor';
import { AddPlaylistComponent } from './Playlist/add-playlist/add-playlist.component';
import { EditPlaylistComponent } from './Playlist/edit-playlist/edit-playlist.component';
import { SongsComponent } from './songs/songs.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewUserComponent } from './new-user/new-user.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PlaylistsComponent,
    AddPlaylistComponent,
    EditPlaylistComponent,
    SongsComponent,
    NewUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FontAwesomeModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
