export interface RegularSchedule {
  id: number;
  weekDay: number;
  startHour: string | Date | null;
  endHour: string | Date | null;
}

export interface ScheduleRequest {
  id: number;
  startTime: string;
  endTime: string;
}

export interface ExceptSchedule {
  id: number;
  date: Date;
  startHour: string | null;
  endHour: string | null;
}

export interface ExceptScheduleRequest {
  date: string | null;
  startHour: string | null;
  endHour: string | null;
}
