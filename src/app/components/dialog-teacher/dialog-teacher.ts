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
import { GroupService } from '../../service/group-service';

@Component({
  selector: 'app-dialog-teacher',
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
  templateUrl: './dialog-teacher.html',
  styleUrl: './dialog-teacher.css'
})
export class DialogTeacher {
  dialogName: string;
  dialogBtnName: string;
  nameInputControl: FormControl;
  surnameInputControl: FormControl;
  patronymicInputControl: FormControl;

  teacherId: number | null = null;
  groups: Group[] = new Array();
  groupId: number | null = null;

  constructor(private groupService: GroupService, private springServer:SpringServer, public dialogRef: MatDialogRef<DialogTeacher>,
    @Inject(MAT_DIALOG_DATA) public data: Teacher) {

      this.nameInputControl = new FormControl(data.name || null, [
        Validators.required,
        Validators.pattern('^[A-Za-zА-Яа-яЁё]+$')]);

      this.surnameInputControl = new FormControl(data.surname || null, [
        Validators.required,
        Validators.pattern('^[A-Za-zА-Яа-яЁё]+$')]);

      this.patronymicInputControl = new FormControl(data.patronymic || null, [
        Validators.required,
        Validators.pattern('^[A-Za-zА-Яа-яЁё]+$')]);

    if(data.id != null) {
      this.dialogName = "Editing teacher";
      this.dialogBtnName = "Save"
    }
    else {
      this.dialogName = "Adding teacher";
      this.dialogBtnName = "Add";
    }
  }

  ngOnInit(): void {
    this.getGroupsWithoutTeacher();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    return (this.nameInputControl.valid && this.surnameInputControl.valid
            && this.patronymicInputControl.valid)
            ? true : false;
  }

  onSaveOrAddClick(): void {
    if(this.isFormValid()){
      let name = '';
      if(this.groupId != null) {
        name = localStorage.getItem(this.groupId.toString()) || '';
      }

      let group: Group = {
        id: this.groupId,
        nameOfGroup: name,
      }

      this.data.name = this.nameInputControl.value;
      this.data.surname = this.surnameInputControl.value;
      this.data.patronymic = this.patronymicInputControl.value;
      this.data.teacherGroups?.push(group);
      this.dialogRef.close(this.data);
    }
  }

  getGroupsWithoutTeacher(): void {
    this.groupService.getGroupsWithoutTeacher().subscribe( data => {
      this.groups = data;
    })
  }
}
