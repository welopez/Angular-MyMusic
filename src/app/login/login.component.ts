import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../authentication.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    // redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {

  }

  login() {
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const val = this.form.value;

    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
      .subscribe(
        () => {
          console.log("User is logged in");
          this.router.navigate([this.returnUrl]);
          //this.router.navigateByUrl('/');
        }
      );
    }
  }

}
