import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLinkActive, RouterLinkWithHref} from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { AuthService } from '../../service/auth-service';
import { User } from '../../models/user';

@Component({
  selector: 'app-main-page',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css'
})
export class MainPage {
  constructor(private router: Router, private authService: AuthService) {};

  user: User = {
    id: null,
    username: '',
    password: '',
    surname: '',
    name: '',
    patronymic: '',
    role: '',
    groupId: null,
  };

  isMenuOpened = true;

  ngOnInit(): void {
    if(!this.authService.isAuthorized()){
      this.router.navigate(['/login']);
    }
    else {
      this.authService.getUserInfo().subscribe( data => {
        this.user = data;
        this.user.role = this.authService.getUserRole();
      });

    }
  }

  changeSize(): void {

  }

  logOut(): void {
    this.authService.logOut();
  }
}
