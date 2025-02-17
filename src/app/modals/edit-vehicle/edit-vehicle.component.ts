import { Component, Inject, Input } from '@angular/core';
import {
  Vehicle,
  VehicleRequest,
  VehicleType,
} from '../../models/person/profile';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { PersonService } from '../../services/person/person.service';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-edit-vehicle',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    CommonModule,
    NzButtonModule,
  ],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss',
})
export class EditVehicleComponent {
  vehicleForm!: FormGroup;
  vehicleTypes: VehicleType[] = [];
  userId: number | null = null;
  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private fb: FormBuilder,
    private modal: NzModalRef,
    private personService: PersonService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      type: ['', Validators.required],
      model: ['', Validators.required],
      plate: ['', Validators.required],
    });
    this.userId = this.data.userId;
    this.getTypes();
  }
  getTypes() {
    this.personService.getVehicleTypes().subscribe((api) => {
      this.vehicleTypes = api.data;
      console.log(api.data);
    });
  }

  saveVehicle(): void {
    if (!this.vehicleForm.valid) {
      this.message.error('Por favor, llene todos los campos');
      return;
    }
    if (!this.userId) {
      this.message.error('No se ha encontrado el usuario');
      return;
    }
    const request: VehicleRequest = {
      model: this.vehicleForm.get('model')?.value,
      plate: this.vehicleForm.get('plate')?.value,
      type: this.vehicleForm.get('type')?.value,
    };
    this.personService.addVehicle(request, this.userId).subscribe(
      (response) => {
        this.message.success('Vehículo agregado correctamente');
        this.modal.close(true);
      },
      (error) => {
        this.message.error(error);
      }
    );
  }

  cancel(): void {
    this.modal.close();
  }
}
