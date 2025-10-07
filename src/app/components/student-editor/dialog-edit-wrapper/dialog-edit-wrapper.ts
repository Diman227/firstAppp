import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student } from '../../../models/student';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-edit-wrapper',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
  ],
  templateUrl: './dialog-edit-wrapper.html',
  styleUrl: './dialog-edit-wrapper.css'
})
export class DialogEditWrapper {
  editingStudent: Student;
  dialogName: string;
  dialogBtnName: string;

  constructor(public dialogRef: MatDialogRef<DialogEditWrapper>,
    @Inject(MAT_DIALOG_DATA) public data: Student) {
    this.editingStudent = data;
    if(data.id != null) {
      this.dialogName = "Editing student";
      this.dialogBtnName = "Save"
    }
    else {
      this.dialogName = "Adding student";
      this.dialogBtnName = "Add";
    }
  }

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
