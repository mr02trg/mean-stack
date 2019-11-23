import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map as rxMap } from 'rxjs/operators';

import { IUser } from '../models/IUser';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  RegisterUser(request: IUser) {
    this.http.post<{message: string, user: any}>('http://localhost:3000/api/users/register', request)
        .pipe(
          rxMap((data) => {
            return <IUser> {
              ...data.user,
              id: data.user._id
            }
          })
        )
        .subscribe(res => {
          this.router.navigate(["/"]);
        }, error => {
          console.error('Failed to add user');
        });
  }

  AuthenticateUser(request: IUser) {
    this.http.post<{message: string, token: string, user: any}>('http://localhost:3000/api/users/authenticate', request)
        .subscribe(res => {
          const authenticatedUser = <IUser> {
            ...res.user,
            token: res.token
          }
          this.authService.user = authenticatedUser;
          this.router.navigate(["/post"]);
        }, error => {
          console.error('Failed to authenticate');
        });
  }
}
