import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  isLogged$ = this.authService.isLogged();
  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
  esAdmin() {
    if (!this.isLogged$) {
      return false;
    }
    return this.authService.obtenerRol() == 'admin';
  }
  isMenuOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
