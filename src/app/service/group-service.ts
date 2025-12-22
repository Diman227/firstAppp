import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = 'http://localhost:4200/api/base';

  constructor(private http: HttpClient) {};

  getStudentGroup(groupId: number): Observable<any> {
    let tempUrl = `${this.apiUrl}/groups/${groupId}`;
    return this.http.get<any>(tempUrl);
  }

  getTeacherGroups(teacherId: number): Observable<Group[]> {
    let tempUrl = `${this.apiUrl}/teachers/${teacherId}/groups`;
    return this.http.get<Group[]>(tempUrl);
  }

  getAllGroupNames(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/groups/names`)
  }

}
