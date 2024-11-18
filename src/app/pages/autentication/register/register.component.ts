import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { signOut } from '@firebase/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  error: string = '';
  user: any;
  formRegister: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    telefono: new FormControl(''),
    genero: new FormControl(''),
    fechaNacimiento: new FormControl(''),
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'La dirección de correo ya está en uso.',
      'auth/invalid-email': 'El correo electrónico no es válido.',
      'auth/weak-password': 'La contraseña es demasiado débil.',
    };
    return errorMessages[errorCode] || 'Ocurrió un error inesperado.';
  }

  registrarse() {
    const data = this.formRegister.getRawValue();

    this.authService.registerWithUserAndPass(data).subscribe(
      (resp) => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.error = this.getErrorMessage(error.code);
      }
    );
  }
  registrarseConGoogle() {
    this.authService.registerWithGoogle().subscribe(
      (resp) => {
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
        this.error = this.getErrorMessage(error.code);
      }
    );
  }
  cierraSesion() {
    this.authService.logout();
  }
}
