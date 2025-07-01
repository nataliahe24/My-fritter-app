import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './user.service';
import { NotificationService } from '../notifications/notification.service';
import { environment } from 'src/environments/environment';
import { createUserDto, User, UserResponse } from '../../models/user.model';

describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockUser: User = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    identityDocument: 12345678,
    phoneNumber: '3001234567',
    birthDate: new Date('1990-01-01'),
    email: 'john@example.com',
    password: 'password123'
  };

  const mockUserResponse: UserResponse = {
    firstName: 'John',
    lastName: 'Doe',
    identityDocument: 12345678,
    phoneNumber: '3001234567',
    birthDate: '1990-01-01',
    email: 'john@example.com',
    roleName: 'buyer'
  };

  const mockCreateUserDto: createUserDto = {
    firstName: 'John',
    lastName: 'Doe',
    identityDocument: 12345678,
    phoneNumber: '3001234567',
    birthDate: new Date('1990-01-01'),
    email: 'john@example.com',
    password: 'password123',
    role: 'buyer'
  };

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['success', 'error']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UsersService,
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('createUser', () => {
    it('should create user successfully', () => {
      service.createUser(mockCreateUserDto).subscribe(response => {
        expect(response).toEqual(mockUser);
        expect(notificationService.success).toHaveBeenCalledWith(
          `Usuario '${mockCreateUserDto.firstName}' creado exitosamente`
        );
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateUserDto);
      req.flush(mockUser);
    });

    it('should handle 403 error', () => {
      service.createUser(mockCreateUserDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('No tienes permisos para realizar esta acción');
          expect(notificationService.error).toHaveBeenCalledWith(
            'No tienes permisos para realizar esta acción'
          );
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.flush(
        { message: 'No tienes permisos para realizar esta acción' },
        { status: 403, statusText: 'Forbidden' }
      );
    });

    it('should handle 400 error', () => {
      service.createUser(mockCreateUserDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Datos inválidos');
          expect(notificationService.error).toHaveBeenCalledWith('Datos inválidos');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.flush(
        { message: 'Datos inválidos' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle 500 error', () => {
      service.createUser(mockCreateUserDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor');
          expect(notificationService.error).toHaveBeenCalledWith('Error del servidor');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.flush(
        { message: 'Error del servidor' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });

    it('should handle network error', () => {
      service.createUser(mockCreateUserDto).subscribe({
        error: (error) => {
          expect(error.message).toBe('Error de conexión. Por favor, intente nuevamente.');
          expect(notificationService.error).toHaveBeenCalledWith(
            'Error de conexión. Por favor, intente nuevamente.'
          );
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.error(new ErrorEvent('Network error'));
    });
  });

  describe('getUser', () => {
    it('should get user successfully', () => {
      service.getUser().subscribe(response => {
        expect(response).toEqual(mockUserResponse);
        expect(notificationService.success).toHaveBeenCalledWith(
          'Datos del usuario obtenidos exitosamente'
        );
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserResponse);
    });

    it('should handle error when getting user', () => {
      service.getUser().subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor');
          expect(notificationService.error).toHaveBeenCalledWith('Error del servidor');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.flush(
        { message: 'Error del servidor' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });

  describe('getUsers', () => {
    it('should get users list successfully', () => {
      const mockUsers: UserResponse[] = [mockUserResponse];

      service.getUsers().subscribe(response => {
        expect(response).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should handle error when getting users list', () => {
      service.getUsers().subscribe({
        error: (error) => {
          expect(error.message).toBe('Error del servidor');
          expect(notificationService.error).toHaveBeenCalledWith('Error del servidor');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrlUsers}`);
      req.flush(
        { message: 'Error del servidor' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });
}); 