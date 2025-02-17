import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import { ParkingSpace } from '../../models/parking/block';
import { Contract, ContractRequest } from '../../models/parking/contract';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  constructor(private http: HttpClient) {}

  getParkingSpaces(blockId: number) {
    return this.http.get<Response<ParkingSpace[]>>('parking/block/' + blockId);
  }

  getParkingSpace(id: number) {
    return this.http.get<Response<ParkingSpace>>('parking/' + id);
  }

  addContract(contract: ContractRequest) {
    return this.http.post<Response<any>>('contract', contract);
  }

  getContrats(parkingId: number) {
    return this.http.get<Response<Contract[]>>('contract/' + parkingId);
  }
}
