import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CartService } from '../../../core/services/cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart-button',
  templateUrl: './cart-button.component.html',
  styleUrls: ['./cart-button.component.scss']
})
export class CartButtonComponent implements OnInit, OnDestroy {
  @Output() openCart = new EventEmitter<void>();

  totalItems = 0;
  private cartSubscription!: Subscription;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartItems().subscribe(
      items => {
        this.totalItems = this.cartService.getTotalItems();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  onCartClick(): void {
    console.log('Cart button clicked!');
    this.openCart.emit();
  }
} 