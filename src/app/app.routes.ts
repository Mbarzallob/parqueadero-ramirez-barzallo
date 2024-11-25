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
      {
        path: 'admin/usuarios',
        loadComponent: () =>
          import('./pages/home/perfil/perfil.component').then(
            (m) => m.PerfilComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'admin/parking-lots',
        loadComponent: () =>
          import('./pages/admin/parking-lots/parking-lots.component').then(
            (m) => m.ParkingLotsComponent
          ),
        canActivate: [authGuard],
      },
      {
        path: 'admin/block-management',
        loadComponent: () =>
          import(
            './pages/admin/block-management/block-management.component'
          ).then((m) => m.BlockManagementComponent),
      },
      {
        path: 'admin/parking-lot',
        loadComponent: () =>
          import('./pages/admin/parking-lot/parking-lot.component').then(
            (m) => m.ParkingLotComponent
          ),
      },
      {
        path: 'admin/tarifas',
        loadComponent: () =>
          import('./pages/admin/tarifas/tarifas.component').then(
            (m) => m.TarifasComponent
          ),
      },
      {
        path: 'admin/users',
        loadComponent: () =>
          import('./pages/admin/users/users.component').then(
            (m) => m.UsersComponent
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
