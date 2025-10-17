import { MokkyServer } from './../../service/mokky-server';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student';
import { DialogEditWrapper } from '../student-editor/dialog-edit-wrapper/dialog-edit-wrapper';
import {ViewChild} from '@angular/core';
import {MatSort, MatSortModule, Sort} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { filter } from 'rxjs';

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
  countOfPages: number;
  currentPageIndex: number;
  currentPageSize: number;

  constructor(private mokkyServer: MokkyServer, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Student>;
    this.dataLength = 0;
    this.currentPageIndex = 1;
    this.currentPageSize = 5;
    this.countOfPages = 0;

  }

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    setTimeout(() => this.paginator!.length = this.dataLength);
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
    // this.dataSource.paginator = this.paginator;
  }

  refreshTable() {
    this.getStudentsForPage(this.currentPageIndex, this.currentPageSize);
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
            this.mokkyServer.addNewStudent(result).subscribe(() => {
              // this.currentPageIndex = this.countOfPages; багается пагинатор

              this.refreshTable();
            }
            );
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
    this.mokkyServer.deleteStudent(student).subscribe(() => {
      if (this.dataLength % 5 == 1) --this.currentPageIndex; // багается пагинатор
      this.refreshTable();
    }
    );
  }

  getStudentsForPage(pageNumber: number, limitOfStudentsForPage: number) {
    this.currentPageIndex = pageNumber;

    if(this.dataSource.paginator){
        this.dataSource.paginator.length = this.dataLength;
        this.dataSource.paginator.pageIndex = this.currentPageIndex - 1;
        this.dataSource.paginator.pageSize = this.currentPageSize;
    }

    this.mokkyServer.getStudentsForPagination(this.currentPageIndex, limitOfStudentsForPage).subscribe( data => {

      console.log(data.meta.per_page + " per-page");
      this.dataLength = data.meta.total_items;
      this.dataSource.data = data.items;
      this.countOfPages = data.meta.total_pages;
      console.log('');

    }
    )
  }

  handlePaginatorEvent(event?:PageEvent) {
    if(event){

      // if (this.currentPageSize !== event.pageSize) this.currentPageIndex = 0;
      // else
      this.currentPageIndex = event.pageIndex;

      this.currentPageSize = event.pageSize;

      this.getStudentsForPage(this.currentPageIndex + 1, this.currentPageSize);
    }
    else {
      console.log("error in handling paginator's event!!!");
    }
  }

  handleSortEvent(sort: Sort) {
    if(sort){

      switch(sort.active){

        case("id"):
          this.dataSource.data = this.sortStudentsById(sort.direction);
          break;

        case("name"):
          this.dataSource.data = this.sortStudentsByName(sort.direction);
          break;

        case("surname"):
          this.dataSource.data = this.sortStudentsBySurname(sort.direction);
          break;
      }
    }
    else console.log("error in handling sort's event!!!");
  }

  sortStudentsById(directionOfSort: string): Student[] {
    let students = this.dataSource.data;
    switch(directionOfSort) {

      case("asc"):
        students = this.dataSource.data.sort((a,b) => {
          if(a.id != null && b.id != null) {
            return a.id - b.id;
          }
          return 0;
        })
        return students;

      case("desc"):
        students = this.dataSource.data.sort((a,b) => {
          if(a.id != null && b.id != null) {
            return b.id - a.id;
          }
          return 0;
        })
        return students;

      case(""):
        // this.mokkyServer.getStudentsForPagination(this.currentPageIndex, this.currentPageSize).subscribe( data => {
        //   console.log(students);
        //   students = data.items;
        //   console.log(data.items);
        //   console.log(students);
        // })
        this.loadStudents();
        return this.dataSource.data;

      default:
        return students;
    }
  }
  // костыль т.к не могу добиться правильного результата, вызвав асинхронную функцию в switch case выше
  // либо делать возвращаемым значение Observable, либо как-то с промисами, либо так
  loadStudents(){
    this.mokkyServer.getStudentsForPagination(this.currentPageIndex, this.currentPageSize).subscribe(data => {
      this.dataSource.data = data.items;
    })
  }

  sortStudentsByName(directionOfSort: string): Student[] {

    switch(directionOfSort) {

      case("asc"):
        return this.dataSource.data.sort((a,b) => {
          return a.name.localeCompare(b.name);
        });

      case("desc"):
        return this.dataSource.data.sort((a,b) => {
          return b.name.localeCompare(a.name);
        });

      case(""):
        this.loadStudents();
        return this.dataSource.data;

      default:
        return this.dataSource.data;
    }
  }

  sortStudentsBySurname(directionOfSort: string): Student[] {

    switch(directionOfSort) {

      case("asc"):
        return this.dataSource.data.sort((a,b) => {
          return a.surname.localeCompare(b.surname);
        });

      case("desc"):
        return this.dataSource.data.sort((a,b) => {
          return b.surname.localeCompare(a.surname);
        });

      case(""):
        this.loadStudents();
        return this.dataSource.data;

      default:
        return this.dataSource.data;
    }
  }

}
