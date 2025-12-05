import { Router } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user'
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://localhost:8080/api";
  private JWT = "";

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
        this.JWT = 'Bearer ' + data.token;
        localStorage.setItem('username', user.username);
        localStorage.setItem('token', this.JWT);
      }),

      catchError(error => {
        console.error('Ошибка при входе:', error);
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        return throwError(() => error);
      })
    );
  }

  // isUserAuthenticated(): boolean {
  //   let username = localStorage.getItem('username');
  //   return !(username === null);
  // }
}

