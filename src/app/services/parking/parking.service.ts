import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  constructor(private firestore: Firestore) {}

  async getAllBlocks() {
    const blocksRef = collection(this.firestore, 'blocks');
    const blocksSnapshot = await getDocs(blocksRef);
    const blocks = blocksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return blocks;
  }
  async getParkingLot(blockId: string, parkingLotId: string) {
    const blockRef = doc(this.firestore, `blocks/${blockId}`);
    const blockSnapshot = await getDoc(blockRef);

    if (blockSnapshot.exists()) {
      const blockData = blockSnapshot.data();
      const parkingSpaces = blockData?.['parkingSpaces'] || [];

      const parkingLot = parkingSpaces.find(
        (lot: any) => lot.id === parkingLotId
      );

      return parkingLot || null;
    } else {
      throw new Error(`Block with id ${blockId} does not exist.`);
    }
  }
  async addContractToParkingLot(
    blockId: string,
    parkingLotId: string,
    contractType:
      | 'ContratosPorHora'
      | 'ContratosDiarios'
      | 'ContratosSemanales'
      | 'ContratosMensuales',
    contractData: any
  ) {
    contractData.status = 'active'; // Agregar el estado del contrato
    const blockRef = doc(this.firestore, `blocks/${blockId}`);
    const blockSnapshot = await getDoc(blockRef);

    if (!blockSnapshot.exists()) {
      throw new Error(`Block with id ${blockId} does not exist.`);
    }

    const blockData = blockSnapshot.data();
    const parkingSpaces = blockData?.['parkingSpaces'] || [];

    const parkingLotIndex = parkingSpaces.findIndex(
      (lot: any) => lot.id === parkingLotId
    );

    if (parkingLotIndex === -1) {
      throw new Error(`Parking lot with id ${parkingLotId} does not exist.`);
    }

    // Añadir el contrato a la lista correspondiente
    const updatedParkingSpaces = [...parkingSpaces];
    const targetParkingLot = { ...updatedParkingSpaces[parkingLotIndex] };

    if (!targetParkingLot[contractType]) {
      targetParkingLot[contractType] = []; // Inicializar la lista si no existe
    }

    targetParkingLot[contractType].push(contractData); // Agregar el contrato
    updatedParkingSpaces[parkingLotIndex] = targetParkingLot;

    // Actualizar el documento en Firestore
    await updateDoc(blockRef, { parkingSpaces: updatedParkingSpaces });

    return true;
  }
  async updateContractStatus(
    blockId: string,
    parkingLotId: string,
    contractType:
      | 'ContratosPorHora'
      | 'ContratosDiarios'
      | 'ContratosSemanales'
      | 'ContratosMensuales',
    contractIndex: number,
    newStatus: 'active' | 'inactive'
  ) {
    // Obtener referencia del bloque
    const blockRef = doc(this.firestore, `blocks/${blockId}`);
    const blockSnapshot = await getDoc(blockRef);

    if (!blockSnapshot.exists()) {
      throw new Error(`Block with id ${blockId} does not exist.`);
    }

    const blockData = blockSnapshot.data();
    const parkingSpaces = blockData?.['parkingSpaces'] || [];

    // Buscar el índice del espacio de estacionamiento
    const parkingLotIndex = parkingSpaces.findIndex(
      (lot: any) => lot.id === parkingLotId
    );

    if (parkingLotIndex === -1) {
      throw new Error(`Parking lot with id ${parkingLotId} does not exist.`);
    }

    // Crear una copia actualizable de los espacios de estacionamiento
    const updatedParkingSpaces = [...parkingSpaces];
    const targetParkingLot = { ...updatedParkingSpaces[parkingLotIndex] };

    // Validar que el contrato exista dentro del tipo correspondiente
    const contracts = targetParkingLot[contractType] || [];

    if (!contracts[contractIndex]) {
      throw new Error(
        `Contract at index ${contractIndex} does not exist in ${contractType}.`
      );
    }

    // Actualizar el estado del contrato
    contracts[contractIndex].status = newStatus;
    targetParkingLot[contractType] = contracts;
    updatedParkingSpaces[parkingLotIndex] = targetParkingLot;

    // Actualizar Firestore con los datos modificados
    await updateDoc(blockRef, { parkingSpaces: updatedParkingSpaces });

    return true;
  }
}
