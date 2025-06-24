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
  successMessage = '';
  errorMessage = '';

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

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';
    const formValue = this.productForm.value;
    const productData: CreateProductDto = {
      ...formValue,
      imageUrl: '' 
    };
    this.productsService.createProduct(productData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = `Producto '${formValue.name}' creado exitosamente.`;
        this.productForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error al crear el producto. Intente de nuevo.';
        console.error(err);
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