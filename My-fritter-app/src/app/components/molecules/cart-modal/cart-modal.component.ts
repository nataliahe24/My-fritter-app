import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService, CartItem } from '../../../core/services/cart/cart.service';
import { OrdersService } from '../../../core/services/orders/orders.service';
import { CreateOrderDto, ShippingAddress } from '../../../core/models/order.model';
import { Subscription } from 'rxjs';
import { QuantityInputComponent } from '../../atoms/quantity-input/quantity-input.component';
import { LoginService } from '../../../core/services/login/login.service';

@Component({
  selector: 'app-cart-modal',
  templateUrl: './cart-modal.component.html',
  styleUrls: ['./cart-modal.component.scss']
})
export class CartModalComponent implements OnInit, OnDestroy {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() orderCreated = new EventEmitter<void>();
  @ViewChildren(QuantityInputComponent) quantityInputs!: QueryList<QuantityInputComponent>;

  cartItems: CartItem[] = [];
  orderForm: FormGroup;
  loading = false;
  private cartSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private ordersService: OrdersService,
    private loginService: LoginService
  ) {
    this.orderForm = this.createForm();
  }

  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartItems().subscribe(
      items => {
        this.cartItems = items;
       
        setTimeout(() => {
          this.updateQuantityInputs();
        });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  private createForm(): FormGroup {
    return this.fb.group({
      recipientName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-()]+$/)]],
      street: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required, Validators.minLength(2)]],
      state: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required, Validators.minLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[\d-]+$/)]],
      paymentMethod: ['transferencia', [Validators.required]]
    });
  }

  private updateQuantityInputs(): void {
    if (this.quantityInputs) {
      this.quantityInputs.forEach((input, index) => {
        if (this.cartItems[index]) {
          input.writeValue(this.cartItems[index].quantity);
        }
      });
    }
  }

  onQuantityChange(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  onRemoveItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  get totalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  get totalItems(): number {
    return this.cartService.getTotalItems();
  }

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  onSubmit(): void {
    if (this.orderForm.valid && this.cartItems.length > 0) {
      this.loading = true;
    
      
      const currentUser = this.loginService.getCurrentUser();
      
      if (!currentUser) {
        this.loading = false;
        return;
      }
      
      if (!currentUser.id) {
        console.error('CartModal - User found but no ID:', currentUser);
        this.loading = false;
          return;
        }
        
        
      
      const formValue = this.orderForm.value;
      const shippingAddress: ShippingAddress = {
        street: formValue.street,
        city: formValue.city,
        state: formValue.state,
        country: formValue.country,
        postalCode: formValue.postalCode,
        phoneNumber: formValue.phoneNumber,
        recipientName: formValue.recipientName
      };

      const orderData: CreateOrderDto = {
        userId: currentUser.id,
        items: this.cartItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod: formValue.paymentMethod
      }

      this.ordersService.createOrder(orderData).subscribe({
        next: () => {
          this.loading = false;
          this.cartService.clearCart();
          this.orderCreated.emit();
          this.onClose();
        },
        error: (error) => {
          console.error('CartModal - Error creating order:', error);
          this.loading = false;
        }
      });
    }
  }

  private resetForm(): void {
    this.orderForm.reset({
      paymentMethod: 'transferencia'
    });
  }
} 