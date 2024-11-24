import { CommonModule, formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ParkingService } from '../../services/parking/parking.service';
import { co } from '@fullcalendar/core/internal-common';

@Component({
  selector: 'app-contract-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
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
  blockId: string = '';
  parkingSpaceId: string = '';
  currentDate: string = ''; // Fecha mínima para inputs de tipo date
  currentTime: string = ''; // Hora mínima para inputs de tipo time
  errorMessage: string = '';
  constructor(
    public dialogRef: MatDialogRef<ContractModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private parkingService: ParkingService,
    private route: ActivatedRoute
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
    this.route.queryParams.subscribe((params) => {
      this.blockId = params['blockId'];
      this.parkingSpaceId = params['parkingId'];
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

      case 'hora':
        const nowTime = new Date();
        this.startTime = this.formatTime(
          nowTime.getHours(),
          nowTime.getMinutes() + 3
        );
        this.endTime = this.formatTime(
          nowTime.getHours() + 1,
          nowTime.getMinutes() + 3
        ); // Añadir una hora por defecto
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
    this.validateQuota(); // Validar y ajustar según la cuota
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

  async save() {
    if (this.errorMessage != '') return;
    const now = new Date();
    this.errorMessage = '';
    if (
      new Date(
        this.startDate +
          'T' +
          (this.selectedOption === 'hora' ? this.startTime : '00:00:00')
      ) < now
    ) {
      this.errorMessage = 'La fecha inicial no puede ser anterior a hoy.';
      return;
    }

    if (this.selectedOption === 'hora') {
      if (!this.startTime || !this.endTime) {
        this.errorMessage = 'Por favor selecciona un rango de horas válido.';
        return;
      }

      const [startHour, startMinute] = this.startTime.split(':').map(Number);
      const [endHour, endMinute] = this.endTime.split(':').map(Number);

      if (
        startHour < now.getHours() ||
        (startHour === now.getHours() && startMinute < now.getMinutes())
      ) {
        this.errorMessage =
          'La hora de inicio no puede ser anterior a la hora actual.';
        return;
      }

      if (
        endHour < startHour ||
        (endHour === startHour && endMinute <= startMinute)
      ) {
        this.errorMessage =
          'La hora de fin debe ser posterior a la hora de inicio.';
        return;
      }
    }

    // Asignar el tipo de contrato según la opción seleccionada
    let typeofContract:
      | 'ContratosPorHora'
      | 'ContratosDiarios'
      | 'ContratosSemanales'
      | 'ContratosMensuales' = 'ContratosPorHora';
    switch (this.selectedOption) {
      case 'hora':
        typeofContract = 'ContratosPorHora';
        break;
      case 'dia':
        typeofContract = 'ContratosDiarios';
        break;
      case 'semana':
        typeofContract = 'ContratosSemanales';
        break;
      case 'mes':
        typeofContract = 'ContratosMensuales';
        break;
      default:
        this.errorMessage = 'Por favor selecciona una opción válida.';
        return;
    }

    for (const ocupada of this.ocupiedDates) {
      const ocupiedStart = ocupada.fechaInicio;
      const ocupiedEnd = ocupada.fechaFin;

      const selectedStart = new Date(
        this.startDate +
          'T' +
          (this.selectedOption === 'hora' ? this.startTime : '00:00:00')
      );
      const selectedEnd = new Date(
        this.endDate +
          'T' +
          (this.selectedOption === 'hora' ? this.endTime : '00:00:00')
      );

      // Validar solapamiento
      if (
        (selectedStart >= ocupiedStart && selectedStart < ocupiedEnd) || // Inicio dentro del rango ocupado
        (selectedEnd > ocupiedStart && selectedEnd <= ocupiedEnd) || // Fin dentro del rango ocupado
        (selectedStart <= ocupiedStart && selectedEnd >= ocupiedEnd) // Rango seleccionado abarca al rango ocupado
      ) {
        console.log(ocupada);
        this.errorMessage = 'El rango de fechas seleccionado está ocupado.';
        return;
      }
    }

    console.log([
      this.blockId,
      this.parkingSpaceId,
      typeofContract,
      {
        fechaInicio: new Date(this.startDate + 'T' + this.startTime),
        fechaFin: new Date(this.endDate + 'T' + this.endTime),
        idUser: 'asdf', // Cambiar por el ID real del usuario
      },
    ]);

    const contractData = {
      fechaInicio: new Date(
        this.startDate +
          'T' +
          (this.selectedOption === 'hora' ? this.startTime : '00:00:00')
      ),
      fechaFin: new Date(
        this.endDate +
          'T' +
          (this.selectedOption === 'hora' ? this.endTime : '00:00:00')
      ),
      idUser: 'asdf', // Cambiar por el ID real del usuario
    };

    await this.parkingService.addContractToParkingLot(
      this.blockId,
      this.parkingSpaceId,
      typeofContract,
      contractData
    );

    this.dialogRef.close();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  // Helper para formatear horas en formato HH:mm
  private formatTime(hours: number, minutes: number): string {
    const h = hours < 10 ? `0${hours}` : `${hours}`;
    const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${h}:${m}`;
  }
}