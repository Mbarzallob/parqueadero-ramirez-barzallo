import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsersService } from '../../services/users/users.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-actualizar-usuario',
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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ActualizarUsuarioComponent>
  ) {}

  ngOnInit(): void {
    this.userForm.patchValue(this.data);
  }
  async actualizar() {
    const user = {
      ...this.userForm.getRawValue(),
      id: this.data.id,
      actualizarPerfil: false,
    };

    // await this.userService.updateUser(user);
    alert('Usuario actualizado correctamente');

    this.dialogRef.close();
  }
}
