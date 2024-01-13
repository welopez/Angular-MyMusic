import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnDestroy {
  title = 'My Music';
  userEmail: string;
  private isLoggedInSubscription: Subscription;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.userEmail = localStorage.getItem('user_email') ?? '';
    this.isLoggedInSubscription = this.authenticationService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        if (isLoggedIn) {
          this.userEmail = localStorage.getItem('user_email') ?? '';
        }
      }
    );
  }

  ngOnDestroy() {
    this.isLoggedInSubscription.unsubscribe();
  }

  isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn();
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
