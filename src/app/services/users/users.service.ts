import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDocs,
  where,
  query,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  async getUsers() {
    const usersRef = collection(this.firestore, 'users');
    const usersQuery = query(usersRef, where('rol', '!=', 'admin'));
    const usersSnapshot = await getDocs(usersQuery);
    const activeusers = usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return activeusers;
  }
}
