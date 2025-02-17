import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import { FilterParkingSpace, ParkingSpace } from '../../models/parking/block';
import {
  Contract,
  ContractRequest,
  ContractType,
  Ticket,
  TicketRequest,
} from '../../models/parking/contract';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  constructor(private http: HttpClient) {}

  getParkingSpaces(blockId: number, filter: FilterParkingSpace) {
    return this.http.post<Response<ParkingSpace[]>>(
      'parking/block/' + blockId,
      filter
    );
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
  getAllTickets() {
    return this.http.get<Response<Ticket[]>>('contract/ticket');
  }

  addTicket(ticket: TicketRequest) {
    return this.http.post<Response<any>>('contract/ticket', ticket);
  }
  endTicket(id: number) {
    return this.http.put<Response<any>>('contract/ticket/' + id + '/end', {});
  }

  getParkingSpacesAll() {
    return this.http.get<Response<ParkingSpace[]>>('parking');
  }

  getContractTypes() {
    return this.http.get<Response<ContractType[]>>('contract/types');
  }
}
