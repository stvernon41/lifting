import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <a class="navbar-brand">Lifting</a>
      <ul class="navbar-nav mr-auto" routerLinkActive="active">
        <li class="nav-item"><a class="nav-link" routerLink="dashboard" routerLinkActive="active"><i class="far fa-list-alt"></i> Dashboard</a></li>
        <li class="nav-item"><a class="nav-link" routerLink="profile" routerLinkActive="active"><i class="fas fa-user"></i> Profile</a></li>
        <li class="nav-item"><a class="nav-link" routerLink="workout" routerLinkActive="active"><i class="fas fa-dumbbell"></i> Workout</a></li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
        </li>
      </ul>
      <button class="btn btn-danger my-2 my-sm-0" (click)="logout()">Logout</button>
    </nav>
  `,
  styles: [``]
})
export class NavbarComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
