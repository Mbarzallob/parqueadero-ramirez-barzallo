import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpInterceptorFn,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          if (event.body) {
            const body = event.body;
            if (!body.ok) {
              throw new Error(body.message);
            }
          }
        }
        return event;
      }),
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
