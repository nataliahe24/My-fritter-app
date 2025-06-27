import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-delete-product-modal',
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.scss']
})
export class DeleteProductModalComponent {
  @Input() product: Product | null = null;
  @Input() isOpen = false;
  @Input() isLoading = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<void>();

  onClose(): void {
    this.closeModal.emit();
  }

  onConfirmDelete(): void {
    if (this.product) {
      this.confirmDelete.emit();
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
} 