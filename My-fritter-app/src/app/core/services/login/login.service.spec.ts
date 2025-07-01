import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { NotificationService } from '../notifications/notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginDto, LoginResponse, Role } from '../../models/login.model';


describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password123'
  };

  const mockRole: Role = {
    id: 1,
    name: 'buyer',
    description: 'Buyer role'
  };

  const mockLoginResponse: LoginResponse = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    message: 'Login successful',
    role: mockRole
  };

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoginService,
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    service.login(mockLoginDto).subscribe(response => {
      expect(response).toEqual(mockLoginResponse);
      expect(notificationService.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
    });

    const req = httpMock.expectOne(`${environment.apiUrlLogin}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginDto);
    req.flush(mockLoginResponse);
  });

  it('should handle login error', () => {
    service.login(mockLoginDto).subscribe({
      error: (error) => {
        expect(error.message).toBe('Error del servidor');
        expect(notificationService.error).toHaveBeenCalledWith('Error del servidor');
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrlLogin}`);
    req.flush(
      { message: 'Error del servidor' },
      { status: 500, statusText: 'Internal Server Error' }
    );
  });

  it('should set and get current user', () => {
    service.setCurrentUser(mockLoginResponse);
    const user = service.getCurrentUser();
    expect(user).toEqual(mockLoginResponse);
  });

  it('should logout and clear user', () => {
    service.setCurrentUser(mockLoginResponse);
    service.logout();
    expect(service.getCurrentUser()).toBeNull();
    expect(notificationService.success).toHaveBeenCalledWith('Sesión cerrada exitosamente. ¡Hasta pronto!');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return true for isAdmin if role is admin', () => {
    const adminRole: Role = { id: 2, name: 'admin', description: 'Admin role' };
    const adminResponse: LoginResponse = { ...mockLoginResponse, role: adminRole };
    expect(service.isAdmin(adminResponse)).toBeTrue();
  });

  it('should return true for isBuyer if role is buyer', () => {
    const buyerRole: Role = { id: 1, name: 'buyer', description: 'Buyer role' };
    const buyerResponse: LoginResponse = { ...mockLoginResponse, role: buyerRole };
    expect(service.isBuyer(buyerResponse)).toBeTrue();
  });
}); 