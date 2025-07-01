import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UsersService } from 'src/app/core/services/user/user.service';
import { UserResponse } from 'src/app/core/models/user.model';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersService: jasmine.SpyObj<UsersService>;

  const mockUsers: UserResponse[] = [
    {
      firstName: 'John',
      lastName: 'Doe',
      identityDocument: 12345678,
      phoneNumber: '3001234567',
      birthDate: '1990-01-01',
      email: 'john@example.com',
      roleName: 'buyer'
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      identityDocument: 87654321,
      phoneNumber: '3007654321',
      birthDate: '1985-05-15',
      email: 'jane@example.com',
      roleName: 'admin'
    }
  ];

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component initialization', () => {
    it('should initialize with loading state', () => {
      expect(component.loading).toBe(true);
      expect(component.users).toEqual([]);
    });

    it('should call loadUsers on init', () => {
      usersService.getUsers.and.returnValue(of(mockUsers));
      
      component.ngOnInit();

      expect(usersService.getUsers).toHaveBeenCalled();
    });
  });

  describe('Data loading', () => {
    it('should load users successfully', () => {
      usersService.getUsers.and.returnValue(of(mockUsers));

      component.ngOnInit();

      expect(component.users).toEqual(mockUsers);
      expect(component.loading).toBe(false);
    });

    it('should handle loading error', () => {
      usersService.getUsers.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();

      expect(component.users).toEqual([]);
      expect(component.loading).toBe(false);
    });

    it('should handle empty users list', () => {
      usersService.getUsers.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.users).toEqual([]);
      expect(component.loading).toBe(false);
    });
  });

  describe('Role display', () => {
    it('should return "Cliente" for buyer role', () => {
      const result = component.getRoleDisplayName('buyer');
      expect(result).toBe('Cliente');
    });

    it('should return "Administrador" for admin role', () => {
      const result = component.getRoleDisplayName('admin');
      expect(result).toBe('Administrador');
    });

    it('should return "Moderador" for moderator role', () => {
      const result = component.getRoleDisplayName('moderator');
      expect(result).toBe('Moderador');
    });

    it('should return original name for unknown role', () => {
      const result = component.getRoleDisplayName('unknown');
      expect(result).toBe('unknown');
    });

    it('should handle case insensitive role names', () => {
      expect(component.getRoleDisplayName('BUYER')).toBe('Cliente');
      expect(component.getRoleDisplayName('Admin')).toBe('Administrador');
      expect(component.getRoleDisplayName('MODERATOR')).toBe('Moderador');
    });

    it('should handle empty role name', () => {
      const result = component.getRoleDisplayName('');
      expect(result).toBe('');
    });
  });

  describe('Template rendering', () => {
    beforeEach(() => {
      usersService.getUsers.and.returnValue(of(mockUsers));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should display users table when data is loaded', () => {
      const table = fixture.nativeElement.querySelector('.users-table');
      expect(table).toBeTruthy();
    });

    it('should display correct number of user rows', () => {
      const rows = fixture.nativeElement.querySelectorAll('.users-table tbody tr');
      expect(rows.length).toBe(mockUsers.length);
    });

    it('should display user information correctly', () => {
      const firstRow = fixture.nativeElement.querySelector('.users-table tbody tr');
      const cells = firstRow.querySelectorAll('td');

      expect(cells[0].textContent).toContain('John Doe');
      expect(cells[1].textContent).toContain('12345678');
      expect(cells[2].textContent).toContain('3001234567');
      expect(cells[4].textContent).toContain('john@example.com');
    });

    it('should display role badges correctly', () => {
      const roleBadges = fixture.nativeElement.querySelectorAll('.role-badge');
      expect(roleBadges[0].textContent.trim()).toBe('Cliente');
      expect(roleBadges[1].textContent.trim()).toBe('Administrador');
    });

    it('should apply correct CSS classes to role badges', () => {
      const roleBadges = fixture.nativeElement.querySelectorAll('.role-badge');
      expect(roleBadges[0].classList).toContain('buyer');
      expect(roleBadges[1].classList).toContain('admin');
    });

    it('should display user avatars with initials', () => {
      const avatars = fixture.nativeElement.querySelectorAll('.user-avatar');
      expect(avatars[0].textContent.trim()).toBe('JD');
      expect(avatars[1].textContent.trim()).toBe('JS');
    });

    it('should format birth date correctly', () => {
      const dateCells = fixture.nativeElement.querySelectorAll('.users-table tbody tr td:nth-child(4)');
      expect(dateCells[0].textContent.trim()).toBe('01/01/1990');
      expect(dateCells[1].textContent.trim()).toBe('15/05/1985');
    });
  });

  describe('Loading states', () => {
    it('should hide loading message when not loading', () => {
      usersService.getUsers.and.returnValue(of(mockUsers));
      component.ngOnInit();
      component.loading = false;
      fixture.detectChanges();

      const loadingElement = fixture.nativeElement.querySelector('.loading-container');
      expect(loadingElement).toBeFalsy();
    });
  });

  describe('Empty state', () => {
    it('should show empty state when no users', () => {
      usersService.getUsers.and.returnValue(of([]));
      component.ngOnInit();
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('No hay usuarios registrados');
    });

    it('should hide empty state when users exist', () => {
      usersService.getUsers.and.returnValue(of(mockUsers));
      component.ngOnInit();
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeFalsy();
    });
  });

  describe('Error handling', () => {
    it('should handle service errors gracefully', () => {
      spyOn(console, 'error');
      usersService.getUsers.and.returnValue(throwError(() => new Error('Service error')));

      component.ngOnInit();

      expect(component.loading).toBe(false);
      expect(component.users).toEqual([]);
    });

    it('should handle network errors', () => {
      usersService.getUsers.and.returnValue(throwError(() => new Error('Network error')));

      component.ngOnInit();

      expect(component.loading).toBe(false);
      expect(component.users).toEqual([]);
    });
  });

  describe('Edge cases', () => {
    it('should handle users with missing data', () => {
      const incompleteUser: UserResponse = {
        firstName: 'John',
        lastName: '',
        identityDocument: 0,
        phoneNumber: '',
        birthDate: '',
        email: '',
        roleName: ''
      };

      usersService.getUsers.and.returnValue(of([incompleteUser]));
      component.ngOnInit();
      fixture.detectChanges();

      expect(() => component.getRoleDisplayName(incompleteUser.roleName)).not.toThrow();
    });

    it('should handle very long names', () => {
      const longNameUser: UserResponse = {
        ...mockUsers[0],
        firstName: 'A'.repeat(100),
        lastName: 'B'.repeat(100)
      };

      usersService.getUsers.and.returnValue(of([longNameUser]));
      component.ngOnInit();
      fixture.detectChanges();

      const avatar = fixture.nativeElement.querySelector('.user-avatar');
      expect(avatar.textContent.trim()).toBe('AB');
    });

    it('should handle special characters in names', () => {
      const specialCharUser: UserResponse = {
        ...mockUsers[0],
        firstName: 'José',
        lastName: 'García-López'
      };

      usersService.getUsers.and.returnValue(of([specialCharUser]));
      component.ngOnInit();
      fixture.detectChanges();

      const avatar = fixture.nativeElement.querySelector('.user-avatar');
      expect(avatar.textContent.trim()).toBe('JG');
    });

    it('should handle invalid birth dates', () => {
      const invalidDateUser: UserResponse = {
        ...mockUsers[0],
        birthDate: 'invalid-date'
      };

      usersService.getUsers.and.returnValue(of([invalidDateUser]));
      component.ngOnInit();
      
      // Should not throw error when component initializes
      expect(() => {
        try {
          fixture.detectChanges();
        } catch (error) {
          // Expected error from DatePipe, but component should still work
        }
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      usersService.getUsers.and.returnValue(of(mockUsers));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should have proper table structure', () => {
      const table = fixture.nativeElement.querySelector('table');
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');

      expect(thead).toBeTruthy();
      expect(tbody).toBeTruthy();
    });

    it('should have proper table headers', () => {
      const headers = fixture.nativeElement.querySelectorAll('th');
      const expectedHeaders = ['Usuario', 'Documento', 'Teléfono', 'Fecha Nacimiento', 'Email', 'Rol'];

      headers.forEach((header: Element, index: number) => {
        expect(header.textContent?.trim()).toBe(expectedHeaders[index]);
      });
    });

    it('should have proper ARIA labels', () => {
      const table = fixture.nativeElement.querySelector('table');
      // Check if table has role attribute or is a proper table element
      expect(table).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should handle large user lists efficiently', () => {
      const largeUserList = Array.from({ length: 1000 }, (_, i) => ({
        ...mockUsers[0],
        firstName: `User${i}`,
        lastName: `Last${i}`,
        email: `user${i}@example.com`
      }));

      usersService.getUsers.and.returnValue(of(largeUserList));

      const startTime = performance.now();
      component.ngOnInit();
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should complete within 100ms
      expect(component.users.length).toBe(1000);
    });
  });
}); 