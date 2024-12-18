import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParkingService } from '../../../services/parking/parking.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { ContractModalComponent } from '../../../modals/contract-modal/contract-modal.component';
import { EventModalComponent } from '../../../modals/event-modal/event-modal.component';
import { timestampToDate } from '../../../utils/firebase-helper';

@Component({
  selector: 'app-parking-lot',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './parking-lot.component.html',
  styleUrl: './parking-lot.component.scss',
})
export class ParkingLotComponent {
  parkingLot: any;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    locale: 'es',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista',
    },

    events: [],
    aspectRatio: 7 / 3,
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.openContractModal.bind(this),
  };
  horarios: any[] = [];

  ocupiedDates: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private parkingService: ParkingService,
    private dialog: MatDialog
  ) {}
  async ngOnInit() {
    this.horarios = await this.parkingService.getHorarios();
    this.route.queryParams.subscribe((params) => {
      this.parkingService
        .getParkingLot(params['blockId'], params['parkingId'])
        .then((parkingLot) => {
          this.parkingLot = parkingLot;
          const events = this.generateEventsFromParkingLot(parkingLot);
          this.calendarOptions = { ...this.calendarOptions, events };
        });
    });
  }

  generateEventsFromParkingLot(parkingLot: any): any[] {
    const events: any[] = [];

    parkingLot.ContratosDiarios?.forEach((contract: any, index: number) => {
      if (contract.status === 'active') {
        events.push({
          title: 'Ocupado (Diario)',
          start: contract.fechaInicio.toDate(),
          end: contract.fechaFin.toDate(),
          color: '#FFD700',
          id: 'diario-' + index.toString(),
        });
        this.ocupiedDates.push({
          fechaInicio: contract.fechaInicio.toDate(),
          fechaFin: contract.fechaFin.toDate(),
        });
      }
    });

    parkingLot.ContratosMensuales?.forEach((contract: any, index: number) => {
      if (contract.status === 'active') {
        events.push({
          title: 'Ocupado (Mensual)',
          start: contract.fechaInicio.toDate(),
          end: contract.fechaFin.toDate(),
          color: '#1E90FF',
          id: 'mensual-' + index.toString(),
        });
        this.ocupiedDates.push({
          fechaInicio: contract.fechaInicio.toDate(),
          fechaFin: contract.fechaFin.toDate(),
        });
      }
    });

    parkingLot.ContratosPorHora?.forEach((contract: any, index: number) => {
      if (contract.status === 'active') {
        events.push({
          title: 'Ocupado (Por Hora)',
          start: contract.fechaInicio.toDate(),
          end: contract.fechaFin.toDate(),
          color: '#FF4500',
          id: 'hora-' + index.toString(),
        });
        this.ocupiedDates.push({
          fechaInicio: contract.fechaInicio.toDate(),
          fechaFin: contract.fechaFin.toDate(),
        });
      }
    });

    parkingLot.ContratosSemanales?.forEach((contract: any, index: number) => {
      if (contract.status === 'active') {
        events.push({
          title: 'Ocupado (Semanal)',
          start: contract.fechaInicio.toDate(),
          end: contract.fechaFin.toDate(),
          color: '#32CD32',
          id: 'semanal-' + index.toString(),
        });
        this.ocupiedDates.push({
          fechaInicio: contract.fechaInicio.toDate(),
          fechaFin: contract.fechaFin.toDate(),
        });
      }
    });

    return events;
  }

  handleEventClick(arg: any): void {
    const dialog = this.dialog.open(EventModalComponent, {
      data: {
        event: arg.event,
      },
    });
    dialog.afterClosed().subscribe(() => {
      this.route.queryParams.subscribe((params) => {
        this.parkingService
          .getParkingLot(params['blockId'], params['parkingId'])
          .then((parkingLot) => {
            this.parkingLot = parkingLot;
            const events = this.generateEventsFromParkingLot(parkingLot);
            this.calendarOptions = { ...this.calendarOptions, events };
          });
      });
    });
  }
  isDateWithinHorarios(date: Date): boolean {
    console.log('Fecha seleccionada (antes de ajuste):', date);

    // Ajustar la hora de `date` a las 23:59:59
    const adjustedDate = new Date(date);
    adjustedDate.setHours(23, 59, 59, 999);

    console.log('Fecha seleccionada (ajustada):', adjustedDate);

    return this.horarios.some((horario) => {
      const inicio = timestampToDate(horario.inicio);
      const fin = timestampToDate(horario.fin);

      console.log('Horario:', { inicio, fin });

      // Comparar la fecha ajustada con los horarios
      return adjustedDate >= inicio && date <= fin;
    });
  }

  openContractModal(data: any): void {
    const now = new Date();
    const mid = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );
    if (data.date < mid) {
      alert('No puedes seleccionar una fecha pasada');
      return;
    }
    if (!this.isDateWithinHorarios(data.date)) {
      alert(
        'La fecha seleccionada está fuera del horario permitido. Por favor selecciona otra fecha.'
      );
      return;
    }
    const dialog = this.dialog.open(ContractModalComponent, {
      data: {
        date: data.date,
        ocupiedDates: this.ocupiedDates,
        rates: {
          diario: this.parkingLot.precioPorDia,
          mensual: this.parkingLot.precioPorMes,
          hora: this.parkingLot.precioPorHora,
          semanal: this.parkingLot.precioPorSemana,
        },
        horarios: this.horarios,
      },
    });
    dialog.afterClosed().subscribe(() => {
      this.route.queryParams.subscribe((params) => {
        this.parkingService
          .getParkingLot(params['blockId'], params['parkingId'])
          .then((parkingLot) => {
            this.parkingLot = parkingLot;
            const events = this.generateEventsFromParkingLot(parkingLot);
            this.calendarOptions = { ...this.calendarOptions, events };
          });
      });
    });
  }
  dateClick(data: any) {
    console.log(data);
  }
}
