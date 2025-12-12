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
  groupInputControl: FormControl;

  constructor(public dialogRef: MatDialogRef<DialogEditWrapper>,
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

      this.groupInputControl = new FormControl(data.group || null, [
        Validators.required]);

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

  isFormValid(): boolean {
    return (this.nameInputControl.valid && this.surnameInputControl.valid
            && this.patronymicInputControl.valid && this.groupInputControl.valid)
            ? true : false;
  }

  onSaveOrAddClick(): void {
    if(this.isFormValid()){
      this.data.name = this.nameInputControl.value;
      this.data.surname = this.surnameInputControl.value;
      this.data.patronymic = this.patronymicInputControl.value;
      this.data.group = this.groupInputControl.value;
      this.dialogRef.close(this.data);
    }
  }
}
