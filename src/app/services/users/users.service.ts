import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import { User } from '../../models/person/user/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<Response<User[]>>('user');
  }
}
