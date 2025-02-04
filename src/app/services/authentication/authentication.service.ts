import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private httpClient: HttpClient) {}

  login(username: string, password: string) {
    return this.httpClient.post<any>(
      'http://localhost:8080/WSParkingRamirezBarzallo/api/auth/login',
      {
        username,
        password,
      }
    );
  }
  register(data: any) {
    return this.httpClient.post<any>(
      'http://localhost:8080/api/auth/register',
      data
    );
  }
}
