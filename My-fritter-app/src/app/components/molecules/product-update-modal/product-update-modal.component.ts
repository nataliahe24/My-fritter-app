import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, UpdateProductDto } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-update-modal',
  templateUrl: './product-update-modal.component.html',
  styleUrls: ['./product-update-modal.component.scss']
})
export class ProductUpdateModalComponent implements OnInit, OnChanges {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Input() isLoading = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() updateProduct = new EventEmitter<{id: string, data: UpdateProductDto}>();

  updateForm!: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.updateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: [null, [Validators.required, Validators.min(0.01)]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['isOpen'] && this.product && this.isOpen) {
      this.updateForm.patchValue({
        name: this.product.name,
        description: this.product.description,
        price: this.product.price
      });
    }
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.product) {
      return;
    }

    this.errorMessage = '';

    const formValue = this.updateForm.value;
    const updateData: UpdateProductDto = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price
    };

    console.log('Sending update request:', {
      id: this.product.id,
      data: updateData
    });

    this.updateProduct.emit({
      id: this.product.id,
      data: updateData
    });
  }

  onClose(): void {
    this.closeModal.emit();
    this.updateForm.reset();
    this.errorMessage = '';
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.updateForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres.`;
    }
    if (control?.hasError('min')) {
      return 'El precio debe ser mayor a 0.';
    }
    return '';
  }
} 