import { GroupService } from './../../../service/group-service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Student } from '../../../models/student';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Group } from '../../../models/group';
import { SpringServer } from '../../../service/spring-server';
import {MatSelectModule} from '@angular/material/select';
import { AuthService } from '../../../service/auth-service';

@Component({
  selector: 'app-dialog-edit-wrapper',
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
  templateUrl: './dialog-edit-wrapper.html',
  styleUrl: './dialog-edit-wrapper.css'
})
export class DialogEditWrapper {
  dialogName: string;
  dialogBtnName: string;
  nameInputControl: FormControl;
  surnameInputControl: FormControl;
  patronymicInputControl: FormControl;
  groups: Group[] = new Array();
  group: Group;
  groupId: number | null = null;

  constructor(private groupService: GroupService, private authService: AuthService , private springServer:SpringServer, public dialogRef: MatDialogRef<DialogEditWrapper>,
    @Inject(MAT_DIALOG_DATA) public data: Student) {

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
      this.dialogName = "Editing student";
      this.dialogBtnName = "Save"
    }
    else {
      this.dialogName = "Adding student";
      this.dialogBtnName = "Add";
    }
    this.group = {
      id: null,
      nameOfGroup: this.data.group,
    };
  }

  ngOnInit(): void {

      if(this.authService.getUserRole() == "ADMIN") {
      this.groupService.getAllGroupNames().subscribe( data => {
      this.groups = data;
      });
    }

    else {
      let teacherId = parseInt(localStorage.getItem("userId") || "0");
      if(teacherId != 0) {
        this.groupService.getTeacherGroups(teacherId).subscribe( data => {
          this.groups = data;
        });
      }
    }
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
      this.data.name = this.nameInputControl.value;
      this.data.surname = this.surnameInputControl.value;
      this.data.patronymic = this.patronymicInputControl.value;
      this.data.group = this.group.nameOfGroup;
      this.dialogRef.close(this.data);
    }
  }
}
