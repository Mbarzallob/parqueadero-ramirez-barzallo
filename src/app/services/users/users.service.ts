import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  Firestore,
  getDocs,
  where,
  query,
  updateDoc,
  doc,
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
  async updateUser(user: any) {
    console.log(user);
    const userCollectionRef = collection(this.firestore, 'users');
    const userQuery = query(userCollectionRef, where('id', '==', user.id));

    return getDocs(userQuery).then((querySnapshot) => {
      if (querySnapshot.empty) {
        throw new Error(
          'No se encontró ningún documento con el ID proporcionado.'
        );
      }

      const docId = querySnapshot.docs[0].id;
      const userDocRef = doc(this.firestore, `users/${docId}`);

      return updateDoc(userDocRef, user);
    });
  }
}
