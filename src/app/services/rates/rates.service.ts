import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import { ParkingSpaceType, VehicleType } from '../../models/parking/block';

@Injectable({
  providedIn: 'root',
})
export class RatesService {
  constructor(private http: HttpClient) {}

  getRates() {
    return this.http.get<Response<ParkingSpaceType[]>>('parking/types');
  }

  getVehicleTypes() {
    return this.http.get<Response<VehicleType[]>>('parking/vehicle/types');
  }
}
