import { Component, OnInit } from '@angular/core';
import { ParkingService } from '../../../services/parking/parking.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { timestampToDate } from '../../../utils/firebase-helper';
import { RouterModule } from '@angular/router';
import {
  Block,
  FilterParkingSpace,
  ParkingSpace,
} from '../../../models/parking/block';
import { BlocksService } from '../../../services/blocks/blocks.service';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { VehicleType } from '../../../models/person/profile';
import { PersonService } from '../../../services/person/person.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-parking-lots',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NzSelectModule,
    NzDatePickerModule,
    NzSpinModule,
    NzFormModule,
    NzButtonModule,
  ],
  templateUrl: './parking-lots.component.html',
  styleUrl: './parking-lots.component.scss',
})
export class ParkingLotsComponent implements OnInit {
  blocksOriginal: Block[] = []; // Lista completa de bloques
  selectedBlock: Block | null = null; // Bloque seleccionado
  parkingSpaces: ParkingSpace[] = []; // Espacios de estacionamiento del bloque seleccionado
  isLoading: boolean = false; // Bandera para indicar carga de datos
  isLoadingParkingSpaces: boolean = false; // Bandera para indicar carga de datos
  filter: FilterParkingSpace = {
    startDate: null,
    endDate: null,
    vehicleType: null,
    forTicket: false,
  }; // Filtro dinámico
  vehicleTypes: VehicleType[] = [];

  clearFilters() {
    this.filter = {
      startDate: null,
      endDate: null,
      vehicleType: null,
      forTicket: false,
    };
  }
  constructor(
    private parkingService: ParkingService,
    private blockService: BlocksService,
    private message: NzMessageService,
    private personService: PersonService
  ) {}

  ngOnInit() {
    this.getBlocks();
    this.getVehicleType();
  }

  getVehicleType() {
    this.personService.getVehicleTypes().subscribe((response) => {
      this.vehicleTypes = response.data;
    });
  }
  getBlocks() {
    this.isLoading = true;
    this.blockService
      .getBlocks()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        this.blocksOriginal = response.data;
        if (this.blocksOriginal.length > 0) {
          this.selectedBlock = this.blocksOriginal[0];
          this.onBlockChange();
        }
      });
  }

  // Manejar el cambio de bloque desde el dropdown
  onBlockChange() {
    console.log(this.selectedBlock);
    if (!this.selectedBlock) {
      this.message.error('Seleccione un bloque');
      return;
    }
    this.isLoadingParkingSpaces = true;
    this.parkingService
      .getParkingSpaces(this.selectedBlock!.id, this.filter)
      .pipe(finalize(() => (this.isLoadingParkingSpaces = false)))
      .subscribe((api) => {
        this.parkingSpaces = api.data;
      });
  }
}
