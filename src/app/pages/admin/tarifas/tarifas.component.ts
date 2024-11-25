import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatesService } from '../../../services/rates/rates.service';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.scss',
})
export class TarifasComponent implements OnInit {
  rates: any[] = [];
  originalRates: any[] = [];
  showSaveButtons: boolean[] = []; // Arreglo para controlar visibilidad de botones individuales

  constructor(private ratesService: RatesService) {}

  ngOnInit(): void {
    this.fetchRates();
  }

  async fetchRates(): Promise<void> {
    try {
      this.rates = await this.ratesService.getRates();
      this.originalRates = JSON.parse(JSON.stringify(this.rates)); // Copiar tarifas originales
      this.showSaveButtons = new Array(this.rates.length).fill(false); // Inicializar los botones como ocultos
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
  }

  checkChanges(index: number): void {
    const hasChanges = !this.compareRates(
      this.rates[index],
      this.originalRates[index]
    );
    this.showSaveButtons[index] = hasChanges; // Actualizar visibilidad del botón
  }

  compareRates(rate1: any, rate2: any): boolean {
    return (
      rate1.precioPorHora === rate2.precioPorHora &&
      rate1.precioPorDia === rate2.precioPorDia &&
      rate1.precioPorSemana === rate2.precioPorSemana &&
      rate1.precioPorMes === rate2.precioPorMes
    );
  }

  async updateRate(index: number): Promise<void> {
    const updatedRate = this.rates[index];

    try {
      // Actualizar tarifa en la colección "rates"
      await this.ratesService.updateRate(updatedRate);

      // Actualizar todos los parkingSpaces con esta tarifa
      await this.ratesService.updateParkingSpacesWithRate(updatedRate);

      alert(
        'Tarifa actualizada con éxito y aplicada a todos los espacios de estacionamiento.'
      );

      // Sincronizar tarifas originales después de guardar
      this.originalRates[index] = { ...updatedRate };
      this.showSaveButtons[index] = false; // Ocultar el botón después de guardar
    } catch (error) {
      console.error('Error actualizando tarifa:', error);
      alert('Error al actualizar la tarifa. Por favor, inténtalo nuevamente.');
    }
  }
}
