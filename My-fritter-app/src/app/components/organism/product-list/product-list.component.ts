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
  isDeleteModalOpen = false;
  productToDelete: Product | null = null;
  isLoading = false;

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

        const fetchedProducts = response.content || [];
        this.currentPage = response.page + 1; 
        this.totalPages = response.totalPages;
        this.hasMoreProducts = response.page < response.totalPages - 1;

        return fetchedProducts.map((product: Product, index: number) => {
          let finalImageUrl: string;
          if (product.imageId && product.imageId.trim() !== '') {
            finalImageUrl = `${environment.imageEndpoint}/${product.imageId}`;
          } else {
            finalImageUrl = this.fallbackImages[index % this.fallbackImages.length];
          }
          
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
    this.currentPage$.next(page - 1); 
  }

  onEditProduct(product: Product): void {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  onDeleteProduct(product: Product): void {
    this.productToDelete = product;
    this.isDeleteModalOpen = true;
  }

  onCloseModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  onCloseDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.productToDelete = null;
  }

  onConfirmDelete(): void {
    if (!this.productToDelete) {
      return;
    }
    
    this.isLoading = true;

    this.productsService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        this.isLoading = false;
        this.onCloseDeleteModal();
        this.productUpdated.emit();
        this.currentPage$.next(this.currentPage$.value);
      }
    });
  }

  onUpdateProduct(event: {id: string, data: UpdateProductDto, imageFile?: File}): void {
    this.isLoading = true;

    this.productsService.updateProductWithFile(event.id, event.data, event.imageFile).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.onCloseModal();
        this.productUpdated.emit();
        this.currentPage$.next(this.currentPage$.value);
      }
    });
  }
} 