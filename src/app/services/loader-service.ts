import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
   private _count = 0;
  private _loading$ = new BehaviorSubject<boolean>(false);

  // Observable للـ component
  get isLoading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  // إظهار الـ loader (يزيد العداد)
  show() {
    this._count++;
    if (this._count === 1) {
      this._loading$.next(true);
    }
  }

  // إخفاء الـ loader (ينقص العداد)
  hide() {
    if (this._count === 0) return;
    this._count--;
    if (this._count === 0) {
      this._loading$.next(false);
    }
  }

  // لإعادة الحالة (فائدة عند أخطاء غير متوقعة)
  reset() {
    this._count = 0;
    this._loading$.next(false);
  }
  
}
