import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ParkingService } from '../../../services/parking/parking.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';

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
    plugins: [dayGridPlugin],
    locale: 'es',
  };
  constructor(
    private route: ActivatedRoute,
    private parkingService: ParkingService
  ) {}
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.parkingService
        .getParkingLot(params['blockId'], params['parkingId'])
        .then((parkingLot) => {
          this.parkingLot = parkingLot;
        });
    });
  }
}
