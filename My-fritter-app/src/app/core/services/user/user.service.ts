import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { createUserDto, User } from '../../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = `${environment.apiUrlUsers}`;
  

  constructor(
    private readonly http: HttpClient,
  ) {}

  createUser(userData: createUserDto): Observable<User> {
    return this.http.post<User>(`${this.API_URL}`, userData);
  }
}
