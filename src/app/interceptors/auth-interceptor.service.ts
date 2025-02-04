import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('pipis');
    const token = localStorage.getItem('token'); // Obtiene el token almacenado
    let modifiedReq = req;

    if (token) {
      modifiedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`, // Agrega el token a las cabeceras
        },
      });
    }

    // Manejo de errores
    return next.handle(modifiedReq).pipe(
      catchError((error) => {
        if (error.status === 401) {
          // Si la respuesta es 401 (no autorizado), redirigir al login
          this.router.navigate(['/login']);
        }
        throw error;
      })
    );
  }
}
