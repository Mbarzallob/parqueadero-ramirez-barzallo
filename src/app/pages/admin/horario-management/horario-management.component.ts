import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../../services/horarios/horarios.service';
import { RegularSchedule } from '../../../models/schedule/regularSchedule';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-horario-management',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzTableModule,
    NzTimePickerModule,
  ],
  templateUrl: './horario-management.component.html',
  styleUrl: './horario-management.component.scss',
})
export class HorarioManagementComponent implements OnInit {
  horarios: RegularSchedule[] = [];

  constructor(
    private scheduleService: HorariosService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getHorarios();
  }
  getHorarios() {
    this.scheduleService.getHorarios().subscribe(
      (response) => {
        this.horarios = response.data.map((schedule) => ({
          ...schedule,
          startHour: this.stringToDate(schedule.startHour),
          endHour: this.stringToDate(schedule.endHour),
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
  private stringToDate(timeString: string | Date): Date {
    if (timeString instanceof Date) {
      return timeString;
    }
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds || 0, 0);
    return date;
  }

  updateHorario(horario: RegularSchedule) {
    if (horario.startHour > horario.endHour) {
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
        startTime: this.dateToString(horario.startHour),
        endTime: this.dateToString(horario.endHour),
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
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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
}
