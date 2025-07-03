import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuantityInputComponent),
      multi: true
    }
  ]
})
export class QuantityInputComponent implements ControlValueAccessor {
  @Input() min = 1;
  @Input() max = 99;
  @Input() disabled = false;
  @Output() quantityChange = new EventEmitter<number>();

  value = 1;
  onChange = (value: number) => {};
  onTouched = () => {};

  writeValue(value: number): void {
    this.value = value || this.min;
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  decrease(): void {
    if (!this.disabled && this.value > this.min) {
      this.value--;
      this.updateValue();
    }
  }

  increase(): void {
    if (!this.disabled && this.value < this.max) {
      this.value++;
      this.updateValue();
    }
  }

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const newValue = parseInt(input.value, 10);
    
    if (isNaN(newValue) || newValue < this.min) {
      this.value = this.min;
    } else if (newValue > this.max) {
      this.value = this.max;
    } else {
      this.value = newValue;
    }
    
    this.updateValue();
  }

  private updateValue(): void {
    this.onChange(this.value);
    this.onTouched();
    this.quantityChange.emit(this.value);
  }
} 