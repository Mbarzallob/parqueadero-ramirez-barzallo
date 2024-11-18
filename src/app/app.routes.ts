import { Routes } from '@angular/router';
import { LoginComponent } from './pages/autentication/login/login.component';
import { RegisterComponent } from './pages/autentication/register/register.component';
import { AuthLayoutComponent } from './layots/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layots/main-layout/main-layout.component';
import { authGuard } from './guard/auth/auth.guard';
import { loginGuard } from './guard/login/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/inicio/inicio.component').then(
            (m) => m.InicioComponent
          ),
      },
      {
        path: 'contacto',
        loadComponent: () =>
          import('./pages/home/contacto/contacto.component').then(
            (m) => m.ContactoComponent
          ),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./pages/home/perfil/perfil.component').then(
            (m) => m.PerfilComponent
          ),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/autentication/login/login.component').then(
            (m) => m.LoginComponent
          ),
        //canActivate: [loginGuard],
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/autentication/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        //canActivate: [loginGuard],
      },
    ],
  },
];
