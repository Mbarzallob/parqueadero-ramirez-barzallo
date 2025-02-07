import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import { Gender } from '../../models/person/gender';
import { Profile } from '../../models/person/profile';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  constructor(private http: HttpClient) {}

  getGenders() {
    return this.http.get<Response<Gender[]>>('person/gender');
  }

  getProfile() {
    return this.http.get<Response<Profile>>('profile');
  }

  updateProfile(profile: Profile) {
    return this.http.put<Response<any>>('profile', profile);
  }
}
