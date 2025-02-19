export interface Block {
  id: number;
  name: string;
}

export interface ParkingSpaceType {
  id: number;
  priceHour: number;
  priceDay: number;
  priceWeek: number;
  priceMonth: number;
  vehicleTypeId: number;
  vehicleType: VehicleType;
}

export interface ParkingSpaceTypeRequest {
  hourPrice: number;
  dayPrice: number;
  weekPrice: number;
  monthPrice: number;
  vehicleType: number;
}

export interface VehicleType {
  id: number;
  type: string;
  size: string;
}

export interface ParkingSpace {
  id: number;
  occupied: boolean;
  parkingSpaceType: ParkingSpaceType;
}

export interface FilterParkingSpace {
  startDate: Date | null;
  endDate: Date | null;
  vehicleType: number | null;
  forTicket: boolean | null | undefined;
}
