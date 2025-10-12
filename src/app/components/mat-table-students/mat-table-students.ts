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
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
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
  dataLength: number;
  currentPageIndex: number;
  totalPages: number;
  currentPageSize: number;

  constructor(private mokkyServer: MokkyServer, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Student>;
    this.dataLength = 0;
    this.currentPageIndex = 1;
    this.totalPages = 0;
    this.currentPageSize = 5;

    this.getStudentsForPage(this.currentPageIndex, this.currentPageSize);
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
    // this.getStudentsForPage(1, 5);
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

  getStudentsForPage(pageNumber: number, limitOfStudentsForPage: number) {
    // if(this.currentPageIndex == pageNumber) return;
    this.currentPageIndex = pageNumber;
    this.mokkyServer.getStudentsForPagination(this.currentPageIndex, limitOfStudentsForPage).subscribe( data => {

      this.dataLength = data.meta.total_items;
      this.dataSource.data = data.items;
      console.log('');
    }
    )
  }

  handlePaginatorEvent(event?:PageEvent) {
    if(event){
      console.log(event.pageIndex);
      this.currentPageIndex = ++event.pageIndex; // инкремент тк пагинатор стартует с индекса 0, а для запросов на сервер при page=0/1 одинаковые ответы
      this.currentPageSize = event.pageSize;
      this.dataLength = event.length;
      this.getStudentsForPage(this.currentPageIndex, this.currentPageSize);
      console.log(this.dataSource);
    }
    else {
      console.log("error in handling paginator's event!!!");
    }
  }

}
