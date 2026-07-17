import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type: 'success' | 'error' | 'info';
}
@Injectable({
  providedIn: 'root'
})
export class Snackservice {
   private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toastState$ = this.toastSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.toastSubject.next({ text: message, type });
  }

  clear() {
    this.toastSubject.next(null);
  }
  
}
