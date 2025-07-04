import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrdersService } from './orders.service';
import { NotificationService } from '../notifications/notification.service';
import { environment } from 'src/environments/environment';
import { CreateOrderDto, Order } from '../../models/order.model';
import { of, throwError } from 'rxjs';

describe('OrdersService', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockOrder: Order = {
    id: '1',
    userId: 1,
    items: [{
      productId: '1',
      productName: 'Test Product',
      productImageId: 'img1',
      quantity: 2,
      unitPrice: 1000,
      subtotal: 2000
    }],
    total: 2000,
    status: 'PENDING',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
    shippingAddress: {
      street: '123 Main St',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      postalCode: '12345',
      phoneNumber: '+1234567890',
      recipientName: 'John Doe'
    },
    paymentMethod: 'transferencia',
    trackingCode: 'ORD-001'
  };

  const mockCreateOrderDto: CreateOrderDto = {
    items: [{
      productId: '1',
      quantity: 2
    }],
    shippingAddress: {
      street: '123 Main St',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
      postalCode: '12345',
      phoneNumber: '+1234567890',
      recipientName: 'John Doe'
    },
    paymentMethod: 'transferencia'
  };

  beforeEach(() => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrdersService,
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });

    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create order successfully', () => {
    service.createOrder({ ...mockCreateOrderDto, userId: 1 }).subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCreateOrderDto);
    expect(req.request.headers.get('User-Id')).toBe('1');
    req.flush(mockOrder);

    expect(notificationService.success).toHaveBeenCalledWith('Orden creada exitosamente');
  });

  it('should get orders by user ID', () => {
    const userId = 1;
    const mockOrders = [mockOrder];

    service.getOrders(userId).subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('User-Id')).toBe(userId.toString());
    req.flush(mockOrders);
  });

  it('should get order by ID', () => {
    const orderId = '1';

    service.getOrderById(orderId).subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders/${orderId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should get order by tracking code', () => {
    const trackingCode = 'ORD-001';

    service.getOrderByTrackingCode(trackingCode).subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders/tracking/${trackingCode}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should get orders by status', () => {
    const status = 'PENDING';
    const mockOrders = [mockOrder];

    service.getOrdersByStatus(status).subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders/status/${status}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should update order status', () => {
    const orderId = '1';
    const status = 'PROCESSING';

    service.updateOrderStatus(orderId, status).subscribe(order => {
      expect(order).toEqual(mockOrder);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}orders/${orderId}/status?status=${status}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockOrder);

    expect(notificationService.success).toHaveBeenCalledWith(`Estado de la orden actualizado a: ${status}`);
  });

}); 