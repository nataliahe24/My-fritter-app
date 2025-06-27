import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { NotificationService } from '../notifications/notification.service';
import { environment } from 'src/environments/environment';
import { Product, CreateProductDto, UpdateProductDto } from '../../models/product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    imageUrl: 'test-image.jpg'
  };

  const mockCreateProductDto: CreateProductDto = {
    name: 'Test Product',
    description: 'Test Description',
    price: 100,
    imageUrl: 'test-image.jpg'
  };

  const mockUpdateProductDto: UpdateProductDto = {
    name: 'Updated Product',
    description: 'Updated Description',
    price: 150
  };

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getProducts', () => {
    it('should get products successfully', () => {
      const mockProducts: Product[] = [mockProduct];

      service.getProducts(1, 10).subscribe(response => {
        expect(response).toEqual(mockProducts);
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}?page=1&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProducts);
    });

    it('should handle error when getting products', () => {
      service.getProducts(1, 10).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor');
          expect(notificationService.error).toHaveBeenCalledWith('Error del servidor');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}?page=1&size=10`);
      req.flush(
        { message: 'Error del servidor' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });

  describe('createProduct', () => {
    it('should create product successfully', () => {
      service.createProduct(mockCreateProductDto).subscribe(response => {
        expect(response).toEqual(mockProduct);
        expect(notificationService.success).toHaveBeenCalledWith(
          `Producto '${mockCreateProductDto.name}' creado exitosamente`
        );
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockProduct);
    });

    it('should handle 403 error', () => {
      service.createProduct(mockCreateProductDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('No tienes permisos para realizar esta acción');
          expect(notificationService.error).toHaveBeenCalledWith(
            'No tienes permisos para realizar esta acción'
          );
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}`);
      req.flush(
        { message: 'No tienes permisos para realizar esta acción' },
        { status: 403, statusText: 'Forbidden' }
      );
    });

    it('should handle 400 error', () => {
      service.createProduct(mockCreateProductDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Datos inválidos');
          expect(notificationService.error).toHaveBeenCalledWith('Datos inválidos');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}`);
      req.flush(
        { message: 'Datos inválidos' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle 500 error', () => {
      service.createProduct(mockCreateProductDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor');
          expect(notificationService.error).toHaveBeenCalledWith('Error del servidor');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}`);
      req.flush(
        { message: 'Error del servidor' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });

    it('should handle network error', () => {
      service.createProduct(mockCreateProductDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('La imagen excede el límite de 5MB. Por favor selecciona una imagen más pequeña.');
          expect(notificationService.error).toHaveBeenCalledWith(
            'La imagen excede el límite de 5MB. Por favor selecciona una imagen más pequeña.'
          );
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', () => {
      const productId = '1';
      const updatedProduct = { ...mockProduct, ...mockUpdateProductDto };

      service.updateProduct(productId, mockUpdateProductDto).subscribe(response => {
        expect(response).toEqual(updatedProduct);
        expect(notificationService.success).toHaveBeenCalledWith(
          `Producto '${mockUpdateProductDto.name}' actualizado exitosamente`
        );
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}/${productId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedProduct);
    });

    it('should handle error when updating product', () => {
      const productId = '1';

      service.updateProduct(productId, mockUpdateProductDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor');
          expect(notificationService.error).toHaveBeenCalledWith('Error del servidor');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}/${productId}`);
      req.flush(
        { message: 'Error del servidor' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', () => {
      const productId = '1';

      service.deleteProduct(productId).subscribe(response => {
        expect(response).toBeUndefined();
        expect(notificationService.success).toHaveBeenCalledWith(
          'Producto eliminado exitosamente'
        );
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}?id=${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('');
    });

    it('should handle error when deleting product', () => {
      const productId = '1';

      service.deleteProduct(productId).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor');
          expect(notificationService.error).toHaveBeenCalledWith('Error del servidor');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlProduct}?id=${productId}`);
      req.flush(
        { message: 'Error del servidor' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });
}); 