import { BaseService } from './../../service/base-service';
import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogEditWrapper } from '../student-editor/dialog-edit-wrapper/dialog-edit-wrapper';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-table-students',
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule
  ],
  templateUrl: './table-students.html',
  styleUrl: './table-students.css'
})
export class TableStudents{

  students: Student[];
  count: number = 0;

  constructor(private baseService: BaseService, public dialog: MatDialog){
    this.students = [];
  }

  ngOnInit(): void {
    console.log("TableStudentsComponent");
    this.refreshTable();
  }

  increase(): void{
    this.count++;
    console.log("was clicked! current count = " + this.count
    );
  }

  addNewStudent(): void {
    const dialogAddingNewStudent = this.dialog.open(DialogEditWrapper, {
      width: '400px',
      data: {
        id: null,
        name: '',
        surname: '',
      }
    });
    dialogAddingNewStudent.afterClosed().subscribe((result: Student) => {
      if(result != null) {
        console.log("adding new student: " + result.name);
        this.baseService.addNewStudent(result).subscribe(k=>
          this.refreshTable());
          alert("The student was successfully added!");
      }
    });
  }

  editStudent(student: Student): void {
    const dialogEditingStudent = this.dialog.open(DialogEditWrapper, {
      width: '400px',
      data: student,
    });
    dialogEditingStudent.afterClosed().subscribe((result: Student) => {
      if(result != null) {
        console.log("editing student: " + result.name);
        console.log('' + result);
        this.baseService.editStudent(result).subscribe(() => this.refreshTable());
        alert("The student was successfully edited!");
      }
    })
  }

  deleteStudent(student: Student): void {
    console.log('deleting student!');
    this.baseService.deleteStudent(student).subscribe(() => this.refreshTable());
    alert("The student was successfully deleted!");
  }

  refreshTable(): void {
    this.baseService.getAllStudents().subscribe(data => {
      this.students = data;
    });
  }

}

