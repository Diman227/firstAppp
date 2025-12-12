import { SpringServer } from './../../service/spring-server';
import { group } from 'node:console';
import { Component } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../service/auth-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import { Group } from '../../models/group';

@Component({
  selector: 'app-registration-component',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './registration-component.html',
  styleUrl: './registration-component.css'
})
export class RegistrationComponent {
  public user: User = {
    id: null,
    username: '',
    password: '',
    surname: '',
    name: '',
    patronymic: '',
    role: 'STUDENT',
    groupId: null,
  };

  roles: string[] = ["STUDENT", "TEACHER"];
  groups: Group[] = new Array();


  ngOnInit(): void {
    this.springServer.getAllGroupNames().subscribe( data => {
      this.groups = data;
    })
  }

  constructor(private springServer: SpringServer, private authSerive: AuthService, private router: Router) {}

  onRegisterClicked(user: User): void {
    this.authSerive.registrateUser(user).subscribe(() => console.log('registration'));
  }

  logInClicked(): void {
    this.router.navigate(['/login']);
  }

}
