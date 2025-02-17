export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  fechaNacimiento: Date;
  phoneNumber: string;
}

export interface Vehicle {
  id: number;
  plate: string;
  model: string;
  vehicleType: VehicleType;
}

export interface VehicleType {
  id: number;
  type: string;
  size: number;
}

export interface VehicleRequest {
  plate: string;
  model: string;
  type: number;
}
