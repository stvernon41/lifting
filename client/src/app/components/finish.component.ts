import { Component, OnInit } from '@angular/core';
import {WorkoutService} from '../services/workout.service';
import {Router} from '@angular/router';
import {ProfileService} from '../services/profile.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-finish',
  template: `
    <div *ngIf="isLoading" class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>

    <div *ngIf="!isLoading">
      <div class="card main-lift-card" *ngFor="let lift of mainLifts; let index = index">
        <div class="card-header">
          {{lift.exercise_full.name}} ({{lift.exercise_full.muscle_group}})
        </div>
        <div class="card-body">
          <form>
            <div class="form-row">
              <div class="form-group col-md-2">
              </div>
              <div class="form-group col-md-3">
                <label for="old-max">Old Max</label>
                <input
                  type="number"
                  class="form-control"
                  name="old-max"
                  readonly
                  [value]="lift.old_1_rep_max">
              </div>
              <div class="form-group col-md-3">
                <label for="new-max">New Max</label>
                <input
                  type="number"
                  class="form-control"
                  name="new-max"
                  [ngClass]="{ 'is-invalid': !lift.weight_1_rep_max }"
                  [(ngModel)]="lift.weight_1_rep_max">
              </div>
              <div class="form-group col-md-2">
                <i *ngIf="lift.is_pass" class="fas fa-check-circle fa-4x"></i>
                <i *ngIf="!lift.is_pass" class="fas fa-times-circle fa-4x"></i>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="update-button-div">
        <button class="btn btn-primary" (click)="updateAndGenerate()" [disabled]="isSaving">Update and generate new Workouts <i class="fas fa-chevron-right"></i></button>
    </div>
  `,
  styles: [`
    .fa-check-circle {
      color: forestgreen;
    }
    .fa-times-circle {
      color: red;
    }
    .update-button-div {
      text-align: center;
      margin-top: 10px;
    }
  `]
})
export class FinishComponent implements OnInit {

  workoutGroup: any;
  mainLifts: any[];

  isLoading = true;
  isSaving = false;

  constructor(
    private workoutService: WorkoutService,
    private profileService: ProfileService,
    private router: Router) { }

  ngOnInit() {
    forkJoin([
      this.workoutService.getCurrentWorkoutGroup(),
      this.profileService.loadMainLifts()
    ]).subscribe(
      (results: [any, any[]]) => {
        this.workoutGroup = results[0];
        this.mainLifts = results[1];

        if (!this.workoutGroup || ! this.workoutGroup.is_completed) {
          this.router.navigate(['/profile']);
        }

        this.calcNewMaxes();

        this.isLoading = false;
      }, error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  calcNewMaxes() {
    for (const mainLift of this.mainLifts) {
      mainLift.old_1_rep_max = mainLift.weight_1_rep_max;
      mainLift.is_pass = this.isLiftPass(mainLift);

      if (mainLift.is_pass) {
        mainLift.weight_1_rep_max += mainLift.increment;
      }
    }
  }

  isLiftPass(lift) {
    for (const workout of this.workoutGroup.workouts) {
      for (const set of workout.main_sets) {
        if (lift.exercise === set.exercise) {
          if (set.actual_reps < set.target_reps) {
            return false;
          }
        }
      }
    }

    return true;
  }

  updateAndGenerate() {
    this.isSaving = true;
    const $saves = [];
    for (const mainLift of this.mainLifts) {
      $saves.push(
        this.profileService.saveMainLift(mainLift)
      );
    }

    forkJoin($saves).subscribe(
      () => {
        this.workoutService.generateWorkouts().subscribe(
          () => {
            this.router.navigate(['/dashboard']);
          }, error => {
            this.isLoading = false;
            console.error(error);
          }
        );
      }, error => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }
}
