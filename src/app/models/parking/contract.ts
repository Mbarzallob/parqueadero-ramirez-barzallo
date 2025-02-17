import { Vehicle } from '../person/profile';
import { ParkingSpace } from './block';

export interface ContractRequest {
  startDate: Date;
  endDate: Date;
  parkingId: number;
  typeId: string;
  vehicleId: number;
}

export interface Contract {
  id: number;
  active: boolean;
  startDate: Date;
  finishDate: Date;
  vehicle: Vehicle;
  contractType: ContractType;
  parkingSpace: ParkingSpace;
}

export interface ContractType {
  id: string;
  name: string;
}

export interface Ticket {
  id: number;
  startDate: Date;
  finishDate: Date;
  parkingSpace: ParkingSpace;
  vehicle: Vehicle;
  active: boolean;
}

export interface TicketRequest {
  startDate: Date | string;
  endDate: Date | null;
  parkingId: number;
  vehicleId: number;
}
