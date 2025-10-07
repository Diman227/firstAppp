import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class TypicodeService {
  private typiCodeUrl = 'https://jsonplaceholder.typicode.com/users';
  users: User[] = [];

  constructor(private http: HttpClient) {
    this.getAllUsers().subscribe(data => {
      this.users = data;
    })
  };

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.typiCodeUrl)
  }

  // deleteUser(user: User): Observable<User> {
  //   const deleteUrl = `${this.typiCodeUrl}/${user.id}`
  //   return this.http.delete<User>(deleteUrl);
  // }

  editUser(user: User): void {
    this.users[this.users.findIndex(userData => userData.id === user.id)] = user;
  }

  addNewUser(user: User): void {
    this.users.push(user);
  }

  deleteUser(user: User): void {
    this.users = this.users.filter(userData => userData.id !== user.id);
  }

  getUsers(): User[]{
    return this.users;
  }
}
