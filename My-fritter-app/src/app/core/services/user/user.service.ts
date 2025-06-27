import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { createUserDto, User, UserResponse } from '../../models/user.model';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly API_URL = `${environment.apiUrlUsers}`;
  

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  createUser(userData: createUserDto): Observable<User> {
    return this.http.post<User>(`${this.API_URL}`, userData)
      .pipe(
        map(response => {
          this.notificationService.success(`Usuario '${userData.firstName}' creado exitosamente`);
          return response;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API_URL}`)
      .pipe(
        map(response => {
          this.notificationService.success('Datos del usuario obtenidos exitosamente');
          return response;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.API_URL}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = 'Error de conexión. Por favor, intente nuevamente.';
    } else {
      switch (error.status) {
        case 403:
          errorMessage = error.error?.message || 'No tienes permisos para realizar esta acción';
          break;
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 500:
          errorMessage = error.error?.message || 'Error del servidor';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}`;
      }
    }

    this.notificationService.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
