import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Product, CreateProductDto, UpdateProductDto } from '../../models/product.model';
import { NotificationService } from '../notifications/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly API_URL = `${environment.apiUrlProduct}`;

  constructor(
    private readonly http: HttpClient,
    private readonly notificationService: NotificationService
  ) {}


  createProduct(productData: CreateProductDto, imageFile?: File): Observable<Product> {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price.toString());
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.post<Product>(this.API_URL, formData)
      .pipe(
        map(response => {
          this.notificationService.success(`Producto '${productData.name}' creado exitosamente`);
          return response;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  
  createProductLegacy(productData: CreateProductDto): Observable<Product> {
    return this.http.post<Product>(this.API_URL, productData)
      .pipe(
        map(response => {
          this.notificationService.success(`Producto '${productData.name}' creado exitosamente`);
          return response;
        }),
        catchError(this.handleError.bind(this))
      );
  }


  getProducts(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.API_URL, { params })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/${id}`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  updateProduct(id: string, productData: UpdateProductDto): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/${id}`, productData)
      .pipe(
        map(response => {
          this.notificationService.success(`Producto '${productData.name}' actualizado exitosamente`);
          return response;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  updateProductWithFile(id: string, productData: UpdateProductDto, imageFile?: File): Observable<Product> {

    const formData = new FormData();
    
   
    formData.append('name', productData.name || '');
    formData.append('description', productData.description || '');
    formData.append('price', (productData.price || 0).toString());
    
  
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put<Product>(`${this.API_URL}/${id}`, formData)
      .pipe(
        map(response => {
          this.notificationService.success(`Producto '${productData.name}' actualizado exitosamente`);
          return response;
        }),
        catchError(this.handleError.bind(this))
      );
  }

  deleteProduct(id: string): Observable<void> {
   
    const params = new HttpParams().set('id', id);
    return this.http.delete(`${this.API_URL}`, { params, responseType: 'text' })
      .pipe(
        map(() => {
          this.notificationService.success('Producto eliminado exitosamente');
          return void 0;
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