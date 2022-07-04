import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Music';

  constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        //this.isLoggedIn = this.authenticationService.isLoggedIn();
    }

    isLoggedIn(): Boolean {
      return this.authenticationService.isLoggedIn();
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
}
