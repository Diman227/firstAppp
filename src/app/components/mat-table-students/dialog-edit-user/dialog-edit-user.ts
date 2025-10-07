import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../models/user';
import { DialogEditWrapper } from '../../student-editor/dialog-edit-wrapper/dialog-edit-wrapper';

@Component({
  selector: 'app-dialog-edit-user',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
  ],
  templateUrl: './dialog-edit-user.html',
  styleUrl: './dialog-edit-user.css'
})
export class DialogEditUser {
  editingUser: User;

  constructor(public dialogRef: MatDialogRef<DialogEditWrapper>,
    @Inject(MAT_DIALOG_DATA) public data: User) {

      this.editingUser = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
