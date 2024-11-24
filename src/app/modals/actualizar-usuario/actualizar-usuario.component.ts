import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsersService } from '../../services/users/users.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-actualizar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './actualizar-usuario.component.html',
  styleUrl: './actualizar-usuario.component.scss',
})
export class ActualizarUsuarioComponent implements OnInit {
  userForm = this.fb.group({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(''),
    genero: new FormControl(''),
    telefono: new FormControl(''),
  });

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    console.log('---------------------------');
    this.userForm.patchValue(this.data);
  }
  actualizar() {
    const user = {
      ...this.userForm.getRawValue(),
      id: this.data.id,
      actualizarPerfil: false,
    };
    this.userService.updateUser(user);
  }
}
