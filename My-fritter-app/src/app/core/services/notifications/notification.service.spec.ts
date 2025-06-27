import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('success', () => {
    it('should emit success notification', () => {
      const message = 'Operación exitosa';
      let emittedMessage = '';
    
      service.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          emittedMessage = notifications[0].message;
        }
      });

      service.success(message);

      expect(emittedMessage).toBe(message);
    });

    it('should emit notification with success type', () => {
      const message = 'Operación exitosa';
      let emittedType = '';

      service.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          emittedType = notifications[0].type;
        }
      });

      service.success(message);

      expect(emittedType).toBe('success');
    });
  });

  describe('error', () => {
    it('should emit error notification', () => {
      const message = 'Error en la operación';
      let emittedMessage = '';
    
      service.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          emittedMessage = notifications[0].message;
        }
      });

      service.error(message);

      expect(emittedMessage).toBe(message);
    });

    it('should emit notification with error type', () => {
      const message = 'Error en la operación';
      let emittedType = '';

      service.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          emittedType = notifications[0].type;
        }
      });

      service.error(message);

      expect(emittedType).toBe('error');
    });
  });

  describe('warning', () => {
    it('should emit warning notification', () => {
      const message = 'Advertencia';
      let emittedMessage = '';
    
      service.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          emittedMessage = notifications[0].message;
        }
      });

      service.warning(message);

      expect(emittedMessage).toBe(message);
    });

    it('should emit notification with warning type', () => {
      const message = 'Advertencia';
      let emittedType = '';

      service.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          emittedType = notifications[0].type;
        }
      });

      service.warning(message);

      expect(emittedType).toBe('warning');
    });
  });

  describe('info', () => {
    it('should emit info notification', () => {
      const message = 'Información';
      let emittedMessage = '';
    
      service.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          emittedMessage = notifications[0].message;
        }
      });

      service.info(message);

      expect(emittedMessage).toBe(message);
    });

    it('should emit notification with info type', () => {
      const message = 'Información';
      let emittedType = '';

      service.notifications$.subscribe(notifications => {
        if (notifications.length > 0) {
          emittedType = notifications[0].type;
        }
      });

      service.info(message);

      expect(emittedType).toBe('info');
    });
  });

  describe('notification structure', () => {
    
    it('should generate unique IDs for notifications', () => {
      const notifications: any[] = [];

      service.notifications$.subscribe(notificationsList => {
        notifications.push(...notificationsList);
      });

      service.success('Test 1');
      service.error('Test 2');
      service.warning('Test 3');

      const ids = notifications.map(n => n.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });
  });

  describe('multiple notifications', () => {
    it('should handle multiple notifications correctly', () => {
      const messages: string[] = [];
      const types: string[] = [];

      service.notifications$.subscribe(notifications => {
        notifications.forEach(notification => {
          messages.push(notification.message);
          types.push(notification.type);
        });
      });

      service.success('Success message');
      service.error('Error message');
      service.warning('Warning message');
      service.info('Info message');

      expect(messages).toContain('Success message');
      expect(messages).toContain('Error message');
      expect(messages).toContain('Warning message');
      expect(messages).toContain('Info message');

      expect(types).toContain('success');
      expect(types).toContain('error');
      expect(types).toContain('warning');
      expect(types).toContain('info');
    });
  });
}); 