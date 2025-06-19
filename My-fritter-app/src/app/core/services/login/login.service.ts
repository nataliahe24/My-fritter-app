import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoginDto, LoginResponse } from '../../models/login.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly loginUrl = `${environment.apiUrlLogin}`;

  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials)
      .pipe(
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  isAdmin(response: LoginResponse): boolean {
    return response.role.toLowerCase() === 'admin';
  }

  isBuyer(response: LoginResponse): boolean {
    return response.role.toLowerCase() === 'buyer';
  }
}