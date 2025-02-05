import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ParkingService } from '../../services/parking/parking.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-event-modal',
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    templateUrl: './event-modal.component.html',
    styleUrl: './event-modal.component.scss'
})
export class EventModalComponent {
  event: any;
  contractType: string = '';
  contractIndex: number = -1;
  blockId: string = '';
  parkingId: string = '';
  selectedStatus: 'active' | 'inactive' = 'active';

  // Mapeo para convertir nombres abreviados a nombres completos de contrato
  contractTypeMap: { [key: string]: string } = {
    hora: 'ContratosPorHora',
    semanal: 'ContratosSemanales',
    diario: 'ContratosDiarios',
    mensual: 'ContratosMensuales',
  };

  constructor(
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private parkingService: ParkingService,
    private route: ActivatedRoute
  ) {
    this.event = data.event;

    // Extraer el tipo de contrato y el índice desde el ID del evento
    const [type, index] = this.event.id.split('-');
    this.contractType = type;
    this.contractIndex = parseInt(index, 10);

    // Obtener el blockId y el parkingId desde los parámetros de la ruta
    this.route.queryParams.subscribe((params) => {
      this.blockId = params['blockId'];
      this.parkingId = params['parkingId'];
    });
  }

  /**
   * Marca el contrato como inactivo
   */
  markAsInactive(): void {
    this.selectedStatus = 'inactive';

    // Llamada al servicio para actualizar el estado a inactivo
    this.parkingService
      .updateContractStatus(
        this.blockId,
        this.parkingId,
        this.contractTypeMap[this.contractType] as
          | 'ContratosPorHora'
          | 'ContratosSemanales'
          | 'ContratosDiarios'
          | 'ContratosMensuales', // Convierte el tipo al nombre completo
        this.contractIndex,
        this.selectedStatus
      )
      .then(() => {
        this.dialogRef.close(true); // Cierra el modal indicando éxito
      })
      .catch((error) => {
        console.error('Error al marcar como inactivo:', error);
      });
  }

  /**
   * Cierra el modal sin realizar cambios
   */
  close(): void {
    this.dialogRef.close(false);
  }
}
