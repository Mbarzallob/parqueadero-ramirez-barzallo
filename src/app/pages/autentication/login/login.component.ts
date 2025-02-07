import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import {
  KEYS,
  LocalstorageService,
} from '../../../services/localstorage/localstorage.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formLogin: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private localStorage: LocalstorageService,
    private message: NzMessageService
  ) {}

  iniciaSesion() {
    if (this.formLogin.invalid) {
      this.message.error('Completa los campos requeridos');
      return;
    }
    const data = this.formLogin.getRawValue();
    this.authService.login(data.email, data.password).subscribe(
      (user) => {
        this.localStorage.saveValue(KEYS.JWT_KEY, user.data.jwt);
        this.localStorage.saveValue(KEYS.ROL, user.data.rol.toString());
        this.router.navigate(['/']);
      },
      (error) => {
        this.message.error(error);
      }
    );
  }
}
