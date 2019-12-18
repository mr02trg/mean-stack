import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor() { }

  showSpinner: boolean = false;
  showSpinnerSubject = new BehaviorSubject<boolean>(this.showSpinner);

  getSpinner() {
    return this.showSpinnerSubject.asObservable();
  }

  show() {
    this.showSpinner = true;
    this.showSpinnerSubject.next(this.showSpinner);
  }

  hide() {
    this.showSpinner = false;
    this.showSpinnerSubject.next(this.showSpinner);
  }
}
