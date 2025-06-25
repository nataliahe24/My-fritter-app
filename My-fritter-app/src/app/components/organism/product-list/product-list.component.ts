import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, UpdateProductDto } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products/products.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  @Input() isAdmin = false;
  @Output() productUpdated = new EventEmitter<void>();

  products$?: Observable<Product[]>;
  currentPage$ = new BehaviorSubject<number>(0);
  pageSize = 5;
  hasMoreProducts = true;
  currentPage = 1;
  totalPages = 0;
  isModalOpen = false;
  selectedProduct: Product | null = null;
  isLoading = false;
  errorMessage = '';

  private readonly fallbackImages: string[] = [
    'assets/images/Bunuelos.jpg',
    'assets/images/buñuelo2.png',
    'assets/images/buñuelo1.png',
  ];

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.products$ = this.currentPage$.pipe(
      switchMap((page) => this.productsService.getProducts(page, this.pageSize)),
      map((response: any) => {
        console.log('Raw API Response:', response);
        const fetchedProducts = response.content || [];
        console.log('Products to Render:', fetchedProducts);

        this.currentPage = response.page + 1; // Convert to 1-based for UI
        this.totalPages = response.totalPages;
        this.hasMoreProducts = response.page < response.totalPages - 1;

        return fetchedProducts.map((product: Product, index: number) => {
          console.log('Product from backend:', product);
          console.log('Backend imageId:', product.imageId);
          
          // Construct image URL using imageId and the correct endpoint
          let finalImageUrl: string;
          if (product.imageId && product.imageId.trim() !== '') {
            finalImageUrl = `${environment.imageEndpoint}/${product.imageId}`;
          } else {
            finalImageUrl = this.fallbackImages[index % this.fallbackImages.length];
          }
          
          console.log('Final imageUrl to display:', finalImageUrl);
          
          return {
            ...product,
            imageUrl: finalImageUrl,
          };
        });
      })
    );
  }

  onPageChange(page: number): void {
    if (page === this.currentPage) return;
    this.currentPage$.next(page - 1); // Convert to 0-based for API
  }

  onEditProduct(product: Product): void {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  onCloseModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
    this.errorMessage = '';
  }

  onUpdateProduct(event: {id: string, data: UpdateProductDto, imageFile?: File}): void {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Updating product with ID:', event.id, 'Data:', event.data, 'Has file:', !!event.imageFile);

    if (event.imageFile) {
      
      this.productsService.updateProductWithFile(event.id, event.data, event.imageFile).subscribe({
        next: (response) => {
          console.log('Product updated successfully with file:', response);
          this.isLoading = false;
          this.onCloseModal();
          this.productUpdated.emit();
          
          this.currentPage$.next(this.currentPage$.value);
        },
        error: (err) => {
          console.error('Error updating product with file:', err);
          this.isLoading = false;
          this.errorMessage = 'Error al actualizar el producto. Por favor, intente de nuevo.';
        }
      });
    } else {
     
      this.productsService.updateProduct(event.id, event.data).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.isLoading = false;
          this.onCloseModal();
          this.productUpdated.emit();
         
          this.currentPage$.next(this.currentPage$.value);
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.isLoading = false;
          this.errorMessage = 'Error al actualizar el producto. Por favor, intente de nuevo.';
        }
      });
    }
  }
} 