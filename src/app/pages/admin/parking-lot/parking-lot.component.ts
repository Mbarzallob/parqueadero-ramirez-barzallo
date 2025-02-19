import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParkingService } from '../../../services/parking/parking.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  CalendarOptions,
  EventInput,
  EventSourceInput,
} from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { RegularSchedule } from '../../../models/schedule/regularSchedule';
import { HorariosService } from '../../../services/horarios/horarios.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ContractModalComponent } from '../../../modals/contract-modal/contract-modal.component';
import { Contract } from '../../../models/parking/contract';
import { EventModalComponent } from '../../../modals/event-modal/event-modal.component';

@Component({
  selector: 'app-parking-lot',
  imports: [FullCalendarModule],
  templateUrl: './parking-lot.component.html',
  styleUrl: './parking-lot.component.scss',
})
export class ParkingLotComponent {
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

  horarios: RegularSchedule[] = [];
  parkingId: number | null = null;
  contracts: Contract[] = [];

  constructor(
    private scheduleService: HorariosService,
    private message: NzMessageService,
    private modal: NzModalService,
    private route: ActivatedRoute,
    private parkingService: ParkingService
  ) {}

  ngOnInit() {
    this.getHorarios();
    this.route.queryParams.subscribe((params) => {
      this.parkingId = Number(params['parkingId']);
      this.getContracts();
    });
  }

  getHorarios() {
    this.scheduleService.getHorarios().subscribe((data) => {
      this.horarios = data.data;
    });
  }

  getContracts() {
    this.parkingService.getContrats(this.parkingId!).subscribe((api) => {
      this.contracts = api.data;
      this.calendarOptions = {
        ...this.calendarOptions,
        events: this.contracts.map((contract) => {
          let color = 'green';
          switch (contract.contractType.id) {
            case 'D':
              color = 'blue';
              break;
            case 'S':
              color = 'orange';
              break;
            case 'M':
              color = 'red';
              break;
          }
          const event: EventInput = {
            title: contract.vehicle.model,

            start: new Date(contract.startDate).setDate(
              new Date(contract.startDate).getDate() + 1
            ),
            end: new Date(contract.finishDate).setDate(
              new Date(contract.finishDate).getDate() + 1
            ),
            color: color,
            allDay: true,
            id: contract.id.toString(),
          };

          return event;
        }),
      };

      console.log(
        'Eventos asignados a calendarOptions:',
        this.calendarOptions.events
      );
    });
  }

  handleEventClick(data: any): void {
    const contrato = this.contracts.find(
      (contract) => contract.id === Number(data.event.id)
    );
    this.modal
      .create({
        nzContent: EventModalComponent,
        nzData: {
          contrato: contrato,
        },
        nzWidth: '50%',
        nzTitle: 'Detalles del Contrato',
        nzFooter: null,
      })
      .afterClose.subscribe((result) => {
        if (result) {
          this.getContracts();
        }
      });
  }

  openContractModal(data: any): void {
    const now = new Date();
    if (data.date < now) {
      this.message.warning('No se pueden crear contratos en fechas pasadas');
      return;
    }
    const selectedDate = new Date(data.date).toISOString().split('T')[0];

    // Revisar si hay algún evento en esa fecha
    const hayEventosEseDia = this.contracts.some((contract) => {
      const startDate = new Date(contract.startDate)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(contract.finishDate).toISOString().split('T')[0];

      return selectedDate >= startDate && selectedDate < endDate;
    });

    if (hayEventosEseDia) {
      this.message.warning('Ya existe un contrato para esta fecha');
      return;
    }
    const diaHorario = this.horarios.find(
      (horario) => horario.weekDay === data.date.getDay()
    );
    if (!diaHorario?.startHour || !diaHorario?.endHour) {
      this.message.warning('No se puede crear contratos en este día');
      return;
    }
    this.modal
      .create({
        nzContent: ContractModalComponent,
        nzData: {
          date: data.date,
          horario: diaHorario,
        },
        nzFooter: null,
      })
      .afterClose.subscribe((result) => {
        this.getContracts();
      });
  }
}
