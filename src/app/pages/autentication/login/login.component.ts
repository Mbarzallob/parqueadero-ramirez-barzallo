import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formLogin: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  iniciaSesion() {
    const data = this.formLogin.getRawValue();
    const user: any = {
      email: data.email,
      password: data.password,
    };
    this.authService.signIn(user).subscribe(
      (user) => {
        console.log(user);
        this.router.navigate(['/']);
      },
      (error) => {
        console.log(error);
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
      }
    );
  }
}
