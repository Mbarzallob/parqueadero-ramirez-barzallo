export interface RegularSchedule {
  id: number;
  weekDay: number;
  startHour: string | Date;
  endHour: string | Date;
}

export interface ScheduleRequest {
  id: number;
  startTime: string;
  endTime: string;
}
