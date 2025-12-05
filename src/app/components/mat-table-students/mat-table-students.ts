import { AuthService } from './../../service/auth-service';
import { SpringServer } from '../../service/spring-server';
import { Component, inject } from '@angular/core';
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
import { group } from 'node:console';
import { eventNames } from 'node:process';
import { filter } from 'rxjs';
import { Router } from '@angular/router';

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
  displayedColumns: string[] = ['id','surname', 'name', 'patronymic', 'group', 'phoneNumber', 'actions'];
  dataSource: MatTableDataSource<Student>;
  dataLength: number;
  countOfPages: number;
  currentPageIndex: number;
  currentPageSize: number;
  sortActive: string;
  sortDirection: string;
  filterValue: string;

  constructor(private springServer: SpringServer, public dialog: MatDialog, private authService: AuthService, private router: Router) {
    this.dataSource = new MatTableDataSource<Student>;
    this.dataLength = 0;
    this.currentPageIndex = 0;
    this.currentPageSize = 5;
    this.countOfPages = 0;
    this.sortActive = '';
    this.sortDirection = '';
    this.filterValue = '';
    // if(!this.authService.isUserAuthenticated()) this.router.navigate(['/login']);
  }

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit() {
    console.log("AfterViewInit");
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();

     this.springServer.getStudentsForPagination(this.currentPageIndex, this.currentPageSize, this.sortActive, this.sortDirection, this.filterValue).subscribe(data => {
      this.dataSource.data = data.content;
      this.dataLength = data.totalElements;
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    console.log("OnInit");
    this.refreshTable();
    this.dataSource.paginator = this.paginator;
  }

  refreshTable() {
    this.getStudents();
  }

  addNewStudent(): void {
    const dialogAddingNewStudent = this.dialog.open(DialogEditWrapper, {
          width: '400px',
          data: {
            id: null,
            name: '',
            surname: '',
            patronymic: '',
            group: '',
            phoneNumber: '',
          }
        });
        dialogAddingNewStudent.afterClosed().subscribe((result: Student) => {
          if(result != null) {
            console.log("adding new student: " + result.name);
            this.springServer.addNewStudent(result).subscribe(() => {
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
      patronymic: student.patronymic,
      group: student.group,
      phoneNumber: student.phoneNumber,
    }
    const dialogEditingStudent = this.dialog.open(DialogEditWrapper, {
      width: '400px',
      data: tempStudent,
    });
    dialogEditingStudent.afterClosed().subscribe((result: Student) => {
      if(result != null) {
        console.log("editing student: " + result.name);
        this.springServer.editStudent(result).subscribe(() => this.refreshTable());
      }
    })
  }

  deleteStudent(student: Student): void {
    console.log('deleting student!');
    this.springServer.deleteStudent(student).subscribe(() => {
      if (this.dataLength % 5 == 1) --this.currentPageIndex; // ??багается пагинатор
      this.refreshTable();
    }
    );
  }

  getStudents() {
    this.springServer.getStudentsForPagination(this.currentPageIndex, this.currentPageSize, this.sortActive, this.sortDirection, this.filterValue).subscribe(data => {
      this.dataSource.data = data.content;
      this.dataLength = data.totalElements;
    })
  }

  handlePaginatorEvent(event?:PageEvent) {
    if(event){
      if(event.pageSize != this.currentPageSize && this.sort){
        this.sort.direction = '';
        this.currentPageIndex = 0;
        this.sortActive = '';
        this.sortDirection = '';
      }
      else this.currentPageIndex = event.pageIndex;
      if(this.paginator){
        this.paginator.pageIndex = this.currentPageIndex;
      }

      this.currentPageSize = event.pageSize;
      this.updatePaginator();
      this.getStudents();
    }
    else {
      console.log("error in handling paginator's event!!!");
    }
  }

  handleSortEvent(sort: Sort) {
    if(sort){
      console.log(sort);
      this.sortActive = sort.active;
      this.sortDirection = sort.direction;
      if(sort.direction == ''){
        this.sortActive = '';
        this.sortDirection = '';
      }
      console.log(" dfsfsdf");
      this.getStudents();
    }
    else console.log("error in handling sort's event!!!");
  }

  updatePaginator(): void {
    if(this.dataSource.paginator){
      this.dataSource.paginator.pageSize = this.currentPageSize;
    }
  }

}
