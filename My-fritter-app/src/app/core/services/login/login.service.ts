import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { LoginDto, LoginResponse } from '../../models/login.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private readonly loginUrl = `${environment.apiUrlLogin}`;
  private currentUser: LoginResponse | null = null;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, credentials)
      .pipe(
        catchError(error => {
          console.error('Login error:', error);
          throw error;
        })
      );
  }

  setCurrentUser(user: LoginResponse): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): LoginResponse | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  private getRoleName(response: LoginResponse): string {
    if (typeof response.role === 'string') {
      // Parse Java RoleEntity string format: "RoleEntity(id=1, name=ADMIN, description=Administrador del sistema)"
      const roleString = response.role as string;
      const nameMatch = roleString.match(/name=([^,]+)/);
      if (nameMatch) {
        return nameMatch[1];
      }
      return response.role;
    }
    
    if (response.role && typeof response.role === 'object' && 'name' in response.role) {
      return (response.role as any).name || '';
    }
    
    return '';
  }

  isAdmin(response: LoginResponse): boolean {
    const roleName = this.getRoleName(response);
    return roleName.toLowerCase() === 'admin';
  }

  isBuyer(response: LoginResponse): boolean {
    const roleName = this.getRoleName(response);
    return roleName.toLowerCase() === 'buyer';
  }
}