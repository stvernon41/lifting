import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './components/dashboard.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LoginComponent} from './components/login.component';
import {AuthGuard} from './guards/auth.guard';
import {WorkoutComponent} from './components/workout/workout.component';
import {FinishComponent} from './components/finish.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workout',
    component: WorkoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'finish',
    component: FinishComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
