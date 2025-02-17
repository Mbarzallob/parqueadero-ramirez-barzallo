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
import { environment } from '../environment';
import { Response } from '../models/generic/response';
import {
  KEYS,
  LocalstorageService,
} from '../services/localstorage/localstorage.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private localStorage: LocalstorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      url: environment.apiUrl + req.url,
    });
    const token = this.localStorage.getValue(KEYS.JWT_KEY);
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          console.log(event);
          if (event.body) {
            const body = event.body;
            if (!body.success) {
              if ((body.message as String).includes('expirado')) {
                this.localStorage.clear();
                this.router.navigate(['/']);
              }
              throw new Error(body.message);
            }
          }
        }
        return event;
      }),
      catchError((error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        throw error;
      })
    );
  }
}
