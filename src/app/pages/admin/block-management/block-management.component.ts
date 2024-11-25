import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BlocksService } from '../../../services/blocks/blocks.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-block-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './block-management.component.html',
  styleUrl: './block-management.component.scss',
})
export class BlockManagementComponent implements OnInit {
  blockForm: FormGroup;
  parkingSpaceForm: FormGroup;
  blocks: any[] = [];
  rates: any[] = [];
  selectedBlockId: string | null = null;

  constructor(private blockService: BlocksService, private fb: FormBuilder) {
    this.blockForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.parkingSpaceForm = this.fb.group({
      rateId: ['', Validators.required], // Relación con la tarifa seleccionada
    });
  }

  async ngOnInit(): Promise<void> {
    // Suscribirse a los bloques
    this.blockService.getBlocks().subscribe((blocks) => {
      this.blocks = blocks;
      console.log('Bloques cargados:', this.blocks);
    });

    // Obtener tarifas al iniciar
    this.rates = await this.blockService.getRates();
    console.log('Tarifas cargadas:', this.rates);
  }

  async addBlock(): Promise<void> {
    if (this.blockForm.invalid) return;

    const blockData = {
      nombre: this.blockForm.value.name,
      parkingSpaces: [],
    };

    await this.blockService.addBlock(blockData);
    this.blockForm.reset();
    alert('Bloque añadido exitosamente!');
  }

  async addParkingSpace(): Promise<void> {
    console.log('Formulario:', this.parkingSpaceForm.value);
    console.log('Bloque seleccionado:', this.selectedBlockId);

    if (this.parkingSpaceForm.invalid || !this.selectedBlockId) {
      console.error('Formulario inválido o no hay bloque seleccionado');
      return;
    }

    const selectedRate = this.rates.find(
      (rate) => rate.id === this.parkingSpaceForm.value.rateId
    );

    if (!selectedRate) {
      alert('Tarifa seleccionada no válida');
      return;
    }

    const parkingSpaceData = {
      type: selectedRate.type, // Derivar el tipo directamente de la tarifa seleccionada.
      precioPorHora: selectedRate.precioPorHora,
      precioPorDia: selectedRate.precioPorDia,
      precioPorSemana: selectedRate.precioPorSemana,
      precioPorMes: selectedRate.precioPorMes,
    };

    console.log('Datos del Parking Space:', parkingSpaceData);

    await this.blockService.addParkingSpaceToBlock(
      this.selectedBlockId,
      parkingSpaceData
    );

    this.parkingSpaceForm.reset();
    alert('Parking space añadido exitosamente!');
  }

  selectBlock(blockId: string): void {
    console.log('Bloque seleccionado:', blockId);
    this.selectedBlockId = blockId;
  }
}
