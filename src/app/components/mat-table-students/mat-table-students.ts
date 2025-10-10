import { MokkyServer } from './../../service/mokky-server';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student';
import { DialogEditWrapper } from '../student-editor/dialog-edit-wrapper/dialog-edit-wrapper';
import {ViewChild} from '@angular/core';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-mat-table-students',
  imports: [
    MatTableModule,
    FormsModule,
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,

],
  templateUrl: './mat-table-students.html',
  styleUrl: './mat-table-students.css'
})
export class MatTableStudents {
  displayedColumns: string[] = ['id', 'name', 'surname', 'actions'];
  dataSource: MatTableDataSource<Student>;

  constructor(private mokkyServer: MokkyServer, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Student>;
    this.refreshTable();
  }

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.refreshTable();
  }

  refreshTable() {
    this.mokkyServer.getAllStudents().subscribe(data => {
      this.dataSource.data = data;
    })
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
            this.mokkyServer.addNewStudent(result).subscribe(k=>
              this.refreshTable());
          }
        });
  }

  editStudent(student: Student): void {
    let tempStudent = {
      id: student.id,
      name: student.name,
      surname: student.surname,
    }
    const dialogEditingStudent = this.dialog.open(DialogEditWrapper, {
      width: '400px',
      data: tempStudent,
    });
    dialogEditingStudent.afterClosed().subscribe((result: Student) => {
      if(result != null) {
        console.log("editing student: " + result.name);
        console.log('' + result);
        this.mokkyServer.editStudent(result).subscribe(() => this.refreshTable());
      }
    })
  }

  deleteStudent(student: Student): void {
    console.log('deleting student!');
    this.mokkyServer.deleteStudent(student).subscribe(() => this.refreshTable());
  }

}
