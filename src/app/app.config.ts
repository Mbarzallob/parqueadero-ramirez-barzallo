import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"parqueadero-ramirez-barzallo","appId":"1:703233743032:web:f56d1bccbc950be711bc4d","storageBucket":"parqueadero-ramirez-barzallo.appspot.com","apiKey":"AIzaSyCeRJievoh46DkoJVYm0J9B2l0upCsas7I","authDomain":"parqueadero-ramirez-barzallo.firebaseapp.com","messagingSenderId":"703233743032","measurementId":"G-STZVLSWM54"})), provideAuth(() => getAuth())]
};
