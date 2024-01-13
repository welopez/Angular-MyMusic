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
  formSubmitted = false;
  errorMessage: string | null = null;

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
    // Añadir validadores para los campos requeridos
    this.form.get('email')?.setValidators([Validators.required, Validators.email]);
    this.form.get('password')?.setValidators([Validators.required]);
  }

  // Método para obtener mensajes de error
  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);

    if (control?.hasError('required')) {
      return 'Este campo es requerido.';
    }

    if (control?.hasError('email')) {
      return 'Ingrese un correo electrónico válido.';
    }

    return '';
  }

  login() {
    this.formSubmitted = true; // Set the flag to true when the form is submitted

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
        },
        error => {
          console.error("Error al iniciar sesión:", error);
          this.errorMessage = "Error al iniciar sesión. Por favor, verifica tus credenciales.";
        }
      );
    }
  }

}
