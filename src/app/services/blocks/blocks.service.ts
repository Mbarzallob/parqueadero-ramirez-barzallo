import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BlocksService {
  constructor(private firestore: Firestore) {}

  getBlocks(): Observable<any[]> {
    const blocksRef = collection(this.firestore, 'blocks');
    return collectionData(blocksRef, { idField: 'id' }); // Incluye el ID del documento
  }

  // Obtener tarifas
  async getRates(): Promise<any[]> {
    const ratesRef = collection(this.firestore, 'rates');
    const snapshot = await getDocs(ratesRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  // Añadir un bloque
  async addBlock(blockData: any): Promise<void> {
    const blocksRef = collection(this.firestore, 'blocks');
    await addDoc(blocksRef, blockData);
  }

  // Añadir un espacio de parking a un bloque
  async addParkingSpaceToBlock(
    blockId: string,
    parkingSpaceData: any
  ): Promise<void> {
    const blockRef = doc(this.firestore, `blocks/${blockId}`);
    const blockSnapshot = await getDoc(blockRef);

    if (!blockSnapshot.exists()) {
      throw new Error(`Block with id ${blockId} does not exist.`);
    }

    const blockData = blockSnapshot.data();
    const parkingSpaces = blockData?.['parkingSpaces'] || [];

    // Generar el nuevo ID basado en la longitud actual de parkingSpaces
    const newId = (parkingSpaces.length + 1).toString();
    console.log('Nuevo ID:', newId);
    const parkingSpace = {
      id: newId,
      ...parkingSpaceData,
      ContratosDiarios: [],
      ContratosPorHora: [],
      ContratosSemanales: [],
      ContratosMensuales: [],
    };

    parkingSpaces.push(parkingSpace);

    // Actualizar el bloque en Firestore
    await updateDoc(blockRef, { parkingSpaces });
  }
}
