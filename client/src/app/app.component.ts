import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
    <div class="footer"></div>
  `,
  styles: [`
    .container {
      margin-top: 10px;
    }
    .footer {
      margin-top: 20px;
    }
  `]
})
export class AppComponent {

}
