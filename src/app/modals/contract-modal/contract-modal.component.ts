import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { User } from '../../models/person/user/user';
import { UsersService } from '../../services/users/users.service';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { SelectUserComponent } from '../select-user/select-user.component';
import { ParkingSpace } from '../../models/parking/block';
import { ParkingService } from '../../services/parking/parking.service';
import { el } from '@fullcalendar/core/internal-common';
import { Vehicle } from '../../models/person/profile';
import { ContractRequest } from '../../models/parking/contract';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-contract-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzButtonModule,
    NzAlertModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzInputModule,
    NzTableModule,
    NzModalModule,
    NzIconModule,
    NzGridModule,
  ],
  templateUrl: './contract-modal.component.html',
  styleUrl: './contract-modal.component.scss',
})
export class ContractModalComponent implements OnInit {
  selectedOption: string = ''; // Opción seleccionada (hora, día, semana, mes)
  startDate: string = ''; // Fecha inicial en formato yyyy-MM-dd
  endDate: string = ''; // Fecha final en formato yyyy-MM-dd
  ocupiedDates: any[] = []; // Fechas ocupadas
  startTime: string = ''; // Hora inicial
  endTime: string = ''; // Hora final
  blockId: number | null = null;
  parkingSpaceId: number | null = null;
  currentDate: string = ''; // Fecha mínima para inputs de tipo date
  currentTime: string = ''; // Hora mínima para inputs de tipo time
  errorMessage: string = '';
  step: number = 0;
  finalData: any;
  searchQuery: string = '';
  selectedVehicle: Vehicle | null = null;
  price: number = 0;
  horarios: any[] = [];
  parkingSpace: ParkingSpace | null = null;
  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private route: ActivatedRoute,
    private modal: NzModalRef,
    private modalService: NzModalService,
    private parkingService: ParkingService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    const now = new Date();

    // Inicializar restricciones mínimas
    this.currentDate = formatDate(now, 'yyyy-MM-dd', 'en-US');
    this.currentTime = formatDate(now, 'HH:mm', 'en-US');

    // Inicializar fechas y horas
    this.startDate = formatDate(this.data.date, 'yyyy-MM-dd', 'en-US');
    this.endDate = this.startDate;

    const startHour = now.getHours();
    const endHour = startHour + 1;
    this.startTime = this.formatTime(startHour, now.getMinutes());
    this.endTime = this.formatTime(endHour, now.getMinutes());
    this.ocupiedDates = this.data.ocupiedDates;
    this.horarios = this.data.horarios;
    this.route.queryParams.subscribe((params) => {
      this.blockId = Number(params['blockId']);
      this.parkingSpaceId = Number(params['parkingId']);
      this.parkingService
        .getParkingSpace(this.parkingSpaceId)
        .subscribe((api) => {
          this.parkingSpace = api.data;
        });
    });
  }

  selectOption(option: string): void {
    if (this.selectedOption === option) return;
    this.errorMessage = '';
    this.selectedOption = option;

    const start = new Date(this.data.date);

    switch (option) {
      case 'dia':
        this.startDate = formatDate(start, 'yyyy-MM-dd', 'en-US');
        const dayEnd = new Date(start); // Crear copia independiente
        dayEnd.setDate(dayEnd.getDate() + 1);
        this.endDate = formatDate(dayEnd, 'yyyy-MM-dd', 'en-US');
        break;

      case 'semana':
        this.startDate = formatDate(start, 'yyyy-MM-dd', 'en-US');
        const weekEnd = new Date(start); // Crear copia independiente
        weekEnd.setDate(weekEnd.getDate() + 7);
        this.endDate = formatDate(weekEnd, 'yyyy-MM-dd', 'en-US');
        break;

      case 'mes':
        this.startDate = formatDate(start, 'yyyy-MM-dd', 'en-US');
        const monthEnd = new Date(start); // Crear copia independiente
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        this.endDate = formatDate(monthEnd, 'yyyy-MM-dd', 'en-US');
        break;
    }
  }

  updateStartDate(event: string): void {
    this.startDate = event;
    const start = new Date(event + 'T00:00:00');

    switch (this.selectedOption) {
      case 'dia':
        this.endDate = formatDate(
          new Date(start.setDate(start.getDate() + 1)),
          'yyyy-MM-dd',
          'en-US'
        );
        break;

      case 'semana':
        this.endDate = formatDate(
          new Date(start.setDate(start.getDate() + 7)),
          'yyyy-MM-dd',
          'en-US'
        );
        break;

      case 'mes':
        const endMonth = new Date(start);
        endMonth.setMonth(start.getMonth() + 1);
        this.endDate = formatDate(endMonth, 'yyyy-MM-dd', 'en-US');
        break;
    }
  }

  updateEndDate(event: string): void {
    this.endDate = event;
    this.validateQuota();
  }
  validateQuota(): boolean {
    this.errorMessage = '';
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Validar para cuota diaria
    if (this.selectedOption === 'dia') {
      if (diffDays >= 7 && diffDays % 7 === 0) {
        this.errorMessage =
          'Para un rango de días, considera usar la cuota semanal.';
        return false;
      }
    }

    // Validar para cuota semanal
    if (this.selectedOption === 'semana') {
      if (diffDays % 7 !== 0) {
        this.errorMessage =
          'El rango de fechas en semanas debe ser un múltiplo de 7 días.';
        return false;
      }
    }

    // Validar para cuota mensual
    if (this.selectedOption === 'mes') {
      // Validar que el día del mes sea igual entre la fecha de inicio y la fecha de fin
      if (start.getDate() !== end.getDate()) {
        this.errorMessage =
          'Para un rango mensual, el día del mes de inicio y fin debe ser el mismo.';
        return false;
      }

      // Validar que al menos abarque un mes completo
      const diffMonths =
        end.getMonth() -
        start.getMonth() +
        12 * (end.getFullYear() - start.getFullYear());
      if (diffMonths < 1) {
        this.errorMessage =
          'El rango de fechas para meses debe abarcar al menos un mes.';
        return false;
      }
    }

    return true;
  }

  // Seleccionar un usuario
  seleccionarUsuario() {
    this.modalService
      .create({
        nzContent: SelectUserComponent,
        nzFooter: null,
        nzTitle: 'Seleccionar usuario',
      })
      .afterClose.subscribe((result) => {
        console.log(result);
        if (result) {
          this.selectedVehicle = result;
        }
      });
  }

  // Ir al paso anterior
  previousStep(): void {
    this.step = Math.max(0, this.step - 1);
  }

  save() {
    if (this.errorMessage) {
      return;
    }
    if (this.step === 0) {
      this.calculatePrice();
      this.step = 1;
    }
  }
  calculatePrice(): void {
    if (!this.parkingSpace) {
      this.price = 0;
      return;
    }

    const pricePerDay = this.parkingSpace.parkingSpaceType.priceDay || 0;
    const pricePerWeek = this.parkingSpace.parkingSpaceType.priceWeek || 0;
    const pricePerMonth = this.parkingSpace.parkingSpaceType.priceMonth || 0;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const diffDays = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    switch (this.selectedOption) {
      case 'dia':
        this.price = pricePerDay * diffDays;
        break;
      case 'semana':
        this.price =
          Math.floor(diffDays / 7) * pricePerWeek +
          (diffDays % 7) * pricePerDay;
        break;
      case 'mes':
        const diffMonths =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());

        if (diffMonths < 1) {
          // Si la duración es menor a un mes, calcular proporcionalmente
          this.price = (diffDays / 30) * pricePerMonth;
        } else {
          this.price = diffMonths * pricePerMonth;
        }
        break;
      default:
        this.price = 0;
    }

    // Redondear a 2 decimales para evitar problemas con los cálculos flotantes
    this.price = Math.round(this.price * 100) / 100;
  }

  guardar() {
    var typeId =
      this.selectedOption === 'dia'
        ? 'D'
        : this.selectedOption === 'semana'
        ? 'S'
        : 'M';
    const data: ContractRequest = {
      vehicleId: this.selectedVehicle!.id,
      endDate: new Date(this.endDate),
      startDate: new Date(this.startDate),
      parkingId: this.parkingSpaceId!,
      typeId: typeId,
    };
    this.parkingService.addContract(data).subscribe(
      (api) => {
        this.message.success('Contrato creado correctamente');
        this.modal.close(true);
      },
      (error) => {
        this.message.error('Error al crear el contrato');
      }
    );
  }

  cancel(): void {
    this.modal.close();
  }

  // Helper para formatear horas en formato HH:mm
  private formatTime(hours: number, minutes: number): string {
    const h = hours < 10 ? `0${hours}` : `${hours}`;
    const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${h}:${m}`;
  }
}
