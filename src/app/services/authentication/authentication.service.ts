import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from '@angular/fire/auth';
import { BehaviorSubject, catchError, from, map, Observable } from 'rxjs';
import { User } from '../../models/user';
import { collection, Firestore } from '@angular/fire/firestore';
import { addDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private firebaseAuth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.firebaseAuth, (user) => {
      if (user) {
        const appUser: User = {
          id: user.uid,
          email: user.email,
          nombre: null,
          apellido: null,
          telefono: null,
          genero: null,
          fechaNacimiento: null,
          password: null,
          rol: 'user',
          fechaRegistro: undefined,
          activo: true,
          actualizarPerfil: false,
        };
        return this.currentUserSubject.next(appUser);
      } else {
        return this.currentUserSubject.next(null);
      }
    });
  }
  registerWithUserAndPass(user: User) {
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
        (resp) => {
          this.saveUserInfo({
            id: resp.user?.uid,
            email: null,
            nombre: null,
            apellido: null,
            telefono: null,
            genero: null,
            fechaNacimiento: null,
            password: null,
            rol: 'user',
            fechaRegistro: undefined,
            activo: true,
            actualizarPerfil: true,
          });
        }
      )
    );
  }

  saveUserInfo(user: User) {
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

  isLogged() {
    return this.currentUserSubject.asObservable().pipe(map((user) => !!user));
  }
  logout(): Promise<void> {
    return this.firebaseAuth.signOut();
  }
}
