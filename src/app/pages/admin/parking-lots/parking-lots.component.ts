import { Component, OnInit } from '@angular/core';
import { ParkingService } from '../../../services/parking/parking.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { timestampToDate } from '../../../utils/firebase-helper';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-parking-lots',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './parking-lots.component.html',
  styleUrl: './parking-lots.component.scss',
})
export class ParkingLotsComponent implements OnInit {
  blocksOriginal: any[] = [];
  selectedBlock: any;
  parkingSpaces: any[] = [];
  isLoading: boolean = true;

  constructor(private parkingService: ParkingService) {}

  async ngOnInit() {
    try {
      this.blocksOriginal = await this.parkingService.getAllBlocks();
      this.selectedBlock = this.blocksOriginal[0];
      this.parkingSpaces = this.selectedBlock?.parkingSpaces || [];
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      this.isLoading = false;
    }
  }
  onBlockChange(event: Event) {
    const selectedBlock = (event.target as HTMLSelectElement).value;

    this.selectedBlock = selectedBlock;
    this.parkingSpaces = this.selectedBlock?.parkingSpaces || [];
  }
  getTypeOfParking(parking: any): string {
    const now = new Date();

    console.log('hora');
    for (const contract of parking.ContratosPorHora || []) {
      if (this.isContractActive(contract, now)) {
        return 'bg-red-500';
      }
    }
    console.log('menusal');
    for (const contract of parking.ContratosMensuales || []) {
      if (this.isContractActive(contract, now)) {
        return 'bg-blue-500';
      }
    }
    console.log('semanal');
    for (const contract of parking.ContratosSemanales || []) {
      if (this.isContractActive(contract, now)) {
        return 'bg-green-500';
      }
    }
    console.log('diario');
    for (const contract of parking.ContratosDiarios || []) {
      if (this.isContractActive(contract, now)) {
        return 'bg-yellow-500';
      }
    }

    return 'bg-gray-500';
  }

  isContractActive(contract: any, now: Date): boolean {
    return (
      timestampToDate(contract.fechaInicio) <= now &&
      timestampToDate(contract.fechaFin) >= now
    );
  }
}
