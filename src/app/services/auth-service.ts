import { Injectable } from '@angular/core';
import {  Auth , createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { LoaderService } from './loader-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user$ = new BehaviorSubject<User | null>(null);
    authInitialized$ = new BehaviorSubject<boolean>(false);
  readonly demoAdminEmail = 'ahmed.m.2457@gmail.com';

  constructor(private auth: Auth,private loader: LoaderService) {
  
     onAuthStateChanged(this.auth, async (user) => {
    this.user$.next(user);

    if (user) {
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
      localStorage.setItem("isAdmin", user.email === this.demoAdminEmail ? "true" : "false");
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("isAdmin");
    }
    this.authInitialized$.next(true);
  });
}

  
  

  // register(email: string, password: string) {
  //   return createUserWithEmailAndPassword(this.auth, email, password);
  // }

  // login(email: string, password: string) {
  //   return signInWithEmailAndPassword(this.auth, email, password);
  // }

  // googleSignIn() {
  //   const provider = new GoogleAuthProvider();
  //   return signInWithPopup(this.auth, provider);
  // }

  // logout() {
  //   localStorage.removeItem('authToken');
  //   localStorage.removeItem('isAdmin');
  //   return signOut(this.auth);
  // }
    register(email: string, password: string) {
    this.loader.show();
    return createUserWithEmailAndPassword(this.auth, email, password)
      .finally(() => this.loader.hide());
  }

  login(email: string, password: string) {
    this.loader.show();
    return signInWithEmailAndPassword(this.auth, email, password)
      .finally(() => this.loader.hide());
  }

  googleSignIn() {
    const provider = new GoogleAuthProvider();
    this.loader.show();
    return signInWithPopup(this.auth, provider)
      .finally(() => this.loader.hide());
  }

  logout() {
    this.loader.show();
    return signOut(this.auth)
      .finally(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAdmin');
        this.loader.hide();
      });
  }
  //   isLoggedIn(): boolean {
  //   return !!localStorage.getItem('authToken');
  // }

 
  //   isAdmin(): boolean {
  //   return localStorage.getItem('isAdmin') === 'true';
  // }

  isLoggedIn(): boolean {
  return this.user$.value !== null;
}

isAdmin(): boolean {
  return this.user$.value?.email === this.demoAdminEmail;
}
}
