import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  JWT_KEY: string = 'jwt';
  constructor() {}
  saveValue(key: KEYS, value: string) {
    localStorage.setItem(key, value);
  }
  getValue(key: KEYS): string | null {
    return localStorage.getItem(key);
  }
}
export enum KEYS {
  JWT_KEY = 'jwt',
  ROL = 'rol',
}
