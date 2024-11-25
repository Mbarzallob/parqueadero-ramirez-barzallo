import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocs,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  private horarioCollection = 'horario';

  constructor(private firestore: Firestore) {}

  async getHorarios(): Promise<any[]> {
    const horarios: any[] = [];
    const horarioRef = collection(this.firestore, this.horarioCollection);
    const snapshot = await getDocs(horarioRef);
    snapshot.forEach((doc) => {
      horarios.push({ id: doc.id, ...doc.data() });
    });
    return horarios;
  }

  async addHorario(horario: any): Promise<void> {
    const horarioRef = collection(this.firestore, this.horarioCollection);
    await addDoc(horarioRef, horario);
  }

  async updateHorario(id: string, horario: any): Promise<void> {
    const horarioDoc = doc(this.firestore, `${this.horarioCollection}/${id}`);
    await updateDoc(horarioDoc, horario);
  }

  async deleteHorario(id: string): Promise<void> {
    const horarioDoc = doc(this.firestore, `${this.horarioCollection}/${id}`);
    await deleteDoc(horarioDoc);
  }
}
