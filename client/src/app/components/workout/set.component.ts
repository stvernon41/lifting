import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WorkoutService} from '../../services/workout.service';

@Component({
  selector: 'app-set',
  template: `
    <div
      class="card"
      [ngClass]="{ 'bg-success': this.set.actual_reps > 0, 'text-white': this.set.actual_reps > 0 }"
    >
      <div class="card-header">
        {{ set.exercise_full.name }} ({{ set.exercise_full.muscle_group }})
        <span *ngIf="isMain"> - {{set.percent_of_max}}%</span>
        <i *ngIf="!isMain" class="fas fa-random" (click)="replaceExercise.emit()"></i>
      </div>
      <div class="card-body">
        <form>
          <div class="form-group row">
            <div class="form-group col-md-2">
              <label for="targetReps">Target {{repLabel}}</label>
              <input type="number" readonly class="form-control" id="targetReps" name="targetReps" [value]="set.target_reps">
            </div>

            <div class="form-group col-md-2">
              <label for="weight">Weight</label>
              <input type="number" class="form-control" id="weight" name="weight" [(ngModel)]="set.weight" (change)="saveSet()" [readOnly]="isMain">
            </div>

            <div class="form-group col-md-2">
              <label for="actualReps">Completed {{repLabel}}</label>
              <input type="number" class="form-control" id="actualReps" name="actualReps" [(ngModel)]="set.actual_reps" (change)="saveSet()">
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .card {
      margin-top: 5px;
    }

    .fa-random {
      float: right;
      color: lawngreen;
    }
    .fa-random:hover {
      color: deepskyblue;
      cursor: pointer;
    }
  `]
})
export class SetComponent implements OnInit {

  @Input() set: any;
  @Input() isMain: boolean;
  @Output() replaceExercise = new EventEmitter();

  repLabel = '';
  constructor(private workoutService: WorkoutService) { }

  ngOnInit() {
    if (this.set.exercise_full.is_timed) {
      this.repLabel = 'Time';
    } else {
      this.repLabel = 'Reps';
    }
  }

  saveSet() {
    if (this.isMain) {
      this.workoutService.updateMainSet(this.set).subscribe(
        () => {},
        error => {
          console.error(error);
        }
      );
    } else {
      this.workoutService.updateAuxSet(this.set).subscribe(
        () => {},
        error => {
          console.error(error);
        }
      );
    }
  }

}
