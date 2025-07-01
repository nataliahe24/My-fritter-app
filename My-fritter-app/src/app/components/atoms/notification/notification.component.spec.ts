import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  const mockNotification = {
    id: 1,
    message: 'Test notification',
    type: 'success' as const,
    timestamp: new Date()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display notification message', () => {
    component.notification = mockNotification;
    fixture.detectChanges();

    const messageElement = fixture.nativeElement.querySelector('.notification-message');
    expect(messageElement.textContent).toContain(mockNotification.message);
  });

  it('should apply success class for success type', () => {
    component.notification = { ...mockNotification, type: 'success' as const };
    fixture.detectChanges();

    const notificationElement = fixture.nativeElement.querySelector('.notification');
    expect(notificationElement.classList).toContain('success');
  });

  it('should apply error class for error type', () => {
    component.notification = { ...mockNotification, type: 'error' as const };
    fixture.detectChanges();

    const notificationElement = fixture.nativeElement.querySelector('.notification');
    expect(notificationElement.classList).toContain('error');
  });
}); 