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
  ocupiedDates: any[] = [];
  constructor(
    private route: ActivatedRoute,
    private parkingService: ParkingService,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
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

    parkingLot.ContratosDiarios?.forEach((contract: any) => {
      events.push({
        title: 'Ocupado (Diario)',
        start: contract.fechaInicio.toDate(),
        end: contract.fechaFin.toDate(),
        color: '#FFD700',
      });
      this.ocupiedDates.push({
        fechaInicio: contract.fechaInicio.toDate(),
        fechaFin: contract.fechaFin.toDate(),
      });
    });

    parkingLot.ContratosMensuales?.forEach((contract: any) => {
      events.push({
        title: 'Ocupado (Mensual)',
        start: contract.fechaInicio.toDate(),
        end: contract.fechaFin.toDate(),
        color: '#1E90FF',
      });
      this.ocupiedDates.push({
        fechaInicio: contract.fechaInicio.toDate(),
        fechaFin: contract.fechaFin.toDate(),
      });
    });

    parkingLot.ContratosPorHora?.forEach((contract: any) => {
      events.push({
        title: 'Ocupado (Por Hora)',
        start: contract.fechaInicio.toDate(),
        end: contract.fechaFin.toDate(),
        color: '#FF4500',
      });
      this.ocupiedDates.push({
        fechaInicio: contract.fechaInicio.toDate(),
        fechaFin: contract.fechaFin.toDate(),
      });
    });

    parkingLot.ContratosSemanales?.forEach((contract: any) => {
      events.push({
        title: 'Ocupado (Semanal)',
        start: contract.fechaInicio.toDate(),
        end: contract.fechaFin.toDate(),
        color: '#32CD32',
      });
      this.ocupiedDates.push({
        fechaInicio: contract.fechaInicio.toDate(),
        fechaFin: contract.fechaFin.toDate(),
      });
    });

    return events;
  }

  handleEventClick(arg: any): void {
    // const event = arg.event;
    // this.openModal({
    //   date: event.start,
    //   time: event.start?.toLocaleTimeString(),
    //   eventTitle: event.title,
    // });
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
    const dialog = this.dialog.open(ContractModalComponent, {
      data: {
        date: data.date,
        ocupiedDates: this.ocupiedDates,
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
