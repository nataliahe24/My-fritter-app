import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
  @Input() imageUrl = '';
  @Input() name = 'Product Name';
  @Input() description = 'Product description';
  @Input() price: number | null = null;
  @Input() showEditButton = false;
  @Input() showDeleteButton = false;
  @Input() showOrderButton = false;
  @Input() showAddToCartButton = false;
  @Output() editProduct = new EventEmitter<void>();
  @Output() deleteProduct = new EventEmitter<void>();
  @Output() orderProduct = new EventEmitter<Product>();
  @Output() addToCart = new EventEmitter<Product>();

  fallbackImage = 'assets/images/Bunuelos.jpg';
  currentImageUrl = '';

  ngOnInit(): void {
    this.currentImageUrl = this.imageUrl;
  }

  ngOnChanges(): void {
    this.currentImageUrl = this.imageUrl;
  }

  onImageError(): void {
    console.log('Image failed to load:', this.imageUrl);
    this.currentImageUrl = this.fallbackImage;
  }

  onEditClick(): void {
    this.editProduct.emit();
  }

  onDeleteClick(): void {
    this.deleteProduct.emit();
  }

  onOrderClick(): void {
    if (this.product) {
      this.orderProduct.emit(this.product);
    }
  }

  onAddToCartClick(): void {
    if (this.product) {
      this.addToCart.emit(this.product);
    }
  }
} 