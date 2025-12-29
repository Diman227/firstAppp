import { Teacher } from './../../models/teacher';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Group } from '../../models/group';
import { SpringServer } from '../../service/spring-server';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-dialog-group',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatButton,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './dialog-group.html',
  styleUrl: './dialog-group.css'
})
export class DialogGroup {
  dialogName: string;
  dialogBtnName: string;
  nameInputControl: FormControl;

  teacherId: number | null = null;
  teachers: Teacher[] = new Array();
  groups: Group[] = new Array();
  groupId: number | null = null;

  constructor(private springServer:SpringServer, public dialogRef: MatDialogRef<DialogGroup>,
    @Inject(MAT_DIALOG_DATA) public data: Group) {

      this.nameInputControl = new FormControl(data.nameOfGroup || null, [
        Validators.required]);

    if(data.id != null) {
      this.dialogName = "Editing group";
      this.dialogBtnName = "Save"
    }
    else {
      this.dialogName = "Adding group";
      this.dialogBtnName = "Add";
    }
  }

  ngOnInit(): void {
    this.springServer.getAllTeachers().subscribe((data) => {
      this.teachers = data;
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return (this.nameInputControl.valid) ? true : false;
  }

  onSaveOrAddClick(): void {
    if(this.isFormValid()){
      this.data.nameOfGroup = this.nameInputControl.value;
      this.data.id = this.groupId;
      this.dialogRef.close({
        group: this.data,
        groupTeacherId: this.teacherId,
      });
    }
  }
}
