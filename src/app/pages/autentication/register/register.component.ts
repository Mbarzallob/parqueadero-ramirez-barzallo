import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { an } from '@fullcalendar/core/internal-common';
import { Gender } from '../../../models/person/gender';
import { PersonService } from '../../../services/person/person.service';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, NzSelectModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  generos: Gender[] = [];
  loadings: any = {
    generos: false,
  };

  formRegister: FormGroup = new FormGroup({
    email: new FormControl(''),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    identification: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    genderId: new FormControl(null, [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.obtenerGeneros();
  }
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private personService: PersonService,
    private messageService: NzMessageService
  ) {}

  obtenerGeneros() {
    this.loadings.generos = true;
    this.personService
      .getGenders()
      .pipe(finalize(() => (this.loadings.generos = false)))
      .subscribe(
        (response) => {
          console.log(response);
          this.generos = response.data;
          this.formRegister.controls['genderId'].setValue(this.generos[0].id);
        },
        (error) => {
          this.messageService.error(error);
        }
      );
  }

  registrarse() {
    console.log(this.formRegister.getRawValue());
    if (this.formRegister.invalid) {
      this.messageService.error('Complete los campos obligatorios', {
        nzPauseOnHover: true,
      });
      return;
    }

    this.authService
      .register(this.formRegister.value)
      .pipe(finalize(() => {}))
      .subscribe(
        (response) => {
          this.messageService.success('Usuario registrado correctamente');
          this.router.navigate(['/auth/login']);
        },
        (error) => {
          this.messageService.error(error);
        }
      );
  }
}
