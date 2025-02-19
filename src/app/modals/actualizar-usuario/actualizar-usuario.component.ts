import { Component, Inject, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { UsersService } from '../../services/users/users.service';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Gender } from '../../models/person/gender';
import { PersonService } from '../../services/person/person.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Profile } from '../../models/person/profile';
import { User } from '../../models/person/user/user';
import { format } from 'date-fns';

@Component({
  selector: 'app-actualizar-usuario',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NzSelectModule,
    NzInputModule,
    CommonModule,
    NzButtonModule,
    NzDatePickerModule,
  ],
  templateUrl: './actualizar-usuario.component.html',
  styleUrl: './actualizar-usuario.component.scss',
})
export class ActualizarUsuarioComponent implements OnInit {
  userForm = this.fb.group({
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    fechaNacimiento: new FormControl(null as Date | null),
    telefono: new FormControl(''),
    correo: new FormControl(''),
  });

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private message: NzMessageService,
    private modalRef: NzModalRef,
    @Inject(NZ_MODAL_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.pathUser();
  }

  pathUser() {
    const usuario: User = this.data.user;

    if (usuario) {
      const datosUsuario = {
        nombre: usuario.firstName || '',
        apellido: usuario.lastName || '',
        fechaNacimiento: usuario.birthDate,
        telefono: usuario.phone || '',
        correo: usuario.email || '',
      };

      this.userForm.patchValue(datosUsuario);
    }
  }

  async actualizar() {
    if (this.userForm.invalid) {
      this.message.error('Complete los campos');
      return;
    }

    const profile: Profile = {
      email: this.userForm.get('correo')?.value || '',
      firstName: this.userForm.get('nombre')?.value || '',
      lastName: this.userForm.get('apellido')?.value || '',
      phoneNumber: this.userForm.get('telefono')?.value || '',
      fechaNacimiento:
        this.userForm.get('fechaNacimiento')?.value || new Date(),
    };

    this.personService
      .updateUserProfile(profile, (this.data.user as User).id)
      .subscribe(
        (api) => {
          this.message.success('Usuario actualizado con éxito');
          this.modalRef.close(true);
        },
        (error) => {
          this.message.error('Error al actualizar el usuario' + error);
        }
      );
  }
}
