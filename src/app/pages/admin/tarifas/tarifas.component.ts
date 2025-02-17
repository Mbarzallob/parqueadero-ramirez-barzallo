import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatesService } from '../../../services/rates/rates.service';
import { ParkingSpaceType, VehicleType } from '../../../models/parking/block';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-tarifas',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NzSelectModule],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.scss',
})
export class TarifasComponent implements OnInit {
  rates: ParkingSpaceType[] = [];
  vehicleTypes: VehicleType[] = [];

  constructor(private ratesService: RatesService) {}

  ngOnInit(): void {
    this.getVehicleTypes();

    this.getRates();
  }
  getVehicleTypes() {
    return this.ratesService.getVehicleTypes().subscribe((data) => {
      this.vehicleTypes = data.data;

      console.log(data);
    });
  }

  getRates() {
    this.ratesService.getRates().subscribe((data) => {
      this.rates = data.data;
    });
  }

  updateRate(rate: ParkingSpaceType) {}
}
