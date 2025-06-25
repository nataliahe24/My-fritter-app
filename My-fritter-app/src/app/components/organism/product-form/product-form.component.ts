import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from 'src/app/core/services/products/products.service';
import { CreateProductDto } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm!: FormGroup;
  isLoading = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(5)]],
      price: [null, [Validators.required, Validators.min(0.01)]],
    });
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
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }
    this.isLoading = true;
    
    const formValue = this.productForm.value;
    const productData: CreateProductDto = {
      name: formValue.name,
      description: formValue.description,
      price: formValue.price,
      imageUrl: '' // This will be set by the backend
    };

    this.productsService.createProduct(productData, this.selectedImage || undefined).subscribe({
      next: () => {
        this.isLoading = false;
        this.productForm.reset();
        this.selectedImage = null;
        this.imagePreview = null;
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (controlName === 'price' && control?.hasError('min')) {
      return 'El precio debe ser mayor a 0.';
    }
    if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres.`;
    }
    return '';
  }
} 