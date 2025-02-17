import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../../services/horarios/horarios.service';
import {
  ExceptSchedule,
  ExceptScheduleRequest,
  RegularSchedule,
} from '../../../models/schedule/regularSchedule';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { finalize } from 'rxjs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
@Component({
  selector: 'app-horario-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzTableModule,
    NzTimePickerModule,
    NzSpinModule,
    NzDatePickerModule,
    NzButtonModule,
  ],
  templateUrl: './horario-management.component.html',
  styleUrl: './horario-management.component.scss',
})
export class HorarioManagementComponent implements OnInit {
  horarios: RegularSchedule[] = [];
  exceptSchedules: ExceptSchedule[] = [];

  constructor(
    private scheduleService: HorariosService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getHorarios();
    this.getExceptions();
  }
  getHorarios() {
    this.scheduleService
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
  getDayName(week_day: number): string {
    const days = [
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
      'Domingo',
    ];
    return days[week_day - 1];
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

  updateHorario(horario: RegularSchedule) {
    if (!horario.startHour && !horario.endHour) {
      return;
    }
    if (horario.startHour! > horario.endHour!) {
      this.message.error(
        'La hora de inicio no puede ser mayor a la hora de fin'
      );
      return;
    }
    if (horario.startHour === horario.endHour) {
      this.message.error(
        'La hora de inicio no puede ser igual a la hora de fin'
      );
      return;
    }
    if (
      (horario.startHour && !horario.endHour) ||
      (!horario.startHour && horario.endHour)
    ) {
      this.message.error('Ambas horas deben estar seleccionadas');
      return;
    }
    this.scheduleService
      .updateHorario({
        id: horario.id,
        startTime: this.dateToString(horario.startHour!),
        endTime: this.dateToString(horario.endHour!),
      })
      .subscribe(
        (api) => {
          this.message.success('Horario actualizado con éxito');
          this.getHorarios();
        },
        (error) => {
          this.message.error(error);
        }
      );
  }

  private dateToString(date: Date | string): string {
    if (typeof date === 'string') {
      return date;
    }
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  deleteSchedule(id: number) {
    this.scheduleService
      .updateHorario({
        id,
        startTime: '',
        endTime: '',
      })
      .subscribe(
        (api) => {
          this.message.success('Horario eliminado con éxito');
          this.getHorarios();
        },
        (error) => {
          this.message.error(error);
        }
      );
  }

  isLoading: boolean = false;

  exceptionFilter = {
    startDate: null,
    endDate: null,
    startHour: null,
    endHour: null,
  };

  getExceptions() {
    this.scheduleService
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

  addException() {
    if (!this.exceptionFilter.startDate || !this.exceptionFilter.endDate) {
      this.message.error('Seleccione un rango de fechas válido.');
      return;
    }

    const request: ExceptScheduleRequest[] = [];
    let currentDate = new Date(this.exceptionFilter.startDate);

    while (currentDate <= new Date(this.exceptionFilter.endDate)) {
      request.push({
        date: currentDate.toISOString().split('T')[0],
        startHour: this.exceptionFilter.startHour
          ? this.dateToString(this.exceptionFilter.startHour)
          : null,
        endHour: this.exceptionFilter.endHour
          ? this.dateToString(this.exceptionFilter.endHour)
          : null,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.scheduleService.addExceptSchedule(request).subscribe(
      () => {
        this.message.success('Excepción añadida correctamente.');
        this.getExceptions();
      },
      (error) => {
        this.message.error(error);
      }
    );
  }

  deleteException(id: number) {
    this.scheduleService.deleteExceptSchedule(id).subscribe(
      () => {
        this.message.success('Excepción eliminada con éxito.');
        this.getExceptions();
      },
      (error) => {
        this.message.error(error);
      }
    );
  }
}
