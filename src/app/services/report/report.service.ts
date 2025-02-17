import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContractFilter, TicketFilter } from '../../models/report/report';
import { Response } from '../../models/generic/response';
import { Contract, Ticket } from '../../models/parking/contract';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getTickets(filter: TicketFilter) {
    return this.http.post<Response<Ticket[]>>('contract/ticket/report', filter);
  }

  getContracts(filter: ContractFilter) {
    return this.http.post<Response<Contract[]>>('contract/report', filter);
  }
}
