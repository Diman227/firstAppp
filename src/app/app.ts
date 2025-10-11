import { Component, signal, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentEditor } from './components/student-editor/student-editor';
import { TableStudents } from './components/table-students/table-students';
import {MatDialogModule} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import { MatTableStudents } from "./components/mat-table-students/mat-table-students";
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    StudentEditor,
    TableStudents,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableStudents,
],
  providers: [
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  count = 0;
  protected title = signal('firstAppp');
  name='Миша';
  increase(): void{
    this.count++;
  }
}
