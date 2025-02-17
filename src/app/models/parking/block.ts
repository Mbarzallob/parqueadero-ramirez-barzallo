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
