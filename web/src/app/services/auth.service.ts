import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { IUser } from '../models/users/IUser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router
  ) { }

  private readonly USER_DATA: string = "user_data";
  private userSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem(this.USER_DATA)));  

  get user(): IUser {
    return this.userSubject.value;
  }

  set user(data: IUser) {
    localStorage.setItem(this.USER_DATA, JSON.stringify(data));
    this.userSubject.next(data);
  }

  isAuthenticated() {
    return this.user && this.user.token;
  }

  logout() {
    localStorage.removeItem(this.USER_DATA);
    this.userSubject.next(null);
    this.router.navigate(["/login"]);
  }
}
