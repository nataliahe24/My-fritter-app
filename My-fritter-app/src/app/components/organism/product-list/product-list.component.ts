import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products/products.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products$?: Observable<Product[]>;
  currentPage$ = new BehaviorSubject<number>(0);
  pageSize = 10;
  hasMoreProducts = true;

  private readonly images: string[] = [
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

        this.hasMoreProducts = response.page < response.totalPages - 1;

        return fetchedProducts.map((product: Product, index: number) => ({
          ...product,
          imageUrl: this.images[index % this.images.length],
        }));
      })
    );
  }

  nextPage(): void {
    if (this.hasMoreProducts) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage$.value > 0) {
      this.currentPage$.next(this.currentPage$.value - 1);
    }
  }
} 