import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Contract } from '../../models/parking/contract';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { ParkingService } from '../../services/parking/parking.service';
@Component({
  selector: 'app-event-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzDescriptionsModule,
    NzTagModule,
    NzButtonModule,
  ],
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.scss',
})
export class EventModalComponent implements OnInit {
  contract: Contract | null = null;
  constructor(
    @Inject(NZ_MODAL_DATA) public data: any,
    private modalRef: NzModalRef,
    private contractService: ParkingService
  ) {}
  ngOnInit(): void {
    this.contract = this.data.contrato;
  }

  cerrar() {
    this.modalRef.close();
  }
  eliminar() {
    this.contractService.deleteContract(this.contract?.id!).subscribe(
      (response) => {
        this.modalRef.close(true);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
