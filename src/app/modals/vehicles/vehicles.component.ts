import { Component, Inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { PersonService } from '../../services/person/person.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Vehicle } from '../../models/person/profile';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { EditVehicleComponent } from '../edit-vehicle/edit-vehicle.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-vehicles',
  imports: [CommonModule, NzTableModule, NzButtonModule, NzIconModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss',
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  canSelect: boolean = false;
  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private personService: PersonService,
    private message: NzMessageService,
    private nzModalService: NzModalService,
    private modal: NzModalRef,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.canSelect = this.data.canSelect;
    this.getVehicles();
  }

  getVehicles() {
    const validType = this.route.snapshot.queryParams['vehicleType'];
    console.log(validType);
    this.personService.getVehicles(this.data.user.id).subscribe(
      (response) => {
        if (validType) {
          this.vehicles = response.data.filter(
            (vehicle) => vehicle.vehicleType.id === Number(validType)
          );
        } else {
          this.vehicles = response.data;
        }
        console.log('------------');
        console.log(response.data);
      },
      (error) => {
        this.message.error(error);
      }
    );
  }
  openCreateModal() {
    this.nzModalService
      .create({
        nzContent: EditVehicleComponent,
        nzFooter: null,
        nzTitle: 'Agregar vehículo',
        nzData: {
          userId: this.data.user.id,
        },
      })
      .afterClose.subscribe((result) => {
        this.getVehicles();
      });
  }
  deleteVehicle(vehicle: Vehicle) {
    this.personService.deleteVehicle(vehicle.id).subscribe(
      (response) => {
        this.message.success('Vehículo eliminado');
        this.getVehicles();
      },
      (error) => {
        this.message.error(error.message);
      }
    );
  }
  select(vehicle: Vehicle) {
    this.modal.close(vehicle);
  }
}
