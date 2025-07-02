import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Order, CreateOrderDto, UpdateOrderStatusDto } from '../../models/order.model';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly API_URL = `${environment.apiUrl}orders`;

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService
  ) {}

  createOrder(orderData: CreateOrderDto): Observable<Order> {
    console.log('OrdersService - orderData received:', orderData);
    console.log('OrdersService - userId:', orderData.userId);
    console.log('OrdersService - userId type:', typeof orderData.userId);
    
    if (!orderData.userId) {
      console.error('OrdersService - userId is missing or invalid');
      return throwError(() => new Error('User ID is required'));
    }
    
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('User-Id', orderData.userId.toString());
    
    console.log('OrdersService - headers being sent:', headers);
    
    // Remove userId from the body since it's now in the header
    const { userId, ...orderBody } = orderData;
    
    console.log('OrdersService - orderBody being sent:', orderBody);
    
    return this.http.post<Order>(this.API_URL, orderBody, { headers })
      .pipe(
        map(response => {
          this.notificationService.success('Orden creada exitosamente');
          return response;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  getOrders(userId: number): Observable<Order[]> {
    const headers = new HttpHeaders().set('User-Id', userId.toString());
    
    return this.http.get<Order[]>(this.API_URL, { headers })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/${orderId}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getOrderByTrackingCode(trackingCode: string): Observable<Order> {
    return this.http.get<Order>(`${this.API_URL}/tracking/${trackingCode}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.API_URL}/status/${status}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateOrderStatus(orderId: string, status: string): Observable<Order> {
    const params = new HttpParams().set('status', status);
    
    return this.http.put<Order>(`${this.API_URL}/${orderId}/status`, null, { params })
      .pipe(
        map(response => {
          this.notificationService.success(`Estado de la orden actualizado a: ${status}`);
          return response;
        }),
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
        case 404:
          errorMessage = error.error?.message || 'Orden no encontrada';
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