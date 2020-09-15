import { Injectable } from '@angular/core';
import {map} from 'rxjs/operators';

import {HttpBaseService} from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends HttpBaseService {

  loadProfile() {
    return this.get('/api/v1/user_profile/').pipe(
      map((response: any) => response[0])
    );
  }

  saveProfile(profile) {
    return this.patch(`/api/v1/user_profile/${profile.id}/`, profile);
  }

  loadMainLifts() {
    return this.get('/api/v1/user_main_lift/');
  }

  saveMainLift(lift) {
    return this.patch(`/api/v1/user_main_lift/${lift.id}/`, lift);
  }

  addMainLift(lift) {
    return this.post(`/api/v1/user_main_lift/`, lift);
  }

  removeMainLift(lift) {
    return this.delete(`/api/v1/user_main_lift/${lift.id}/`);
  }

}
