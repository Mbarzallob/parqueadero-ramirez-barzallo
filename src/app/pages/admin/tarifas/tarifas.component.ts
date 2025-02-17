import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatesService } from '../../../services/rates/rates.service';
import {
  ParkingSpaceType,
  ParkingSpaceTypeRequest,
  VehicleType,
} from '../../../models/parking/block';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-tarifas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzSelectModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
  ],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.scss',
})
export class TarifasComponent implements OnInit {
  rates: ParkingSpaceType[] = [];
  vehicleTypes: VehicleType[] = [];
  newRate: ParkingSpaceTypeRequest = {
    dayPrice: 0,
    hourPrice: 0,
    monthPrice: 0,
    vehicleType: 1,
    weekPrice: 0,
  };

  constructor(
    private ratesService: RatesService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getVehicleTypes();
    this.getRates();
  }

  getVehicleTypes() {
    this.ratesService.getVehicleTypes().subscribe((data) => {
      this.vehicleTypes = data.data;
    });
  }

  getRates() {
    this.ratesService.getRates().subscribe((data) => {
      this.rates = data.data;
    });
  }

  addRate(rate: ParkingSpaceTypeRequest) {
    if (!rate.vehicleType) {
      return;
    }
    this.ratesService.addRate(rate).subscribe(() => {
      this.getRates();
      this.newRate = {
        dayPrice: 0,
        hourPrice: 0,
        monthPrice: 0,
        vehicleType: this.vehicleTypes[0].id,
        weekPrice: 0,
      };
      this.message.success('Tarifa añadida correctamente');
    });
  }

  deleteRate(rateId: number) {
    this.ratesService.deleteRate(rateId).subscribe(() => {
      this.getRates();
      this.message.success('Tarifa eliminada correctamente');
    });
  }

  updateRate(rate: ParkingSpaceType) {
    const rateId = rate.id;
    const request: ParkingSpaceTypeRequest = {
      dayPrice: rate.priceDay,
      hourPrice: rate.priceHour,
      monthPrice: rate.priceMonth,
      vehicleType: rate.vehicleTypeId,
      weekPrice: rate.priceWeek,
    };
    this.ratesService.updateRate(request, rateId).subscribe(() => {
      this.getRates();
      this.message.success('Tarifa actualizada correctamente');
    });
  }
}
