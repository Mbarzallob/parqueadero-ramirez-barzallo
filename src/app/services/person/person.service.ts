import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import { Gender } from '../../models/person/gender';
import {
  Profile,
  Vehicle,
  VehicleRequest,
  VehicleType,
} from '../../models/person/profile';

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

  updateUserProfile(profile: Profile, userId: number) {
    return this.http.put<Response<any>>(`profile/${userId}`, profile);
  }

  getVehicles(userId: number) {
    return this.http.get<Response<Vehicle[]>>('person/vehicle/' + userId);
  }

  getVehicleTypes() {
    return this.http.get<Response<VehicleType[]>>('parking/vehicle/types');
  }

  addVehicle(vehicle: VehicleRequest, userId: number) {
    return this.http.post<Response<any>>('person/vehicle/' + userId, vehicle);
  }

  deleteVehicle(vehicleId: number) {
    return this.http.delete<Response<any>>('person/vehicle/' + vehicleId);
  }
}
