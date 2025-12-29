import { group } from 'node:console';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Student } from '../models/student';
import { Sort } from '@angular/material/sort';
import { Group } from '../models/group';
import { Teacher } from '../models/teacher';

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
                 groupId: student.groupId,

    });
    return this.http.post<Student>(`${this.apiUrl}/students`, {
                                                  id: student.id,
                                                  surname: student.surname,
                                                  name: student.name,
                                                  patronymic: student.patronymic,
                                                  groupId: student.groupId,
    }).pipe();
  }

  addNewGroup(group: Group, teacherId: number | null) : Observable<Group> {
    return this.http.post<Group>(`${this.apiUrl}/groups`, {
      id: null,
      nameOfGroup: group.nameOfGroup,
      groupTeacherId: teacherId,
      students: null
    });
  }

  addNewTeacher(teacher: Teacher) : Observable<Teacher> {
    return this.http.post<Teacher>(`${this.apiUrl}/teachers`, {
      id: null,
      surname: teacher.surname,
      name: teacher.name,
      patronymic: teacher.patronymic,
      groupsOfStudents: teacher.groupsOfStudents,
    });
  }

  deleteStudent(student: Student): Observable<Student> {
    return this.http.delete<Student>(`${this.apiUrl}/students/${student.id}`);
  }

  deleteTeacher(teacherId: number): Observable<any> {
    let tempUrl = `${this.apiUrl}/teachers/${teacherId}`;
    return this.http.delete<any>(tempUrl);
  }

  deleteGroup(groupId: number): Observable<any> {
    let tempUrl = `${this.apiUrl}/groups/${groupId}`;
    return this.http.delete<any>(tempUrl);
  }

  editStudent(student: Student): Observable<Student> {
    return this.http.patch<Student>(`${this.apiUrl}/students`, student);
  }

  editTeacher(teacher: Teacher): Observable<Teacher> {
    return this.http.patch<Teacher>(`${this.apiUrl}/teachers`, teacher);
  }

  editGroup(group: Group): Observable<Group> {
    return this.http.patch<Group>(`${this.apiUrl}/groups`, group)
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

  getAllTeachers(): Observable<any> {
    let tempUrl = `${this.apiUrl}/teachers`;
    return this.http.get<any>(tempUrl);
  }

  getAllStudents(): Observable<any> {
    let tempUrl = `${this.apiUrl}/students`;
    return this.http.get<any>(tempUrl);
  }

  getAllGroups(): Observable<any> {
    let tempUrl = `${this.apiUrl}/groups`;
    return this.http.get<any>(tempUrl);
  }


}

