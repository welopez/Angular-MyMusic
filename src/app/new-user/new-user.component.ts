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
      email: ['',Validators.required],
      password: ['',Validators.required],
      password2: ['',Validators.required]
    });
    // Agregar la validación personalizada
    this.form.setValidators(this.passwordMatchValidator);
  }

  ngOnInit(): void {
    // Añadir validadores para los campos requeridos
    this.form.get('email')?.setValidators([Validators.required, Validators.email]);
    this.form.get('password')?.setValidators([Validators.required]);
    this.form.get('password2')?.setValidators([Validators.required]);
  }

  // Comprobar que las contraseñas coincidan
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const password2 = control.get('password2');

    if (password && password2 && password.value !== password2.value) {
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
          this.router.navigateByUrl('/login');
        },
        error => {
          console.error("Error al crear usuario:", error);
          this.errorMessage = "Error al crear usuario. Por favor, intente nuevamente.";
        }
      );
    }
  }
}
