import { Component, OnInit } from '@angular/core';
import { ParkingService } from '../../../services/parking/parking.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-parking-lots',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './parking-lots.component.html',
  styleUrl: './parking-lots.component.scss',
})
export class ParkingLotsComponent implements OnInit {
  selectedCategory: any;
  parkingSpaces: any[] = [];
  isLoading: boolean = true;
  categorias: any[] = [];

  constructor(private parkingService: ParkingService) {}

  async ngOnInit() {
    try {
      this.parkingSpaces = await this.parkingService.getAllParkingData();
      this.parkingSpaces.forEach((parkingSpace) => {
        if (!this.categorias.includes(parkingSpace.id[0])) {
          this.categorias.push(parkingSpace.id[0]);
          this.selectedCategory = this.categorias[0];
        }
      });
      console.log(this.categorias);
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      this.isLoading = false;
    }
  }
  get parkingSpacesFiltered() {
    return this.parkingSpaces.filter(
      (space) => this.selectedCategory === space.id[0]
    );
  }
}
