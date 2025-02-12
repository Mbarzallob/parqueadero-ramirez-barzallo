import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import {
  RegularSchedule,
  ScheduleRequest,
} from '../../models/schedule/regularSchedule';

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  constructor(private http: HttpClient) {}

  getHorarios() {
    return this.http.get<Response<RegularSchedule[]>>('schedule');
  }
  updateHorario(horario: ScheduleRequest) {
    return this.http.put<Response<any>>(`schedule`, horario);
  }
}
