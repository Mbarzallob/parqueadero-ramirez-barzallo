import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ParkingService } from '../../../services/parking/parking.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  form = new FormGroup({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    telefono: new FormControl(''),
    genero: new FormControl(''),
    fechaNacimiento: new FormControl(''),
  });
  constructor(
    private authService: AuthenticationService,
    private p: ParkingService
  ) {}
  ngOnInit(): void {
    this.authService.getInformationUser().subscribe((user) => {
      this.form.setValue({
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        genero: user.genero,
        fechaNacimiento: user.fechaNacimiento,
      });
    });
  }
  actualizarInfo() {
    const formValue = this.form.getRawValue();
    const user = {
      ...formValue,
      fechaNacimiento: formValue.fechaNacimiento
        ? new Date(formValue.fechaNacimiento)
        : null,
    };
    this.authService.updateUserInfo(user);
  }
}
