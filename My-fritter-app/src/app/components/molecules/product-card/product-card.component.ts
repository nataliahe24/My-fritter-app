import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input() imageUrl = '';
  @Input() name = 'Product Name';
  @Input() description = 'Product description';
  @Input() price: number | null = null;
  @Input() showEditButton = false;
  @Output() editProduct = new EventEmitter<void>();

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
} 