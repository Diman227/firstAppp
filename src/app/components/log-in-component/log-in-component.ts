
import { AuthService } from '../../service/auth-service';
import { User } from './../../models/user';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-log-in-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './log-in-component.html',
  styleUrl: './log-in-component.css'
})
export class LogInComponent {
  public user: User = {
    id: null,
    username: '',
    password: '',
    surname: '',
    name: '',
    patronymic: '',
    role: '',
    groupId: null,
  };

  // ngOnInit(): void {
  //   if()
  // }

  constructor(private authSerive: AuthService, private router: Router) {}

  logInClicked(user: User): void {
    this.authSerive.logIn(user).subscribe({
      next: (response) => {
        this.router.navigate(['/main/students']).then(success => {
          console.log('Navigaton successful!');
        });
      },
      error: (error) => {
        window.alert('Ошибка входа');
      }
    })
  }

  regUpClicked(): void {
    this.router.navigate(['/registration']);
  }

}
