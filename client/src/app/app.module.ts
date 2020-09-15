import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard.component';
import {FormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarComponent } from './components/navbar.component';
import { LoginComponent } from './components/login.component';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {ErrorInterceptor} from './interceptors/error.interceptor';
import {CookieModule} from 'ngx-cookie';
import { MainLiftInputsComponent } from './components/profile/main-lift-inputs.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkoutComponent } from './components/workout/workout.component';
import { SetComponent } from './components/workout/set.component';
import { FinishComponent } from './components/finish.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ProfileComponent,
    NavbarComponent,
    LoginComponent,
    MainLiftInputsComponent,
    WorkoutComponent,
    SetComponent,
    FinishComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    NgSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
