import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
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
}
