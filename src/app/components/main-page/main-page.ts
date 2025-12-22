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
        if(data != null) {
          this.user = data;
          this.user.role = this.authService.getUserRole();
          console.log("user.role - " + this.user.role);
          localStorage.setItem("userId", data.id!.toString())
          if(this.user.groupId != null){
            localStorage.setItem("group", this.user.groupId.toString());
          }
        }
        else {
          let username = localStorage.getItem("username");
          let role = localStorage.getItem("role");
          if(username && role) {
            this.user.username = username;
            this.user.role = role;
          }
        }

      });

    }
  }

  changeNavbarSize(): void {

  }

  logOut(): void {
    this.authService.logOut();
  }

  goToGroupComponent(): void {
    this.router.navigate(['main/group']);
  }

  goToPeopleComponent(): void {
    this.router.navigate(['main/people']);
  }
}
