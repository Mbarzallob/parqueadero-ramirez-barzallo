import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PersonService } from '../../../services/person/person.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Profile } from '../../../models/person/profile';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    fechaNacimiento: new FormControl(null as Date | null),
  });
  constructor(
    private personService: PersonService,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {
    this.getProfile();
  }

  getProfile() {
    this.personService.getProfile().subscribe((response) => {
      this.form.setValue({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        fechaNacimiento: response.data.fechaNacimiento,
      });
    });
  }
  actualizarInfo() {
    if (this.form.invalid) {
      this.message.error('Complete todos los campos');
      return;
    }
    console.log(this.form.getRawValue() as Profile);
    this.personService
      .updateProfile(this.form.getRawValue() as Profile)
      .subscribe(
        (response) => {
          this.message.success('Perfil actualizado');
        },
        (error) => {
          this.message.error(error);
        }
      );
  }
}
