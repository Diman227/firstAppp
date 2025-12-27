import { AuthService } from './../../service/auth-service';
import { SpringServer } from '../../service/spring-server';
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
import { Router } from '@angular/router';
import { Group } from '../../models/group';
import { GroupService } from '../../service/group-service';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';

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
    MatSelectModule
],
  templateUrl: './mat-table-students.html',
  styleUrl: './mat-table-students.css'
})
export class MatTableStudents {
  displayedColumns: string[] = ['id','surname', 'name', 'patronymic', 'group', 'actions'];
  dataSource: MatTableDataSource<Student>;
  dataLength: number;
  countOfPages: number;
  currentPageIndex: number;
  currentPageSize: number;
  sortActive: string;
  sortDirection: string;
  filterValue: string;

  // переменная отвечает за группу -> в запрос добавляется эта группа(фильтр) -> работает для всех ролей(комбобокс)

  group: Group;
  groups?: Group[];
  selectedGroupId: number | null;

  constructor(private springServer: SpringServer, public dialog: MatDialog, private authService: AuthService, private router: Router, private groupService: GroupService) {
    this.dataSource = new MatTableDataSource<Student>;
    this.dataLength = 0;
    this.currentPageIndex = 0;
    this.currentPageSize = 5;
    this.countOfPages = 0;
    this.sortActive = '';
    this.sortDirection = '';
    this.filterValue = '';
    this.group = {
      id: null,
      nameOfGroup: '',
    };
    this.selectedGroupId = null;
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

    this.getStudents();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    console.log("OnInit");
    this.refreshTable();
    this.dataSource.paginator = this.paginator;

    this.getGroupsAndStudentsFromGroup();

  }

  refreshTable() {
    // this.getStudents();
  }

  addNewStudent(): void {
    const dialogAddingNewStudent = this.dialog.open(DialogEditWrapper, {
          width: '400px',
          data: {
            id: null,
            name: '',
            surname: '',
            patronymic: '',
            groupId: null,
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
      groupId: student.groupId,
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

  onSelectionChange(event: MatSelectChange): void {

    if(event.value != 0) {
      this.loadStudentsForGroup(event.value);
    }

    else if(this.getUserRole() == "ADMIN") {
      this.getStudents();
    }
  }

  getUserRole(): string {
    return this.authService.getUserRole();
  }

  getUserId(): string | null {
    return localStorage.getItem("userId");
  }

  getGroupsAndStudentsFromGroup(): void {
    if(this.getUserRole() == "STUDENT" || this.getUserRole() == "TEACHER") {
      let groupId = parseInt(localStorage.getItem("group") || "0");
      this.group.id = groupId;
      this.loadStudentsForGroup(groupId);
    }

    if(this.getUserRole() == "TEACHER") {
      let teacherId: number = parseInt(localStorage.getItem("userId") || "0");

      if(teacherId == 0) {
        console.log("teacherId can't be 0");
      }

      else {
        this.groupService.getTeacherGroups(teacherId).subscribe( data => {
        this.groups = data;
      })
      }
    }

    if(this.getUserRole() == "ADMIN") {
      this.groupService.getAllGroupNames().subscribe( data => {
      this.groups = data;
      this.groups?.forEach( group => {
        localStorage.setItem(group.id!.toString(), group.nameOfGroup);
      })
    });
    }
  }

  loadStudentsForGroup(groupId: number) {
    this.groupService.getStudentGroup(groupId).subscribe( data => {
      let groupName: string = data.nameOfGroup;
      localStorage.setItem(data.id.toString(), groupName);
      this.dataSource.data = data.students;
      this.group.nameOfGroup = groupName;
      this.dataSource.data.forEach( student => {
          student.groupId = this.group.id;
      });
    }
    )
  }
}
