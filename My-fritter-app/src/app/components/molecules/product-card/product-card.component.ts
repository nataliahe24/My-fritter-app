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

  onEditClick(): void {
    this.editProduct.emit();
  }
} 