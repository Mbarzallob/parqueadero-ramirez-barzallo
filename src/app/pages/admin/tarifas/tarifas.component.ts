import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RatesService } from '../../../services/rates/rates.service';

@Component({
  selector: 'app-tarifas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tarifas.component.html',
  styleUrl: './tarifas.component.scss',
})
export class TarifasComponent {
  rates: any[] = [];

  constructor(private ratesService: RatesService) {}

  ngOnInit(): void {
    this.fetchRates();
  }

  async fetchRates(): Promise<void> {
    try {
      this.rates = await this.ratesService.getRates();
    } catch (error) {
      console.error('Error fetching rates:', error);
    }
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
    } catch (error) {
      console.error('Error actualizando tarifa:', error);
      alert('Error al actualizar la tarifa. Por favor, inténtalo nuevamente.');
    }
  }
}
