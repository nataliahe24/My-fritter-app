import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { QuantityInputComponent } from './quantity-input.component';

describe('QuantityInputComponent', () => {
  let component: QuantityInputComponent;
  let fixture: ComponentFixture<QuantityInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuantityInputComponent],
      imports: [FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(QuantityInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.min).toBe(1);
    expect(component.max).toBe(99);
    expect(component.disabled).toBeFalse();
    expect(component.value).toBe(1);
  });

  it('should increase quantity when increase is called', () => {
    component.value = 5;
    component.increase();
    expect(component.value).toBe(6);
  });

  it('should not increase beyond max value', () => {
    component.value = 99;
    component.increase();
    expect(component.value).toBe(99);
  });

  it('should decrease quantity when decrease is called', () => {
    component.value = 5;
    component.decrease();
    expect(component.value).toBe(4);
  });

  it('should not decrease below min value', () => {
    component.value = 1;
    component.decrease();
    expect(component.value).toBe(1);
  });

  it('should not change value when disabled', () => {
    component.disabled = true;
    component.value = 5;
    
    component.increase();
    expect(component.value).toBe(5);
    
    component.decrease();
    expect(component.value).toBe(5);
  });

  it('should emit quantityChange when value changes', () => {
    spyOn(component.quantityChange, 'emit');
    component.increase();
    expect(component.quantityChange.emit).toHaveBeenCalledWith(2);
  });

  it('should handle input change correctly', () => {
    const event = { target: { value: '10' } } as any;
    component.onInputChange(event);
    expect(component.value).toBe(10);
  });

  it('should clamp value to min when input is below min', () => {
    const event = { target: { value: '0' } } as any;
    component.onInputChange(event);
    expect(component.value).toBe(1);
  });

  it('should clamp value to max when input is above max', () => {
    const event = { target: { value: '100' } } as any;
    component.onInputChange(event);
    expect(component.value).toBe(99);
  });

  it('should handle invalid input by setting to min', () => {
    const event = { target: { value: 'invalid' } } as any;
    component.onInputChange(event);
    expect(component.value).toBe(1);
  });
}); 