import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HorariosService } from '../../../services/horarios/horarios.service';
import { CommonModule } from '@angular/common';
import { TimestampToDatePipe } from '../../../pipes/timestamp-to-date.pipe';
import { timestampToDate } from '../../../utils/firebase-helper';

@Component({
  selector: 'app-horario-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TimestampToDatePipe,
  ],
  templateUrl: './horario-management.component.html',
  styleUrl: './horario-management.component.scss',
})
export class HorarioManagementComponent {
  horarioForm: FormGroup;
  horarios: any[] = [];
  isEditing: boolean = false;
  selectedHorarioId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private horarioService: HorariosService
  ) {
    this.horarioForm = this.fb.group({
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
    });
  }

  async ngOnInit(): Promise<void> {
    try {
      this.horarios = await this.horarioService.getHorarios();
    } catch (error) {
      console.error('Error al cargar horarios:', error);
    }
  }

  async addHorario(): Promise<void> {
    if (this.horarioForm.invalid) return;

    // Convertir los valores del formulario a Date
    const newHorario = {
      inicio: new Date(this.horarioForm.value.inicio),
      fin: new Date(this.horarioForm.value.fin),
    };

    for (const horario of this.horarios) {
      const horarioInicio = timestampToDate(horario.inicio);
      const horarioFin = timestampToDate(horario.fin);

      if (
        (newHorario.inicio >= horarioInicio &&
          newHorario.inicio < horarioFin) || // Inicio dentro de otro horario
        (newHorario.fin > horarioInicio && newHorario.fin <= horarioFin) || // Fin dentro de otro horario
        (newHorario.inicio <= horarioInicio && newHorario.fin >= horarioFin) // Nuevo horario abarca a otro horario
      ) {
        alert('El horario se solapa con un horario existente.');
        return;
      }
    }
    try {
      if (this.isEditing && this.selectedHorarioId) {
        await this.horarioService.updateHorario(
          this.selectedHorarioId,
          newHorario
        );
        alert('Horario actualizado exitosamente.');
      } else {
        await this.horarioService.addHorario(newHorario);
        alert('Horario agregado exitosamente.');
      }

      this.horarios = await this.horarioService.getHorarios();
      this.resetForm();
    } catch (error) {
      console.error('Error al agregar/actualizar horario:', error);
    }
  }

  editHorario(horario: any): void {
    this.isEditing = true;
    this.selectedHorarioId = horario.id;

    // Convertir Timestamp a formato compatible con <input type="datetime-local">
    const inicio = this.formatDateForInput(timestampToDate(horario.inicio));
    const fin = this.formatDateForInput(timestampToDate(horario.fin));

    this.horarioForm.patchValue({
      inicio: inicio,
      fin: fin,
    });
  }

  async deleteHorario(id: string): Promise<void> {
    if (!confirm('¿Estás seguro de eliminar este horario?')) return;

    try {
      await this.horarioService.deleteHorario(id);
      this.horarios = await this.horarioService.getHorarios();
      alert('Horario eliminado exitosamente.');
    } catch (error) {
      console.error('Error al eliminar horario:', error);
    }
  }

  resetForm(): void {
    this.isEditing = false;
    this.selectedHorarioId = null;
    this.horarioForm.reset();
  }
  private formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son base 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}
