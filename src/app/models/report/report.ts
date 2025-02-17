export interface TicketFilter {
  active: boolean | null;
  parkingSpace: number | null;
  vehicle: number | null;
  startDate: Date | null;
  finishDate: Date | null;
}

export interface ContractFilter {
  active: boolean | null;
  parkingSpace: number | null;
  vehicle: number | null;
  startDate: Date | null;
  finishDate: Date | null;
  contractType: string | null;
}
