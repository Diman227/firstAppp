import { Routes } from '@angular/router';
import { MatTableStudents } from './components/mat-table-students/mat-table-students';
import { LogInComponent } from './components/log-in-component/log-in-component';
import { RegistrationComponent } from './components/registration-component/registration-component';
import { MainPage } from './components/main-page/main-page';
import { PeoplePage } from './components/people-page/people-page';

export const routes: Routes = [
  { path: 'main', component: MainPage,
    children: [
      { path: 'people', component: PeoplePage},
      { path: 'group', component: MatTableStudents}
    ]
  },

  { path: 'login', component: LogInComponent},
  { path: 'registration', component: RegistrationComponent},
  { path: 'students', component: MatTableStudents},
  { path: '**', component: LogInComponent},
];
