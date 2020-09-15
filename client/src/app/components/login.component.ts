import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <form>
      <div class="form-group">
        <label for="username">Username</label>
        <input class="form-control" id="username" placeholder="Username" name="username" [(ngModel)]="username">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" placeholder="Password" name="password" [(ngModel)]="password">
      </div>
      <div *ngIf="showError" class="alert alert-danger" role="alert">
        Invalid login, please try again
      </div>
      <button type="submit" class="btn btn-primary" [disabled]="isLoggingIn" (click)="login()">Login</button>

    </form>
  `,
  styles: [``]
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  isLoggingIn = false;
  showError = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    this.isLoggingIn = true;
    this.authService.login(this.username, this.password).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/dashboard']);
        }
        this.isLoggingIn = false;
      },
      error => {
        this.showError = true;
        this.isLoggingIn = false;
      }
    );
  }
}
