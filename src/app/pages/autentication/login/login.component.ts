import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import {
  KEYS,
  LocalstorageService,
} from '../../../services/localstorage/localstorage.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
  formLogin: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private localStorage: LocalstorageService
  ) {}

  iniciaSesion() {
    const data = this.formLogin.getRawValue();
    this.authService.login(data.email, data.password).subscribe(
      (user) => {
        this.localStorage.saveValue(KEYS.JWT_KEY, user.data.jwt);
        this.localStorage.saveValue(KEYS.ROL, user.data.rol);
        this.router.navigate(['/']);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  registrarseConGoogle() {
    // this.authService.registerWithGoogle().subscribe(
    //   (resp) => {
    //     this.router.navigate(['/']);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
}
