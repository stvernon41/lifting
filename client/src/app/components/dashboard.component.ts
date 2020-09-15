import { Component, OnInit } from '@angular/core';
import {WorkoutService} from '../services/workout.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  template: `
    <div *ngIf="isLoading" class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>

    <div *ngIf="!isLoading">
      <div
        *ngFor="let workout of workoutGroup.workouts"
        class="card"
        [ngClass]="{ 'bg-success': workout.is_completed, 'text-white': workout.is_completed }"
        (click)="gotoWorkout(workout)"
      >
        <div class="card-body">
          Week {{ workout.week_number }}, Day {{ workout.day_number }} - {{ workout.label }}
          <i class="fas fa-check-circle" *ngIf="workout.is_completed"></i>
        </div>
      </div>

      <div class="done-button-div" *ngIf="workoutGroup.is_completed">
        <button class="btn btn-primary" (click)="done()">Done! New Maxes and Workouts <i class="fas fa-chevron-right"></i></button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-top: 5px;
    }
    .card:hover {
      border-color: cyan;
      border-width: 3px;
      cursor: pointer;
    }
    .fa-check-circle {
      float: right
    }
    .done-button-div {
      text-align: center;
      margin-top: 10px;
    }
  `]
})
export class DashboardComponent implements OnInit {

  isLoading = true;
  workoutGroup;

  constructor(private workoutService: WorkoutService, private router: Router) { }

  ngOnInit() {
    this.workoutService.getCurrentWorkoutGroup().subscribe(
      (workoutGroup) => {
        this.isLoading = false;
        this.workoutGroup = workoutGroup;
        if (!this.workoutGroup) {
          this.router.navigate(['/profile']);
        }
      },
      error => {
        this.isLoading = false;
        console.error(error);
      }
    );
  }

  gotoWorkout(workout) {
    this.router.navigate(['/workout'], { queryParams: { id: workout.id } } );
  }

  done() {
    this.router.navigate(['/finish']);
  }
}
