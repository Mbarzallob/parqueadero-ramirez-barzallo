import { Component, OnInit } from '@angular/core';
import { ParkingService } from '../../../services/parking/parking.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { timestampToDate } from '../../../utils/firebase-helper';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-parking-lots',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
    templateUrl: './parking-lots.component.html',
    styleUrl: './parking-lots.component.scss'
})
export class ParkingLotsComponent implements OnInit {
  blocksOriginal: any[] = []; // Lista completa de bloques
  selectedBlock: any; // Bloque seleccionado
  parkingSpaces: any[] = []; // Espacios de estacionamiento del bloque seleccionado
  isLoading: boolean = true; // Bandera para indicar carga de datos

  constructor(private parkingService: ParkingService) {}

  async ngOnInit() {
    try {
      // Cargar los bloques desde el servicio
      this.blocksOriginal = await this.parkingService.getAllBlocks();
      if (this.blocksOriginal.length > 0) {
        // Seleccionar el primer bloque por defecto
        this.selectedBlock = this.blocksOriginal[0];
        this.parkingSpaces = this.selectedBlock?.parkingSpaces || [];
      }
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      this.isLoading = false;
    }
  }

  // Manejar el cambio de bloque desde el dropdown
  onBlockChange(event: Event) {
    const selectedBlockId = (event.target as HTMLSelectElement).value; // ID del bloque seleccionado
    // Buscar el bloque seleccionado en la lista original
    this.selectedBlock = this.blocksOriginal.find(
      (block) => block.nombre === selectedBlockId
    );
    console.log('Bloque seleccionado:', this.selectedBlock);

    // Actualizar los espacios de estacionamiento
    this.parkingSpaces = this.selectedBlock?.parkingSpaces || [];
  }

  // Determinar el tipo de contrato activo en un espacio de estacionamiento
  getTypeOfParking(parking: any): string {
    const now = new Date();

    // Contratos por hora
    for (const contract of parking.ContratosPorHora || []) {
      if (this.isContractActive(contract, now)) {
        return 'bg-red-500';
      }
    }
    // Contratos mensuales
    for (const contract of parking.ContratosMensuales || []) {
      if (this.isContractActive(contract, now)) {
        return 'bg-blue-500';
      }
    }
    // Contratos semanales
    for (const contract of parking.ContratosSemanales || []) {
      if (this.isContractActive(contract, now)) {
        return 'bg-green-500';
      }
    }
    // Contratos diarios
    for (const contract of parking.ContratosDiarios || []) {
      if (this.isContractActive(contract, now)) {
        return 'bg-yellow-500';
      }
    }

    // Sin contrato activo
    return 'bg-gray-500';
  }

  // Verificar si un contrato está activo
  isContractActive(contract: any, now: Date): boolean {
    return (
      timestampToDate(contract.fechaInicio) <= now &&
      timestampToDate(contract.fechaFin) >= now
    );
  }
}
