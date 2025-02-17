import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../../models/generic/response';
import {
  ExceptSchedule,
  ExceptScheduleRequest,
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
  deleteExceptSchedule(id: number) {
    return this.http.delete<Response<any>>(`schedule/except/${id}`);
  }
  addExceptSchedule(request: ExceptScheduleRequest[]) {
    return this.http.post<Response<any>>(`schedule/except`, request);
  }
  getExceptSchedules() {
    return this.http.get<Response<ExceptSchedule[]>>('schedule/except');
  }
}
