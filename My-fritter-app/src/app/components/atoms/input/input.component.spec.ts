import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';
import { FormsModule } from '@angular/forms';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputComponent);
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
    expect(component.type).toBe('text');
    expect(component.label).toBe('');
    expect(component.maxLength).toBeNull();
    expect(component.required).toBe(false);
    expect(component.errorMessage).toBe('');
    expect(component.class).toBe('');
    expect(component.autocomplete).toBe('off');
  });

  it('should set label correctly', () => {
    const testLabel = 'Test Label';
    component.label = testLabel;
    fixture.detectChanges();

    const labelElement = fixture.nativeElement.querySelector('label');
    expect(labelElement.textContent).toContain(testLabel);
  });

  it('should set placeholder correctly', () => {
    const testPlaceholder = 'Test placeholder';
    component.placeholder = testPlaceholder;
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.placeholder).toBe(testPlaceholder);
  });

  it('should set type correctly', () => {
    const testType = 'password';
    component.type = testType;
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.type).toBe(testType);
  });

  it('should set value correctly', () => {
    const testValue = 'test value';
    component.value = testValue;
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.value).toBe(testValue);
  });

  it('should set maxLength correctly', () => {
    const testMaxLength = 10;
    component.maxLength = testMaxLength;
    fixture.detectChanges();

    const inputElement = fixture.nativeElement.querySelector('input');
    expect(inputElement.maxLength).toBe(testMaxLength);
  });
}); 