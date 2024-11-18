import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  constructor(private firestore: Firestore) {}

  async getAllParkingData() {
    const now = new Date();

    const spacesRef = collection(this.firestore, 'parkingSpaces');
    const spacesSnapshot = await getDocs(spacesRef);
    const spaces = spacesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const contractsRef = collection(this.firestore, 'contracts');
    const contractsQuery = query(
      contractsRef,
      where('startDate', '<=', now.toISOString()),
      where('endDate', '>=', now.toISOString())
    );
    const contractsSnapshot = await getDocs(contractsQuery);
    const activeContracts = contractsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(activeContracts);

    const occupationsRef = collection(this.firestore, 'occupations');
    const occupationsQuery = query(
      occupationsRef,
      where('startTime', '<=', now.toISOString()),
      where('endTime', '>=', now.toISOString())
    );
    const occupationsSnapshot = await getDocs(occupationsQuery);
    const activeOccupations = occupationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(activeOccupations);

    // Combinar la información
    const combinedData = spaces.map((space) => {
      const occupiedByContract = activeContracts.find(
        (contract: any) => contract.parkingSpaceId === space.id
      );
      const occupiedByOccupation = activeOccupations.find(
        (occupation: any) => occupation.parkingSpaceId === space.id
      );

      return {
        ...space,
        status: occupiedByContract
          ? 'monthlyContract'
          : occupiedByOccupation
          ? 'occupied'
          : 'available',
        contract: occupiedByContract || null,
        occupation: occupiedByOccupation || null,
      };
    });

    return combinedData;
  }
}
