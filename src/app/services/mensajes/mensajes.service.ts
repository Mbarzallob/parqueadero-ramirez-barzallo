import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  constructor(private firestore: Firestore) {}
  async addMensaje(mensaje: any): Promise<void> {
    const mensajeRef = collection(this.firestore, 'mensajes');
    await addDoc(mensajeRef, mensaje);
  }
}
