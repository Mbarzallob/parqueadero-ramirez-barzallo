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

  async getUsers(todos: boolean = true) {
    const usersRef = collection(this.firestore, 'users');
    const constraints = [where('rol', '!=', 'admin')];
    if (!todos) {
      console.log('entro');
      constraints.push(where('actualizarPerfil', '==', false));
    }
    const usersQuery = query(usersRef, ...constraints);
    const usersSnapshot = await getDocs(usersQuery);
    const activeusers = usersSnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));

    return activeusers;
  }
  async updateUser(user: any) {
    console.log(user);
    const userCollectionRef = collection(this.firestore, 'users');
    const constraints = [where('id', '==', user.id)];

    const userQuery = query(userCollectionRef, ...constraints);

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
