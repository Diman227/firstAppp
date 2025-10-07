import { MokkyServer } from './../../service/mokky-server';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource} from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Student } from '../../models/student';
import { DialogEditWrapper } from '../student-editor/dialog-edit-wrapper/dialog-edit-wrapper';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {ViewChild, inject} from '@angular/core';
import {MatSort, Sort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-mat-table-students',
  imports: [
    MatTableModule,
    FormsModule,
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule
],
  templateUrl: './mat-table-students.html',
  styleUrl: './mat-table-students.css'
})
export class MatTableStudents {
  private _liveAnnouncer = inject(LiveAnnouncer); // у макса этого нет
  students: Student[];
  displayedColumns: string[] = ['id', 'name', 'surname', 'actions'];
  dataSource: MatTableDataSource<Student>;

  constructor(private mokkyServer: MokkyServer, public dialog: MatDialog) {
    this.students = [];
    this.dataSource = new MatTableDataSource(this.refreshTable());
  }

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
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
      this.dataSource = new MatTableDataSource(data);
    })
    return this.students;
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
    const dialogEditingStudent = this.dialog.open(DialogEditWrapper, {
      width: '400px',
      data: student,
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
