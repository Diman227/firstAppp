import { Component } from '@angular/core';
import { AuthService } from './../../service/auth-service';
import { SpringServer } from '../../service/spring-server';
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
import { User } from '../../models/user';
import { Teacher } from '../../models/teacher';

@Component({
  selector: 'app-group-page',
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
  templateUrl: './people-page.html',
  styleUrl: './people-page.css'
})
export class PeoplePage {

  studentColumns: string[] = ['id','surname', 'name', 'patronymic', 'group', 'actions'];
  teacherColumns: string[] = ['id','surname', 'name', 'patronymic', 'groups', 'actions'];
  groupColumns: string[] = ['id','name', 'teacher'];

  displayedColums: string[] = this.studentColumns;

  categories: string[] = ["Студенты", "Преподаватели", "Группы"];
  dataSource: MatTableDataSource<any>;
  dataLength: number;
  countOfPages: number;
  currentPageIndex: number;
  currentPageSize: number;
  sortActive: string;
  sortDirection: string;
  filterValue: string;
  currentOption: string;
  addBtnName: string;

  // переменная отвечает за группу -> в запрос добавляется эта группа(фильтр) -> работает для всех ролей(комбобокс)

  group: Group = {
    id: null,
    nameOfGroup: '',
  };

  groups?: Group[];

  constructor(private springServer: SpringServer, public dialog: MatDialog, private authService: AuthService, private router: Router, private groupService: GroupService) {

    this.dataSource = new MatTableDataSource<User>;

    this.dataLength = 0;
    this.currentPageIndex = 0;
    this.currentPageSize = 5;
    this.countOfPages = 0;

    this.sortActive = '';
    this.sortDirection = '';

    this.filterValue = '';

    this.currentOption = "Студенты";
    this.addBtnName = "Add new Student";
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
            group: '',
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

  getTeachers() {

  }

  getGroups() {

  }

  addNewTeacher(): void {

    console.log('Add new teacher');
  }

  addNewGroup(): void {

    console.log('Add new group');
  }

  editTeacher(teacher: Teacher): void {

    console.log('Edit teacher', teacher);
  }

  editGroup(group: Group): void {

    console.log('Edit group', group);
  }

  deleteTeacher(teacher: Teacher): void {

    console.log('Delete teacher', teacher);
  }

  deleteGroup(group: Group): void {

    console.log('Delete group', group);
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

      switch (this.currentOption) {
        case 'Студенты':
          this.getStudents();
          break;
        case 'Преподаватели':
          this.getTeachers(); // Реализуйте метод для пагинации преподавателей
          break;
        case 'Группы':
          this.getGroups(); // Реализуйте метод для пагинации групп
          break;
      }
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

      switch (this.currentOption) {
        case 'Студенты':
          this.getStudents();
          break;
        case 'Преподаватели':
          this.getTeachers();
          break;
        case 'Группы':
          this.getGroups();
          break;
      }
    }
    else console.log("error in handling sort's event!!!");
  }

  updatePaginator(): void {
    if(this.dataSource.paginator){
      this.dataSource.paginator.pageSize = this.currentPageSize;
    }
  }

  onSelectionChange(event: MatSelectChange): void {

    this.currentPageIndex = 0;
    this.sortActive = '';
    this.sortDirection = '';
    this.filterValue = '';

    switch (event.value){
      case "Студенты":
        this.displayedColums = this.studentColumns;
        this.addBtnName = "Add new Student";
        this.getAllStudents();
        break;

      case "Преподаватели":
        this.displayedColums = this.teacherColumns;
        this.addBtnName = "Add new Teacher";
        this.getAllTeachers();
        break;

      case "Группы":
        this.displayedColums = this.groupColumns;
        this.addBtnName = "Add new Group";
        this.getAllGroups();
        break;
    }
  }

  getAllTeachers(): void {
    this.springServer.getAllTeachers().subscribe( data => {
      this.dataSource.data = data;
    })
  }

  getAllStudents(): void {
    this.springServer.getAllStudents().subscribe( data => {
      this.dataSource.data = data;
    })
  }

  getAllGroups(): void {
    this.springServer.getAllGroups().subscribe( data => {
      this.dataSource.data = data;
    })
  }

  addNewItem(): void {
    switch (this.currentOption) {
      case 'Студенты':
        this.addNewStudent();
        break;
      case 'Преподаватели':
        this.addNewTeacher();
        break;
      case 'Группы':
        this.addNewGroup();
        break;
    }
  }
}
