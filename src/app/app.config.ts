import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'parqueadero-ramirez-barzallo',
        appId: '1:703233743032:web:f56d1bccbc950be711bc4d',
        storageBucket: 'parqueadero-ramirez-barzallo.firebasestorage.app',
        apiKey: 'AIzaSyCeRJievoh46DkoJVYm0J9B2l0upCsas7I',
        authDomain: 'parqueadero-ramirez-barzallo.firebaseapp.com',
        messagingSenderId: '703233743032',
        measurementId: 'G-STZVLSWM54',
      })
    ),
  ],
};
