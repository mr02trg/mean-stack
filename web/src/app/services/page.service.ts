import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  constructor() { 
  }

  showPadding: boolean = true;
  showPaddingSubject: BehaviorSubject<boolean> =  new BehaviorSubject<boolean>(this.showPadding);

  getPadding(): Observable<boolean> {
    return this.showPaddingSubject.asObservable();
  }

  setPadding(value: boolean) {
    this.showPadding = value;
    this.showPaddingSubject.next(value);
  }
}
