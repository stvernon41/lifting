import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProfileService} from '../../services/profile.service';
import {MUSCLE_GROUPS} from '../../constants';


@Component({
  selector: 'app-main-lift-inputs',
  template: `
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="max">1-Rep Max (lbs) <i class="fas fa-question-circle" tooltip="Theoretical Maximum weight you can lift one time"></i></label>
        <input
          type="number"
          class="form-control"
          name="max"
          step="5"
          [(ngModel)]="lift.weight_1_rep_max"
          [ngClass]="{ 'is-invalid': !lift.weight_1_rep_max }"
          (change)="saveLift()">
      </div>
      <div class="form-group col-md-6">
        <label for="increment">Increment (lbs) <i class="fas fa-question-circle" tooltip="Amount your 1-Rep Max will increase if you hit all your targets"></i></label>
        <input
          type="number"
          class="form-control"
          name="increment"
          step="5"
          [(ngModel)]="lift.increment"
          [ngClass]="{ 'is-invalid': !lift.increment }"
          (change)="saveLift()">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group col-md-6">
        <label for="aux-muscle-group1">Aux Lift Muscle Group 1</label>
        <select class="form-control" id="aux-muscle-group1" name="aux-muscle-group1" [(ngModel)]="lift.aux_muscle_group1" (change)="saveLift()">>
          <option value=""></option>
          <option *ngFor="let mg of MUSCLE_GROUPS" [value]="mg.value">{{mg.label}}</option>
        </select>
      </div>
      <div class="form-group col-md-6">
        <label for="aux-muscle-group1">Aux Lift Muscle Group 2</label>
        <select class="form-control" id="aux-muscle-group2" name="aux-muscle-group2" [(ngModel)]="lift.aux_muscle_group2" (change)="saveLift()">>
          <option value=""></option>
          <option *ngFor="let mg of MUSCLE_GROUPS" [value]="mg.value">{{mg.label}}</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .fa-question-circle {
      color: deepskyblue;
    }
  `]
})
export class MainLiftInputsComponent implements OnInit {

  @Input() lift: any;
  @Output() inputChanged = new EventEmitter();

  MUSCLE_GROUPS = MUSCLE_GROUPS;

  constructor(private profileService: ProfileService) { }

  ngOnInit() { }

  saveLift() {
    this.inputChanged.emit(this.lift);
  }
}
