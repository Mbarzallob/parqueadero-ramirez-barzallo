import { Component, OnInit } from '@angular/core';
import { ParkingService } from '../../../services/parking/parking.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parking-lots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './parking-lots.component.html',
  styleUrl: './parking-lots.component.scss',
})
export class ParkingLotsComponent implements OnInit {
  parkingSpaces: any[] = [];
  isLoading: boolean = true;

  constructor(private parkingService: ParkingService) {}

  async ngOnInit() {
    try {
      this.parkingSpaces = await this.parkingService.getAllParkingData();
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
