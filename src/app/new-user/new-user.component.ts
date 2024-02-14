import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/authentication.service';
import { UserService } from '@app/user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  form: FormGroup;
  formSubmitted = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private userService: UserService,
    private router: Router,
  ) {
    // redirect to home if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordFormatValidator]],
      password2: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  // Comprobar que la contraseña cumpla el formato
  passwordFormatValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z\d$@$!%*?& ]|[^ ]){8,15}$/;

    if (!passwordRegex.test(password)) {
      return { 'passwordBadFormat': true };
    }

    return null;
  }

  // Comprobar que las contraseñas coincidan
 passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
   const password = control.get('password')?.value;
   const password2 = control.get('password2')?.value;

   if (password2 != null && password2 != "" && password !== password2) {
     control.get('password2')?.setErrors({ passwordMismatch: true });
     return { 'passwordMismatch': true };
   }

   return null;
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

    if (control?.hasError('passwordBadFormat')) {
      return 'La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un dígito y tener una longitud entre 8 y 15 caracteres.';
    }

    if (control?.hasError('passwordMismatch')) {
      return 'Las contraseñas no coinciden.';
    }

    return '';
  }

  newUser() {
    this.formSubmitted = true; // Set the flag to true when the form is submitted

    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const val = this.form.value;

    if (val.email && val.password && val.password == val.password2) {
      this.userService.newUser(val.email, val.password)
      .subscribe(
        () => {
          console.log("Usuario creado");
          this.router.navigate(['/login'], { state: { registrationSuccess: true } });
        },
        error => {
          console.error("Error al crear usuario:", error);
          this.errorMessage = "Error al crear usuario. " + error.error;
        }
      );
    }
  }
}
