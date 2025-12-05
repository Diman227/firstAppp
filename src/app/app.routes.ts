import { Routes } from '@angular/router';
import { MatTableStudents } from './components/mat-table-students/mat-table-students';
import { LogInComponent } from './components/log-in-component/log-in-component';

export const routes: Routes = [
  { path: 'login', component: LogInComponent},
  { path: 'students', component: MatTableStudents},
  { path: '**', component: MatTableStudents},
];
