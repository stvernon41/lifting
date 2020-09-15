import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import jwt_decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(username: string, password: string) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post(`/api-token-auth/`, { username, password }, {headers}).pipe(
      map(
        (data: any) => {
          if (data.token) {
            localStorage.setItem('token', data.token);

            this.setRefreshTimeout();

            return true;
          }
          return false;
        },
      )
    );
  }

  public refreshToken() {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    const params = {token: localStorage.getItem('token')};

    this.http.post('/api-token-refresh/', params, httpOptions).subscribe(
      (data: any) => {
        localStorage.setItem('token', data.token);

        this.setRefreshTimeout();
      },
      error => {
        console.error(error);
      }
    );
  }

  public logout() {
    localStorage.removeItem('token');
  }

  private setRefreshTimeout() {
    const token = localStorage.getItem('token');
    const expMs = jwt_decode(token).exp * 1000;
    const timeoutMs = expMs - Date.now() - 10000;

    setTimeout( () => {
      this.refreshToken();
    }, timeoutMs);
  }
}
