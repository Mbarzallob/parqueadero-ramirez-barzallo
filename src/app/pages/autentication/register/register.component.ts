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
import { RouterModule } from '@angular/router';
import { User } from '../../../models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  error: string = '';
  user: User = {
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    genero: '',
    fechaNacimiento: undefined,
    fechaRegistro: undefined,
    activo: false,
    rol: '',
    id: null,
    actualizarPerfil: null,
  };
  formRegister: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    telefono: new FormControl(''),
    genero: new FormControl(''),
    fechaNacimiento: new FormControl(''),
  });

  constructor(private authService: AuthenticationService) {}

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
    this.user.email = data.email;
    this.user.password = data.password;
    this.user.nombre = data.nombre;
    this.user.apellido = data.apellido;
    this.user.telefono = data.telefono;
    this.user.genero = data.genero;
    this.user.fechaNacimiento = data.fechaNacimiento;
    this.authService.registerWithUserAndPass(this.user).subscribe(
      (resp) => {},
      (error) => {
        this.error = this.getErrorMessage(error.code);
      }
    );
  }
  registrarseConGoogle() {
    this.authService.registerWithGoogle().subscribe(
      (resp) => {},
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
