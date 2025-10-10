import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../models/user';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-add-user',
  imports: [
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './dialog-add-user.html',
  styleUrl: './dialog-add-user.css'
})
export class DialogAddUser {
  editingUser: User;

  constructor(public dialogRef: MatDialogRef<DialogAddUser>,
    @Inject(MAT_DIALOG_DATA) public data: User) {

      this.editingUser = data;
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
