import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RatesService {
  constructor(private firestore: Firestore) {}
  async getRates(): Promise<any[]> {
    const ratesCollection = collection(this.firestore, 'rates');
    const querySnapshot = await getDocs(ratesCollection);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  async updateRate(rate: any): Promise<void> {
    const rateDoc = doc(this.firestore, `rates/${rate.id}`);
    await updateDoc(rateDoc, {
      precioPorHora: rate.precioPorHora,
      precioPorDia: rate.precioPorDia,
      precioPorSemana: rate.precioPorSemana,
      precioPorMes: rate.precioPorMes,
    });
  }
  async updateParkingSpacesWithRate(rate: any): Promise<void> {
    const blocksCollection = collection(this.firestore, 'blocks');
    const querySnapshot = await getDocs(blocksCollection);

    querySnapshot.forEach(async (blockDoc) => {
      const blockData = blockDoc.data();
      const parkingSpaces = blockData['parkingSpaces'] || [];

      // Actualizar las tarifas de cada espacio de estacionamiento
      const updatedParkingSpaces = parkingSpaces.map((parkingSpace: any) => {
        if (parkingSpace.type === rate.type) {
          return {
            ...parkingSpace,
            precioPorHora: rate.precioPorHora,
            precioPorDia: rate.precioPorDia,
            precioPorSemana: rate.precioPorSemana,
            precioPorMes: rate.precioPorMes,
          };
        }
        return parkingSpace;
      });

      // Actualizar el documento del bloque en Firestore
      const blockRef = doc(this.firestore, `blocks/${blockDoc.id}`);
      await updateDoc(blockRef, { parkingSpaces: updatedParkingSpaces });
    });
  }
}
