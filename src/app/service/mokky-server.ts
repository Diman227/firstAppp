import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { Student } from '../models/student';

@Injectable({
  providedIn: 'root'
})
export class MokkyServer {
  private mokkyUrl = 'https://da0503ddcf4916d1.mokky.dev/students';
  private fullUrl = this.mokkyUrl;

  constructor(private http: HttpClient) {};

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.mokkyUrl);
  }

  addNewStudent(student: Student): Observable<Student[]> {
    return this.http.post<Student[]>(this.mokkyUrl, student).pipe();
  }

  deleteStudent(student: Student): Observable<Student> {
    const deleteUrl = `${this.mokkyUrl}/${student.id}`;
    return this.http.delete<Student>(deleteUrl);
  }

  editStudent(student: Student): Observable<Student> {
    const deleteUrl = `${this.mokkyUrl}/${student.id}`;
    return this.http.patch<Student>(deleteUrl, student);
  }

  getStudentsForPagination(pageNumber: number, limitOfStudentsForPage: number | undefined): Observable<any> {
    this.fullUrl = `${this.mokkyUrl}?page=${pageNumber}&limit=${limitOfStudentsForPage}`;
    return this.http.get<any>(this.fullUrl);
  }

  getFilteredStudents(filterValue: string, columnToFilter: string): Observable<any> {
    this.fullUrl += `&${columnToFilter}=*${filterValue}`;
    return this.http.get<any>(this.fullUrl);
  }
}

