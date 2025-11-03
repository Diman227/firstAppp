import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { Student } from '../models/student';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class SpringServer {
  private apiUrl = 'http://localhost:8080/api/base/students/filter';
  private paginatedUrl = '';
  private fullUrl = '';

  constructor(private http: HttpClient) {};

  addNewStudent(student: Student): Observable<Student> {
    console.log({surname: student.surname,
                 name: student.name,
                 patronymic: student.patronymic,
                 group: student.group,
                 phoneNumber: student.phoneNumber,

    });
    return this.http.post<Student>(this.apiUrl, {surname: student.surname,
                                                  name: student.name,
                                                  patronymic: student.patronymic,
                                                  group: student.group,
                                                  phoneNumber: student.phoneNumber,

    }).pipe();
  }

  deleteStudent(student: Student): Observable<Student> {
    return this.http.delete<Student>(`${this.apiUrl}/${student.id}`);
  }

  editStudent(student: Student): Observable<Student> {
    return this.http.patch<Student>(this.apiUrl, student);
  }

  getStudentsForPagination(pageNumber: number, limitOfStudentsForPage: number, sortActive: string, sortDirection: string, filterValue: string): Observable<any> {

    this.fullUrl = this.paginatedUrl = `${this.apiUrl}?page=${pageNumber}&size=${limitOfStudentsForPage}`;

    if(sortActive && sortDirection){
      this.fullUrl = this.paginatedUrl + `&sort=${sortActive},${sortDirection}`;
    }

    if(filterValue != ""){
      this.fullUrl += `&filter=${filterValue}`;
    }

    return this.http.get<any>(this.fullUrl);
  }

}

