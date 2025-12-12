import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user'
import { catchError, Observable, tap, throwError } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://localhost:4200/api";
  JWT: string = '';

  constructor(private http: HttpClient, private router: Router) {}

    registrateUser(user: User): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/register`, user).pipe(

        tap(() => {
          alert("Успешная регистрация! Пожалуйста, авторизуйтесь!");
          this.router.navigate(['/login']);
        }),

        catchError(error => {
        console.error('Ошибка при регистрации:', error);
        return throwError(() => error);
      })
      );
    }

  logIn(user: User): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}/login`, user).pipe(

      tap(data => {
        if(data.token) {}
        this.JWT = data.token;
        if(this.JWT != null) {
          localStorage.setItem('username', user.username);
          localStorage.setItem('token', this.JWT);
          localStorage.setItem("role", this.getUserRole());
        }
      }),

      catchError(error => {
        console.error('Ошибка при входе:', error)
        return throwError(() => error);
      })
    );
  }

  isAuthorized(): boolean {
    if(!this.JWT){
      let token = localStorage.getItem('token');
      if(token != null){
        this.JWT = token;
      }
    }
    return !!this.JWT;
  }

  getInfoFromToken(token: string): any {
    try {
      return jwtDecode(token);

    } catch(error) {
      return null;
    }
  }

  getUserRole(): any {
    if(this.isAuthorized()){
      return this.getInfoFromToken(this.JWT).role[0].authority;
    }

  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  // я не могу по credentials найти, чьи это данные
  getUserInfo(): Observable<User> {
    // let tempUrl = this.apiUrl;
    // let role = this.getUserRole();
    // let id = 0;
    // switch(role){
    //   case "STUDENT":
    //     tempUrl += `/base/students/${id}`;
    //     break;
    //   case "TEACHER":
    //     tempUrl += `/base/teachers/${id}`;
    //     break;
    // }
    // return this.http.get<User>(tempUrl);

    let username = localStorage.getItem("username");
    return this.http.get<User>(`${this.apiUrl}/${username}/getUser`)
  }

}

