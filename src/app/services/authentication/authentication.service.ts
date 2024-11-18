import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@angular/fire/auth';
import {
  BehaviorSubject,
  catchError,
  from,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { collection, Firestore } from '@angular/fire/firestore';
import {
  addDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject = new BehaviorSubject<any | null>(null);

  constructor(private firebaseAuth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.firebaseAuth, (user) => {
      if (user) {
        const appUser = {
          id: user.uid,
          email: user.email,
        };
        return this.currentUserSubject.next(appUser);
      } else {
        return this.currentUserSubject.next(null);
      }
    });
  }
  signIn(user: any) {
    return from(
      signInWithEmailAndPassword(this.firebaseAuth, user.email!, user.password!)
    ).pipe(
      switchMap(async (resp) => {
        const userId = resp.user?.uid; // UID del usuario autenticado

        // Verificar si el UID es válido
        if (!userId) {
          throw new Error('No se pudo obtener el UID del usuario.');
        }

        // Consultar la colección para buscar el documento correspondiente
        const userRef = collection(this.firestore, 'users');
        const q = query(userRef, where('id', '==', userId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No se encontró ningún documento para este usuario.');
        }

        // Obtener el documento correspondiente
        const userDoc = querySnapshot.docs[0].data(); // Primer documento encontrado
        const userRole = userDoc?.['rol']; // Campo "rol" del documento

        if (!userRole) {
          throw new Error(
            'El campo "rol" no está definido en el documento del usuario.'
          );
        }

        // Guardar el rol en el localStorage
        localStorage.setItem('rol', userRole);

        return { uid: userId, rol: userRole }; // Puedes devolver más información si es necesario
      }),
      catchError((error) => {
        console.error('Error en el inicio de sesión:', error);
        throw error; // Lanza el error para que se pueda manejar desde donde se llama al método
      })
    );
  }

  obtenerRol() {
    return localStorage.getItem('rol');
  }

  registerWithUserAndPass(user: any) {
    return from(
      createUserWithEmailAndPassword(
        this.firebaseAuth,
        user.email!,
        user.password!
      ).then((resp) => {
        user.id = resp.user?.uid;
        user.actualizarPerfil = false;
        this.saveUserInfo(user);
      })
    );
  }
  registerWithGoogle() {
    return from(
      signInWithPopup(this.firebaseAuth, new GoogleAuthProvider()).then(
        async (resp) => {
          const userId = resp.user?.uid;

          const userRef = collection(this.firestore, 'users');
          const userQuery = query(userRef, where('id', '==', userId));

          const querySnapshot = await getDocs(userQuery);
          if (querySnapshot.empty) {
            this.saveUserInfo({
              id: resp.user?.uid,
              nombre: null,
              apellido: null,
              telefono: null,
              genero: null,
              fechaNacimiento: null,

              actualizarPerfil: true,
            });
          }
        }
      )
    );
  }

  saveUserInfo(user: any) {
    const userInfo = {
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
      genero: user.genero,
      fechaRegistro: new Date(),
      activo: true,
      fechaNacimiento: user.fechaNacimiento,
      rol: 'user',
      id: user.id,
      actualizarPerfil: user.actualizarPerfil,
    };
    const userRef = collection(this.firestore, 'users');
    return addDoc(userRef, userInfo);
  }

  updateUserInfo(updateData: any) {
    const userId = this.currentUserSubject.value?.id;

    if (!userId) {
      console.error('No se pudo obtener el ID del usuario actual.');
      return Promise.reject('Usuario no autenticado o no válido.');
    }

    const userCollectionRef = collection(this.firestore, 'users');
    const userQuery = query(userCollectionRef, where('id', '==', userId));

    return getDocs(userQuery)
      .then((querySnapshot) => {
        if (querySnapshot.empty) {
          throw new Error(
            'No se encontró ningún documento con el ID proporcionado.'
          );
        }

        const docId = querySnapshot.docs[0].id;
        const userDocRef = doc(this.firestore, `users/${docId}`);

        return updateDoc(userDocRef, updateData);
      })
      .then(() => {
        console.log('Información del usuario actualizada con éxito.');
      })
      .catch((error) => {
        console.error('Error al actualizar la información del usuario:', error);
      });
  }

  getInformationUser(): Observable<any> {
    const documentId = this.currentUserSubject.value?.id;
    const userCollection = collection(this.firestore, 'users');
    const q = query(userCollection, where('id', '==', documentId));
    return from(
      getDocs(q).then((querySnapshot) => {
        const results: any[] = [];
        querySnapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });
        return results[0];
      })
    );
  }

  isLogged() {
    const val = this.currentUserSubject
      .asObservable()
      .pipe(map((user) => !!user));
    return val;
  }
  logout(): Promise<void> {
    localStorage.removeItem('rol');
    return this.firebaseAuth.signOut();
  }

  async loadSampleData() {
    const now = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(now.getMonth() + 1);

    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Datos de ejemplo para parkingSpaces
    const parkingSpaces = [
      {
        id: 'A1',
        block: 'A',
        type: 'small',
        pricePerHour: 2.0,
        pricePerMonth: 50.0,
      },
      {
        id: 'A2',
        block: 'A',
        type: 'medium',
        pricePerHour: 3.0,
        pricePerMonth: 60.0,
      },
      {
        id: 'A3',
        block: 'A',
        type: 'large',
        pricePerHour: 4.0,
        pricePerMonth: 80.0,
      },
      {
        id: 'B1',
        block: 'B',
        type: 'small',
        pricePerHour: 2.5,
        pricePerMonth: 55.0,
      },
      {
        id: 'B2',
        block: 'B',
        type: 'medium',
        pricePerHour: 3.5,
        pricePerMonth: 65.0,
      },
      {
        id: 'B3',
        block: 'B',
        type: 'large',
        pricePerHour: 4.5,
        pricePerMonth: 85.0,
      },
      {
        id: 'C1',
        block: 'C',
        type: 'small',
        pricePerHour: 2.2,
        pricePerMonth: 52.0,
      },
      {
        id: 'C2',
        block: 'C',
        type: 'medium',
        pricePerHour: 3.2,
        pricePerMonth: 62.0,
      },
      {
        id: 'C3',
        block: 'C',
        type: 'large',
        pricePerHour: 4.2,
        pricePerMonth: 82.0,
      },
      {
        id: 'D1',
        block: 'D',
        type: 'moto',
        pricePerHour: 1.0,
        pricePerMonth: 20.0,
      },
    ];

    // Datos de ejemplo para contracts
    const contracts = [
      {
        id: 'contract1',
        userId: '137WDjd6y2U50Fr7y5qdZgqBjmL2',
        parkingSpaceId: 'A1',
        startDate: now.toISOString(),
        endDate: oneMonthLater.toISOString(),
        monthlyRate: 50.0,
      },
    ];

    // Datos de ejemplo para occupations
    const occupations = [
      {
        id: 'occupation1',
        parkingSpaceId: 'A2',
        userId: 'XjJItbAI2ZbAJfeR0xom0HWhAkz2',
        startTime: now.toISOString(),
        endTime: twoHoursLater.toISOString(),
        rate: 6.0,
      },
    ];

    // Usamos batch para escribir en Firestore
    const batch = writeBatch(this.firestore);

    // Agregar datos a parkingSpaces
    parkingSpaces.forEach((space) => {
      const docRef = doc(this.firestore, `parkingSpaces/${space.id}`);
      batch.set(docRef, space);
    });

    // Agregar datos a contracts
    contracts.forEach((contract) => {
      const docRef = doc(this.firestore, `contracts/${contract.id}`);
      batch.set(docRef, contract);
    });

    // Agregar datos a occupations
    occupations.forEach((occupation) => {
      const docRef = doc(this.firestore, `occupations/${occupation.id}`);
      batch.set(docRef, occupation);
    });

    // Ejecutar batch
    await batch.commit();
    console.log('Datos cargados exitosamente.');
  }
}
