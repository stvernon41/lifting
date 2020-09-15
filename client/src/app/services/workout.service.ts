import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';
import {HttpBaseService} from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService extends HttpBaseService {

  loadExercises() {
    return this.get('/api/v1/exercise/');
  }


  getCurrentWorkoutGroup() {
    return this.get('/api/v1/workout_group/?limit=1').pipe(
      map((response: any) => response.results[0])
    );
  }

  generateWorkouts() {
    return this.post(`/api/v1/workout_group/`, null);
  }

  getWorkout(id) {
    return this.get(`/api/v1/workout/${id}/`);
  }

  getCurrentWorkout() {
    return this.get('/api/v1/workout/?limit=1&is_completed=false').pipe(
      map((response: any) => response.results[0])
    );
  }

  updateMainSet(set) {
    return this.patch(`/api/v1/main_set/${set.id}/`, set);
  }

  updateAuxSet(set) {
    return this.patch(`/api/v1/aux_set/${set.id}/`, set);
  }

  completeWorkout(id) {
    return this.patch(`/api/v1/workout/${id}/`, {is_completed: true});
  }

  replaceExercise(workoutId, exerciseId) {
    return this.post(`/api/v1/replace_exercise/`, {workout: workoutId, exercise: exerciseId});
  }
}
