import { BaseService } from './../../service/base-service';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Student } from '../../models/student';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-editor',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './student-editor.html',
  styleUrl: './student-editor.css'
})
export class StudentEditor {

    editingStudent: Student;
    name: string;

    constructor(private baseService: BaseService){
      this.editingStudent = new Student();
      this.name = 'Niko';
      this.editingStudent.name = this.name;
    }

    addStudent() {
      this.baseService.addNewStudent(this.editingStudent);
      this.editingStudent = new Student();
    }
}
