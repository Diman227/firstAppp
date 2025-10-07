import { Injectable } from '@angular/core';
import { Student } from '../models/student';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryData implements InMemoryDbService {
  createDb() {
    const students = [
      {id: 0, name: 'Имя', surname: 'Фамилия'},
      {id: 1, name: 'Имя 1', surname: 'Фамилия 1'},
      {id: 2, name: 'Имя 2', surname: 'Фамилия 2'}
    ];
    return {students};
  }

  genId(students: Student[]): number {
    return students.length > 0 ? Math.max(...students.map(student => student.id ? student.id : 0)) + 1 : 11;
  }
}
