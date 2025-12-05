import { Component } from '@angular/core';
import { User } from '../../models/user';
import { AuthService } from '../../service/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration-component',
  imports: [],
  templateUrl: './registration-component.html',
  styleUrl: './registration-component.css'
})
export class RegistrationComponent {
  public user: User = {
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

  onRegisterClicked(user: User): void {
    this.authSerive.registrateUser(user).subscribe(() => console.log('registration'));
  }

  logInClicked(): void {
    this.router.navigate(['/login']);
  }

}
