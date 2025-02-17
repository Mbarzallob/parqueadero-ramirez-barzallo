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
import { Block, ParkingSpaceType } from '../../../models/parking/block';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RatesService } from '../../../services/rates/rates.service';

@Component({
  selector: 'app-block-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NzButtonModule],
  templateUrl: './block-management.component.html',
  styleUrl: './block-management.component.scss',
})
export class BlockManagementComponent implements OnInit {
  blockForm: FormGroup;
  parkingSpaceForm: FormGroup;
  loading: boolean = false;
  blocks: Block[] = [];
  rates: ParkingSpaceType[] = [];
  selectedBlockId: number | null = null;

  constructor(
    private blockService: BlocksService,
    private fb: FormBuilder,
    private message: NzMessageService,
    private ratesService: RatesService
  ) {
    this.blockForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.parkingSpaceForm = this.fb.group({
      rateId: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getBlocks();
    this.getRates();
  }

  getBlocks() {
    this.blockService.getBlocks().subscribe((response) => {
      this.blocks = response.data;
    });
  }

  addBlock() {
    const { name } = this.blockForm.value;
    this.loading = true;
    this.blockService
      .addBlock(name)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          this.getBlocks();
          this.blockForm.reset();
          this.message.success('Bloque agregado');
        },
        (error) => {
          this.message.error(error);
        }
      );
  }

  getRates() {
    this.ratesService.getRates().subscribe((response) => {
      this.rates = response.data;
    });
  }

  selectBlock(blockId: number): void {
    this.selectedBlockId = blockId;
  }

  addParkingSpace() {
    if (!this.parkingSpaceForm.valid) {
      this.message.error('Complete todos los campos');
      return;
    }
    const { rateId } = this.parkingSpaceForm.value;
    if (!this.selectedBlockId) {
      this.message.error('Seleccione un bloque');
      return;
    }
    this.loading = true;
    this.blockService
      .addParkingSpace(this.selectedBlockId, rateId)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(
        () => {
          this.getBlocks();
          this.parkingSpaceForm.reset();
          this.message.success('Espacio de parqueo agregado');
        },
        (error) => {
          this.message.error(error);
        }
      );
  }
}
