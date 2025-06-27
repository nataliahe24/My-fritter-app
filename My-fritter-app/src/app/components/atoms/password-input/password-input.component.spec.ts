import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordInputComponent } from './password-input.component';
import { FormsModule } from '@angular/forms';

describe('PasswordInputComponent', () => {
  let component: PasswordInputComponent;
  let fixture: ComponentFixture<PasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PasswordInputComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.value).toBe('');
    expect(component.disabled).toBe(false);
    expect(component.placeholder).toBe('');
    expect(component.showPassword).toBe(false);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);
    expect(component.getInputType()).toBe('password');

    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    expect(component.getInputType()).toBe('text');

    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
    expect(component.getInputType()).toBe('password');
  });

  it('should set placeholder correctly', () => {
    const testPlaceholder = 'Enter password';
    component.placeholder = testPlaceholder;
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.placeholder).toBe(testPlaceholder);
  });

  it('should set value correctly', () => {
    const testValue = 'testpassword';
    component.value = testValue;
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.value).toBe(testValue);
  });

  it('should set disabled correctly', () => {
    component.disabled = true;
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.disabled).toBe(true);
  });
}); 