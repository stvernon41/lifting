import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpBaseService {

  constructor(protected http: HttpClient, protected cookieService: CookieService, private authService: AuthService) { }

  getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('X-CSRFToken', this.cookieService.get('csrftoken'));
    headers = headers.append('X-Requested-With', 'XMLHttpRequest');
    return headers;
  }

  get(url) {
    return this.http.get(url);
  }

  post(url, body: any | null) {
    const headers = this.getHeaders();
    return this.http.post(url, body, {headers});
  }

  patch(url, body) {
    const headers = this.getHeaders();
    return this.http.patch(url, body, {headers});
  }

  delete(url) {
    const headers = this.getHeaders();
    return this.http.delete(url, {headers});
  }
}
