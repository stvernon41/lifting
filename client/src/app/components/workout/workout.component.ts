import { Component, OnInit } from '@angular/core';
import {WorkoutService} from '../../services/workout.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-workout',
  template: `
    <div *ngIf="isLoading" class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>

    <div *ngIf="!isLoading">
      <div class="title-div">
        <h3>Week {{workout.week_number}}, Day {{workout.day_number}} - {{workout.label}}</h3>
      </div>

      <app-set *ngFor="let set of workout.main_sets" [set]="set" [isMain]="true"></app-set>
      <app-set *ngFor="let set of workout.aux_sets" [set]="set" [isMain]="false" (replaceExercise)="replaceExercise(set)"></app-set>

      <div class="complete-button-div">
        <button class="btn btn-success" (click)="completeWorkout()">Complete Workout</button>
      </div>
    </div>
  `,
  styles: [`
    .title-div {
      text-align: center;
    }
    .complete-button-div {
      text-align: center;
      margin-top: 5px;
    }
  `]
})
export class WorkoutComponent implements OnInit {

  workout: any;
  isLoading = true;

  constructor(private workoutService: WorkoutService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.hasOwnProperty('id')) {
        this.loadWorkout(params.id);
      } else {
        this.loadNextWorkout();
      }
    });
  }

  loadWorkout(id) {
    this.isLoading = true;
    this.workoutService.getWorkout(id).subscribe(
      (workout) => {
        this.isLoading = false;
        this.workout = workout;
      }, error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  loadNextWorkout() {
    this.isLoading = true;
    this.workoutService.getCurrentWorkout().subscribe(
      (workout) => {
        this.isLoading = false;
        this.workout = workout;

        if (!this.workout) {
          this.router.navigate(['/dashboard']);
        }
      }, error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  completeWorkout() {
    this.workoutService.completeWorkout(this.workout.id).subscribe(
      (workout) => {
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  replaceExercise(set) {
    this.workoutService.replaceExercise(this.workout.id, set.exercise).subscribe(
      (newWorkout) => {
        this.workout = newWorkout;
      }, error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }
}
