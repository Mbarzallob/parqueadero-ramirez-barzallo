import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  KEYS,
  LocalstorageService,
} from '../../services/localstorage/localstorage.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const localStorageService = inject(LocalstorageService);
  const router = inject(Router);
  const jwt = localStorageService.getValue(KEYS.JWT_KEY);
  if (jwt) {
    router.navigate(['/']);
    return false;
  }
  return true;
};
