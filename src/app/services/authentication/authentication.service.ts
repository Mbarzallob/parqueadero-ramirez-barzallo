import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterRequest } from '../../models/auth/register';
import { Response } from '../../models/generic/response';
import { LoginResponse } from '../../models/auth/login';
import {
  KEYS,
  LocalstorageService,
} from '../localstorage/localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private httpClient: HttpClient,
    private localStorage: LocalstorageService
  ) {}

  login(username: string, password: string) {
    return this.httpClient.post<Response<LoginResponse>>('auth/login', {
      username,
      password,
    });
  }
  register(data: RegisterRequest) {
    return this.httpClient.post<Response<any>>('auth/register', data);
  }
  logout() {
    this.localStorage.clear();
  }
  isAdmin() {
    return this.localStorage.getValue(KEYS.ROL) === '1';
  }
  isEmpleado() {
    return (
      this.localStorage.getValue(KEYS.ROL) === '1' ||
      this.localStorage.getValue(KEYS.ROL) === '2'
    );
  }
  isLogged() {
    return this.localStorage.getValue(KEYS.JWT_KEY) !== null;
  }
}
