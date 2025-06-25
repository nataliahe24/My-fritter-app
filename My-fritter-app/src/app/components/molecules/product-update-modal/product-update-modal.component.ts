import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product, UpdateProductDto } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products/products.service';

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
  @Output() updateProduct = new EventEmitter<{id: string, data: UpdateProductDto, imageFile?: File}>();

  updateForm!: FormGroup;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService
  ) {}

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
      this.imagePreview = this.product.imageUrl;
      this.selectedImage = null;
    }
  }

  onImageSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        // Use notification service for this validation error
        console.error('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        // Use notification service for this validation error
        console.error('La imagen debe ser menor a 5MB.');
        return;
      }

      this.selectedImage = file;

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = this.product?.imageUrl || null;
  }

  onSubmit(): void {
    if (this.updateForm.invalid || !this.product) {
      return;
    }

    const formValue = this.updateForm.value;
    const updateData: UpdateProductDto = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price
    };

    console.log('Sending update request:', {
      id: this.product.id,
      data: updateData,
      hasNewImage: !!this.selectedImage
    });

    this.updateProduct.emit({
      id: this.product.id,
      data: updateData,
      imageFile: this.selectedImage || undefined
    });
  }

  onClose(): void {
    this.closeModal.emit();
    this.updateForm.reset();
    this.selectedImage = null;
    this.imagePreview = null;
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