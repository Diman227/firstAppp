import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { Student } from '../models/student';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class SpringServer {
  private apiUrl = 'http://localhost:4200/api/base';
  private paginatedUrl = '';
  private fullUrl = '';

  constructor(private http: HttpClient) {};

  addNewStudent(student: Student): Observable<Student> {
    console.log({surname: student.surname,
                 name: student.name,
                 patronymic: student.patronymic,
                 group: student.group,

    });
    return this.http.post<Student>(`${this.apiUrl}/students/filter`, {surname: student.surname,
                                                  name: student.name,
                                                  patronymic: student.patronymic,
                                                  group: student.group,
    }).pipe();
  }

  deleteStudent(student: Student): Observable<Student> {
    return this.http.delete<Student>(`${this.apiUrl}/students/${student.id}`);
  }

  editStudent(student: Student): Observable<Student> {
    return this.http.patch<Student>(`${this.apiUrl}/students`, student);
  }

  getStudentsForPagination(pageNumber: number, limitOfStudentsForPage: number, sortActive: string, sortDirection: string, filterValue: string): Observable<any> {

    const headers = new HttpHeaders({
      Authorization: '' + localStorage.getItem('token'),
      'Access-Control-Allow-Origin': '*',
    })
    this.fullUrl = this.paginatedUrl = `${this.apiUrl}/students?page=${pageNumber}&size=${limitOfStudentsForPage}`;

    if(sortActive && sortDirection){
      this.fullUrl = this.paginatedUrl + `&sort=${sortActive},${sortDirection}`;
    }

    if(filterValue != ""){
      this.fullUrl += `&filter=${filterValue}`;
    }

    return this.http.get<any>(this.fullUrl, { headers });
  }


  getAllGroupNames(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/names`)
  }
}

