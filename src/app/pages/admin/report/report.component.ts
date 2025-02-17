import { Component } from '@angular/core';
import { ParkingService } from '../../../services/parking/parking.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ContractType } from '../../../models/parking/contract';
import { ParkingSpace } from '../../../models/parking/block';
import { Vehicle } from '../../../models/person/profile';
import { ReportService } from '../../../services/report/report.service';
import { SelectUserComponent } from '../../../modals/select-user/select-user.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ContractFilter, TicketFilter } from '../../../models/report/report';
@Component({
  selector: 'app-report',
  imports: [
    NzTableModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSpinModule,
    NzButtonModule,
    NzSelectModule,
    NzTagModule,
    NzDatePickerModule,
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
})
export class ReportComponent {
  reportForm!: FormGroup;
  reportType: string = 'contract'; // 'contract' o 'ticket'
  reportData: any[] = [];
  isLoading: boolean = false;
  parkingSpaces: ParkingSpace[] = [];
  contractTypes: ContractType[] = [];
  selectedVehicle: Vehicle | null = null;

  constructor(
    private fb: FormBuilder,
    private parkingService: ParkingService,
    private modalService: NzModalService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadParkingSpaces();
    this.loadContractTypes();
  }

  initializeForm() {
    this.reportForm = this.fb.group({
      active: [null],
      parkingSpace: [null],
      vehicle: [null],
      startDate: [null],
      finishDate: [null],
      contractType: [null], // Solo para contratos
    });
  }

  loadParkingSpaces() {
    this.parkingService.getParkingSpacesAll().subscribe((response) => {
      this.parkingSpaces = response.data;
    });
  }

  loadContractTypes() {
    if (this.reportType === 'contract') {
      this.parkingService.getContractTypes().subscribe((response) => {
        this.contractTypes = response.data;
      });
    }
  }

  generateReport() {
    this.isLoading = true;
    let filterData = { ...this.reportForm.value };

    if (this.reportType === 'contract') {
      this.reportService.getContracts(filterData as ContractFilter).subscribe(
        (response) => {
          this.reportData = response.data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al obtener el reporte de contratos', error);
          this.isLoading = false;
        }
      );
    } else {
      const filter: TicketFilter = {
        active: filterData.active || null,
        parkingSpace: filterData.parkingSpace || null,
        vehicle: filterData.vehicle || null,
        startDate: filterData.startDate ? filterData.startDate : null,
        finishDate: filterData.finishDate ? filterData.finishDate : null,
      };

      this.reportService.getTickets(filter).subscribe(
        (response) => {
          this.reportData = response.data;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al obtener el reporte de tickets', error);
          this.isLoading = false;
        }
      );
    }
  }

  /**
   * Convierte una fecha en formato desconocido a un objeto Date válido.
   */

  changeReportType(type: string) {
    this.reportType = type;
    this.reportForm.reset(); // Limpiar el formulario cuando cambie el tipo
    this.loadContractTypes(); // Si es contrato, cargar tipos de contrato
  }

  seleccionarUsuario() {
    this.modalService
      .create({
        nzContent: SelectUserComponent,
        nzFooter: null,
        nzTitle: 'Seleccionar usuario',
      })
      .afterClose.subscribe((result) => {
        if (result) {
          this.selectedVehicle = result;
          this.reportForm.patchValue({ vehicle: result.id });
        }
      });
  }
}
