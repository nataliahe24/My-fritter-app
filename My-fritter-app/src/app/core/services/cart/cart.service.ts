import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { LoginService } from '../login/login.service';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private currentUserId: number | null = null;
  private userChangeSubscription: Subscription;

  constructor(private loginService: LoginService) {
    this.initializeCart();
    
    // Listen for user changes
    this.userChangeSubscription = this.loginService.getUserChanges().subscribe(user => {
      if (user && user.id !== this.currentUserId) {
        this.currentUserId = user.id;
        this.loadCartFromStorage();
      } else if (!user) {
        this.currentUserId = null;
        this.cartItems.next([]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userChangeSubscription) {
      this.userChangeSubscription.unsubscribe();
    }
  }

  private initializeCart(): void {
    const currentUser = this.loginService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.currentUserId = currentUser.id;
      this.loadCartFromStorage();
    } else {
      this.currentUserId = null;
      this.cartItems.next([]);
    }
  }

  private getCartKey(): string {
    if (!this.currentUserId) {
      throw new Error('No user ID available for cart');
    }
    return `cart_user_${this.currentUserId}`;
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  getCartItemsValue(): CartItem[] {
    return this.cartItems.value;
  }

  addToCart(product: Product, quantity: number = 1): void {
    if (!this.currentUserId) {
      console.error('Cannot add to cart: No user logged in');
      return;
    }

    const currentItems = this.cartItems.value;
    const existingItemIndex = currentItems.findIndex(
      item => item.product.id === product.id
    );

    if (existingItemIndex >= 0) {
      currentItems[existingItemIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.updateCart(currentItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (!this.currentUserId) {
      console.error('Cannot update cart: No user logged in');
      return;
    }

    const currentItems = this.cartItems.value;
    const itemIndex = currentItems.findIndex(
      item => item.product.id === productId
    );

    if (itemIndex >= 0) {
      if (quantity <= 0) {
        currentItems.splice(itemIndex, 1);
      } else {
        currentItems[itemIndex].quantity = quantity;
      }
      this.updateCart(currentItems);
    }
  }

  removeFromCart(productId: string): void {
    if (!this.currentUserId) {
      console.error('Cannot remove from cart: No user logged in');
      return;
    }

    const currentItems = this.cartItems.value;
    const filteredItems = currentItems.filter(
      item => item.product.id !== productId
    );
    this.updateCart(filteredItems);
  }

  clearCart(): void {
    if (!this.currentUserId) {
      console.error('Cannot clear cart: No user logged in');
      return;
    }

    this.updateCart([]);
  }

  getTotalItems(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.quantity, 0
    );
  }

  getTotalPrice(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + (item.product.price * item.quantity), 0
    );
  }

  // Method to refresh cart when user changes
  refreshCartForUser(): void {
    this.initializeCart();
  }

  private updateCart(items: CartItem[]): void {
    this.cartItems.next(items);
    this.saveCartToStorage();
  }

  private saveCartToStorage(): void {
    try {
      const cartKey = this.getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(this.cartItems.value));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  private loadCartFromStorage(): void {
    try {
      const cartKey = this.getCartKey();
      const savedCart = localStorage.getItem(cartKey);
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        this.cartItems.next(cartItems);
      } else {
        this.cartItems.next([]);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      this.cartItems.next([]);
    }
  }
} 