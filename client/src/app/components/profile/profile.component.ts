import {Component, OnInit, TemplateRef} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {WorkoutService} from '../../services/workout.service';

@Component({
  selector: 'app-profile',
  template: `
    <form>
      <h3>Plan</h3>
      <div *ngIf="isLoadingProfile" class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>

      <div *ngIf="!isLoadingProfile">
        <div class="form-check">
          <input class="form-check-input" type="radio" name="beginner" id="beginner" value="1" [(ngModel)]="profile.plan" (change)="saveProfile()">
          <label class="form-check-label" for="beginner">
            Beginner
          </label>
        </div>
        <p>For those just getting started and finding their 1-rep maxes.  5-5-5 every week.  Maxes re-calculated every week.</p>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="standard" id="standard" value="2" [(ngModel)]="profile.plan" (change)="saveProfile()">
          <label class="form-check-label" for="standard">
            Standard
          </label>
        </div>
        <p>For those who have found their 1-rep maxes and are looking to improve.  5-5-5 (week 1), 3-3-3 (week 2), 5-3-1 (week 3), deload (week 4). Maxes re-calculated every month.</p>
      </div>
    </form>

    <div *ngIf="isLoadingMainLifts" class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>

    <div *ngIf="!isLoadingMainLifts">
      <h3>Main Lifts</h3>
      <p>Lifts that are done once a week.  Number of main lifts will determine number of workouts per week.</p>

      <div class="card main-lift-card" *ngFor="let lift of mainLifts; let index = index">
        <div class="card-header">
          {{lift.exercise_full.name}} ({{lift.exercise_full.muscle_group}}) <i class="fas fa-trash-alt" (click)="removeMainLift(lift, index)"></i>
        </div>
        <div class="card-body">
          <form>
            <app-main-lift-inputs [lift]="lift" (inputChanged)="saveMainLift($event)"></app-main-lift-inputs>
          </form>
        </div>
      </div>

      <div class="row buttons-div">
        <div class="col-sm">
        </div>
        <div class="col-sm add-main-lift-button-div">
          <button class="btn btn-success" (click)="openAddMainLiftModal(addMainLiftTemplate)"><i class="fas fa-plus"></i> Add Main Lift</button>
        </div>
        <div class="col-sm generate-workouts-button-div">
          <button *ngIf="mainLifts.length > 0" class="btn btn-primary" (click)="generateWorkouts()">Generate Workouts <i class="fas fa-chevron-right"></i></button>
          <div *ngIf="isGeneratingWorkouts" class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>

    <ng-template #addMainLiftTemplate>
      <div class="modal-header">
        <h4 class="modal-title pull-left">Add Main Lift</h4>
        <button type="button" class="close pull-right" aria-label="Close" (click)="addMainLiftModalRef.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <form>
          <div class="form-row">
            <div class="form-group col-md-12">
              <label for="exercise">Main Lift</label>
              <ng-select
                [(ngModel)]="newMainLiftExercise"
                bindValue="id"
                bindLabel="name"
                [items]="exerciseChoices"
                [loading]="isLoadingExercises"
                loadingText="Loading..."
                placeholder="Main Lift"
                [clearable]="false"
                name="exercise"
              ></ng-select>
            </div>
          </div>

          <app-main-lift-inputs [lift]="newMainLiftSettings"></app-main-lift-inputs>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" (click)="addMainLiftModalRef.hide()">Close</button>
        <button class="btn btn-success" (click)="addMainLift()" [disabled]="!newMainLiftExercise"><i class="fas fa-plus"></i> Add</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .buttons-div {
      margin-top: 10px;
    }

    .add-main-lift-button-div {
      text-align: center;
      display: inline-block;
    }

    .generate-workouts-button-div {
      text-align: right;
      display: inline-block;
    }

    .main-lift-card {
      margin-top: 5px;
    }

    .fa-trash-alt {
      color: red;
      float: right
    }
    .fa-trash-alt:hover {
      color: palevioletred;
    }
  `]
})
export class ProfileComponent implements OnInit {

  isLoadingProfile = true;
  isLoadingMainLifts = true;
  profile: any;
  mainLifts: any[] = [];

  isLoadingExercises = true;
  exerciseChoices: any[];

  isGeneratingWorkouts = false;

  newMainLiftExercise;
  newMainLiftSettings = {
    weight_1_rep_max: 135,
    increment: 5,
    aux_muscle_group1: null,
    aux_muscle_group2: null
  };

  addMainLiftModalRef: BsModalRef;

  constructor(
    private profileService: ProfileService,
    private workoutService: WorkoutService,
    private modalService: BsModalService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProfile();
    this.loadMainLifts();
    this.loadExercises();
  }

  loadExercises() {
    this.isLoadingExercises = true;
    this.workoutService.loadExercises().subscribe(
      (exercises: any[]) => {
        this.isLoadingExercises = false;
        this.exerciseChoices = exercises;
      },
      error => {
        this.isLoadingExercises = false;
        console.error(error);
      }
    );
  }

  loadProfile() {
    this.isLoadingProfile = true;
    this.profileService.loadProfile().subscribe(
      profile => {
        this.isLoadingProfile = false;
        this.profile = profile;
      },
      error => {
        this.isLoadingProfile = false;
        console.error(error);
      }
    );
  }

  saveProfile() {
    this.isLoadingProfile = true;
    this.profileService.saveProfile(this.profile).subscribe(
      profile => {
        this.isLoadingProfile = false;
        this.profile = profile;
      },
      error => {
        this.isLoadingProfile = false;
        console.error(error);
      }
    );
  }

  loadMainLifts() {
    this.isLoadingMainLifts = true;
    this.profileService.loadMainLifts().subscribe(
      (mainLifts: any[]) => {
        this.isLoadingMainLifts = false;
        this.mainLifts = mainLifts;
      },
      error => {
        this.isLoadingMainLifts = false;
        console.error(error);
      }
    );
  }

  saveMainLift(lift) {
    if (lift.weight_1_rep_max && lift.increment) {
      lift.aux_muscle_group1 = lift.aux_muscle_group1 || null;
      lift.aux_muscle_group2 = lift.aux_muscle_group2 || null;

      this.profileService.saveMainLift(lift).subscribe(
        (newLift) => { },
        error => {
          console.error(error);
        }
      );
    }

  }

  openAddMainLiftModal(template: TemplateRef<any>) {
    this.addMainLiftModalRef = this.modalService.show(template);
  }

  addMainLift() {
    this.addMainLiftModalRef.hide();
    if (this.newMainLiftSettings.weight_1_rep_max && this.newMainLiftSettings.increment) {
      const settings = {
        profile: this.profile.id,
        exercise: this.newMainLiftExercise,
        ...this.newMainLiftSettings
      };
      this.profileService.addMainLift(settings).subscribe(
        (newLift) => {
          this.mainLifts.push(newLift);
        }, error => {
          console.error(error);
        }
      );
    }
  }

  removeMainLift(lift, index) {
    this.profileService.removeMainLift(lift).subscribe(
      () => {
        this.mainLifts.splice(index, 1);
      }, error => {
        console.error(error);
      }
    );
  }

  generateWorkouts() {
    this.workoutService.generateWorkouts().subscribe(
      (workoutGroup) => {
        this.router.navigate(['/dashboard']);
      }, error => {
        console.error(error);
      }
    );
  }
}
