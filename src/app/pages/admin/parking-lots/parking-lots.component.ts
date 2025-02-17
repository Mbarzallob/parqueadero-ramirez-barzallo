import { Component, OnInit } from '@angular/core';
import { ParkingService } from '../../../services/parking/parking.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { timestampToDate } from '../../../utils/firebase-helper';
import { RouterModule } from '@angular/router';
import { Block, ParkingSpace } from '../../../models/parking/block';
import { BlocksService } from '../../../services/blocks/blocks.service';
import { finalize } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-parking-lots',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './parking-lots.component.html',
  styleUrl: './parking-lots.component.scss',
})
export class ParkingLotsComponent implements OnInit {
  blocksOriginal: Block[] = []; // Lista completa de bloques
  selectedBlock: Block | null = null; // Bloque seleccionado
  parkingSpaces: ParkingSpace[] = []; // Espacios de estacionamiento del bloque seleccionado
  isLoading: boolean = false; // Bandera para indicar carga de datos

  constructor(
    private parkingService: ParkingService,
    private blockService: BlocksService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getBlocks();
  }

  getBlocks() {
    this.isLoading = true;
    this.blockService
      .getBlocks()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((response) => {
        this.blocksOriginal = response.data;
        if (this.blocksOriginal.length > 0) {
          this.selectedBlock = this.blocksOriginal[0];
          this.onBlockChange(new Event(''));
        }
      });
  }

  // Manejar el cambio de bloque desde el dropdown
  onBlockChange(event: Event) {
    console.log(this.selectedBlock);
    if (!this.selectedBlock) {
      this.message.error('Seleccione un bloque');
      return;
    }
    this.isLoading = true;
    this.parkingService
      .getParkingSpaces(this.selectedBlock!.id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((api) => {
        this.parkingSpaces = api.data;
      });
  }
}
