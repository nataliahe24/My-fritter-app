import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { ProductListComponent } from '../../components/organism/product-list/product-list.component';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent {
  @Output() openCart = new EventEmitter<void>();
  @ViewChild(ProductListComponent) productList!: ProductListComponent;

  onCartClick(): void {
    console.log('Products page cart click!');
    // Open cart modal in product list
    if (this.productList) {
      this.productList.openCartModal();
    }
  }
} 