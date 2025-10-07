import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private studentsUrl = 'api/students';

  constructor(private http: HttpClient) {};

  getAllStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.studentsUrl);
  }

  addNewStudent(student: Student): Observable<Student[]> {
    console.log("Added new Student!");
    return this.http.post<Student[]>(this.studentsUrl, student).pipe();
  }

  deleteStudent(student: Student): Observable<Student> {
    const deleteUrl = `api/students/${student.id}`;
    console.log(`The student with name ${student.name} was deleted!`);
    return this.http.delete<Student>(deleteUrl);
  }

  getStudentById(id: number | null): Observable<Student> {
    const url = `${this.studentsUrl}/${id}`;
    return this.http.get<Student>(url);
  }

  editStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(this.studentsUrl, student);
  }
}
