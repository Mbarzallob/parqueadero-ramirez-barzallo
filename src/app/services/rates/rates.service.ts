import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import {
  ParkingSpaceType,
  ParkingSpaceTypeRequest,
  VehicleType,
} from '../../models/parking/block';

@Injectable({
  providedIn: 'root',
})
export class RatesService {
  constructor(private http: HttpClient) {}

  getRates() {
    return this.http.get<Response<ParkingSpaceType[]>>('parking/types');
  }
  updateRate(rate: ParkingSpaceTypeRequest, id: number) {
    return this.http.put<Response<any>>(`parking/types/${id}`, rate);
  }
  addRate(rate: ParkingSpaceTypeRequest) {
    return this.http.post<Response<any>>('parking/types', rate);
  }
  deleteRate(id: number) {
    return this.http.delete<Response<any>>(`parking/types/${id}`);
  }

  getVehicleTypes() {
    return this.http.get<Response<VehicleType[]>>('parking/vehicle/types');
  }
}
