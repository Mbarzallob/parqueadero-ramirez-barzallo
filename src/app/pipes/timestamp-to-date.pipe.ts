import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToDate',
  standalone: true,
})
export class TimestampToDatePipe implements PipeTransform {
  transform(value: { seconds: number } | null, ...args: unknown[]): unknown {
    if (!value) {
      return 'Fecha no válida';
    }

    const date = new Date(value.seconds * 1000);
    return date.toLocaleDateString();
  }
}
