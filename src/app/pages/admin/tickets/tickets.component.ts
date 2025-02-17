import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Vehicle, VehicleType } from '../../../models/person/profile';
import { Ticket, TicketRequest } from '../../../models/parking/contract';
import { ParkingService } from '../../../services/parking/parking.service';
import { PersonService } from '../../../services/person/person.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';
import {
  FilterParkingSpace,
  ParkingSpace,
} from '../../../models/parking/block';
import { SelectUserComponent } from '../../../modals/select-user/select-user.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ExceptSchedule,
  RegularSchedule,
} from '../../../models/schedule/regularSchedule';
import { HorariosService } from '../../../services/horarios/horarios.service';

@Component({
  selector: 'app-tickets',
  imports: [
    NzButtonModule,
    NzSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzTableModule,
    NzSpinModule,
  ],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.scss',
})
export class TicketsComponent implements OnInit {
  isLoading: boolean = false;
  selectedVehicle: Vehicle | null = null;
  vehicleTypes: VehicleType[] = [];
  parkingSpaces: ParkingSpace[] = [];
  tickets: Ticket[] = [];
  horarios: RegularSchedule[] = []; // Guardará los horarios permitidos
  exceptSchedules: ExceptSchedule[] = [];

  filter: FilterParkingSpace = {
    startDate: new Date(),
    vehicleType: null,
    endDate: null,
  };

  constructor(
    private parkingService: ParkingService,
    private personService: PersonService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private route: ActivatedRoute,
    private router: Router,
    private horarioService: HorariosService
  ) {}

  ngOnInit(): void {
    this.getVehicleType();
    this.getTickets();
    this.getHorarios();
    this.getExceptions();
  }

  getExceptions() {
    this.horarioService
      .getExceptSchedules()
      .pipe(finalize(() => (this.isLoading = false)))

      .subscribe(
        (response) => {
          this.exceptSchedules = response.data;
          console.log(this.exceptSchedules);
        },
        (error) => {
          this.message.error(error);
        }
      );
  }
  getHorarios() {
    this.horarioService
      .getHorarios()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (response) => {
          this.horarios = response.data.map((schedule) => ({
            ...schedule,
            startHour: this.stringToDate(schedule.startHour) || null,
            endHour: this.stringToDate(schedule.endHour) || null,
          }));
        },
        (error) => {
          this.message.error(error);
        }
      );
  }
  private stringToDate(timeString: string | Date | null): Date | null {
    if (!timeString) {
      return null; // Retorna null si no hay hora
    }

    if (timeString instanceof Date) {
      return timeString;
    }

    const timeParts = timeString.split(':');
    if (timeParts.length < 2) {
      console.error('Formato inválido en stringToDate:', timeString);
      return null;
    }

    const [hours, minutes, seconds] = timeParts.map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);

    return isNaN(date.getTime()) ? null : date;
  }

  isWithinSchedule(): boolean {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
    const currentDate = now.toISOString().split('T')[0]; // Obtener fecha en formato YYYY-MM-DD
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Verificar si hoy está en la lista de excepciones
    const exception = this.exceptSchedules.find(
      (e) => new Date(e.date).toISOString().split('T')[0] === currentDate
    );

    if (exception) {
      // Si la excepción tiene startHour y endHour en null, no se trabaja en todo el día
      if (!exception.startHour || !exception.endHour) {
        this.message.error(
          'No se puede registrar un ticket hoy debido a una excepción de horario.'
        );
        return false;
      }
      // Convertir las horas de string a Date
      const startHour = this.stringToDate(exception.startHour)?.getHours() ?? 0;
      const startMinute =
        this.stringToDate(exception.startHour)?.getMinutes() ?? 0;
      const endHour = this.stringToDate(exception.endHour)?.getHours() ?? 23;
      const endMinute =
        this.stringToDate(exception.endHour)?.getMinutes() ?? 59;

      var valida = this.validateTime(
        currentHour,
        currentMinute,
        startHour,
        startMinute,
        endHour,
        endMinute
      );
      if (valida) {
        this.message.error(
          'No se puede registrar un ticket porque esta dentro de una excepción de horario.'
        );

        return false;
      }
    }

    // Obtener el horario normal si no hay excepciones
    const todaySchedule = this.horarios.find((h) => h.id === currentDay);

    if (!todaySchedule) {
      this.message.error('No hay horario registrado para hoy.');
      return false;
    }

    // Si el horario normal tiene startHour y endHour en null, no se trabaja en todo el día
    if (!todaySchedule.startHour || !todaySchedule.endHour) {
      this.message.error(
        'No se puede registrar un ticket hoy. No hay horario disponible.'
      );
      return false;
    }

    // Convertir las horas de string a Date
    const startHour =
      this.stringToDate(todaySchedule.startHour)?.getHours() ?? 0;
    const startMinute =
      this.stringToDate(todaySchedule.startHour)?.getMinutes() ?? 0;
    const endHour = this.stringToDate(todaySchedule.endHour)?.getHours() ?? 23;
    const endMinute =
      this.stringToDate(todaySchedule.endHour)?.getMinutes() ?? 59;

    return this.validateTime(
      currentHour,
      currentMinute,
      startHour,
      startMinute,
      endHour,
      endMinute
    );
  }

  /**
   * Valida si la hora actual está dentro del rango permitido
   */
  private validateTime(
    currentHour: number,
    currentMinute: number,
    startHour: number,
    startMinute: number,
    endHour: number,
    endMinute: number
  ): boolean {
    const isAfterStart =
      currentHour > startHour ||
      (currentHour === startHour && currentMinute >= startMinute);
    const isBeforeEnd =
      currentHour < endHour ||
      (currentHour === endHour && currentMinute <= endMinute);

    return isAfterStart && isBeforeEnd;
  }
  getVehicleType() {
    this.personService.getVehicleTypes().subscribe((response) => {
      this.vehicleTypes = response.data;
      this.filter.vehicleType = this.vehicleTypes[0].id;
      this.getParkingSpaces();
    });
  }

  getParkingSpaces() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { vehicleType: this.filter.vehicleType },
      queryParamsHandling: 'merge', // Mantiene otros query params
    });
    if (!this.filter.vehicleType) {
      this.message.warning('Seleccione un tipo de vehículo');
      return;
    }

    this.isLoading = true;
    this.parkingService
      .getParkingSpaces(-1, this.filter) // null en blockId para obtener todos
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((api) => {
        this.parkingSpaces = api.data;
      });
  }

  getTickets() {
    this.isLoading = true;
    this.parkingService
      .getAllTickets()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((api) => {
        this.tickets = api.data;
        console.log(api.data);
      });
  }
  formatDate(date: any): string {
    if (!date) return 'N/A';

    // Verificar si la fecha es un array (como lo que se muestra en la imagen)
    if (Array.isArray(date)) {
      const [year, month, day, hour, minute, second] = date;
      return `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')} 
              ${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
    }

    // Si la fecha ya es un objeto Date
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toLocaleString();
    }

    return 'Formato inválido';
  }

  seleccionarUsuario() {
    this.modalService
      .create({
        nzContent: SelectUserComponent,
        nzFooter: null,
        nzTitle: 'Seleccionar usuario',
      })
      .afterClose.subscribe((result) => {
        if (result) {
          this.selectedVehicle = result;
        }
      });
  }

  addTicket(parkingId: number) {
    if (!this.selectedVehicle) {
      this.message.error(
        'Debe seleccionar un vehículo antes de registrar un ticket.'
      );
      return;
    }
    if (!this.isWithinSchedule()) {
      this.message.error(
        'No puede registrar un ticket fuera del horario permitido.'
      );
      return;
    }

    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60000; // Diferencia de zona horaria en milisegundos
    const localDate = new Date(now.getTime() - offsetMs); // Ajusta la hora

    const ticketRequest: TicketRequest = {
      startDate: localDate.toISOString().slice(0, 19), // Elimina la "Z" final para evitar UTC
      endDate: null,
      parkingId: parkingId,
      vehicleId: this.selectedVehicle.id,
    };

    console.log('Enviando ticketRequest:', ticketRequest);

    this.parkingService.addTicket(ticketRequest).subscribe(
      () => {
        this.message.success('Ticket registrado con éxito.');
        this.getTickets();
        this.getParkingSpaces();
      },
      (error) => {
        this.message.error(error);
      }
    );
  }

  endTicket(ticket: Ticket) {
    const now = new Date();
    const start = new Date(this.formatDate(ticket.startDate));
    console.log(start);
    const hours = Math.ceil(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60)
    );
    const price = hours * ticket.parkingSpace.parkingSpaceType.priceHour;

    this.modalService.confirm({
      nzTitle: 'Finalizar Ticket',
      nzContent: `El vehículo ${
        ticket.vehicle.plate
      } ha estado ${hours} horas estacionado. 
                  <br> El costo total es: <strong>$${price.toFixed(
                    2
                  )}</strong>`,
      nzOkText: 'Confirmar',
      nzCancelText: 'Cancelar',
      nzOnOk: () => {
        this.parkingService.endTicket(ticket.id).subscribe(
          () => {
            this.message.success('Ticket finalizado con éxito.');
            this.getTickets();
            this.getParkingSpaces();
          },
          (error) => {
            this.message.error('Error al finalizar el ticket.');
          }
        );
      },
    });
  }
}
