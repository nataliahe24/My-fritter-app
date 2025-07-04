import { TestBed } from '@angular/core/testing';
import { CartService, CartItem } from './cart.service';
import { Product } from '../../models/product.model';
import { BehaviorSubject } from 'rxjs';
import { LoginService } from '../login/login.service';

class MockLoginService {
  private userSubject = new BehaviorSubject<any>(null);
  private user: any = null;

  setUser(user: any) {
    this.user = user;
    this.userSubject.next(user);
  }

  getCurrentUser() {
    return this.user;
  }

  getUserChanges() {
    return this.userSubject.asObservable();
  }
}

describe('CartService', () => {
  let service: CartService;
  let loginService: MockLoginService;
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 10,
    description: '',
    imageUrl: '',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: LoginService, useClass: MockLoginService },
      ]
    });
    service = TestBed.inject(CartService);
    loginService = TestBed.inject(LoginService) as any;
    loginService.setUser({ id: 1, name: 'User1' });
    service.refreshCartForUser();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add product to cart', () => {
    service.addToCart(mockProduct, 2);
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product.id).toBe('1');
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should update quantity', () => {
    service.addToCart(mockProduct, 1);
    service.updateQuantity('1', 3);
    service.getCartItems().subscribe(items => {
      expect(items[0].quantity).toBe(3);
    });
  });

  it('should remove product from cart', () => {
    service.addToCart(mockProduct, 1);
    service.removeFromCart('1');
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should clear cart', () => {
    service.addToCart(mockProduct, 1);
    service.clearCart();
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should persist cart in localStorage', () => {
    service.addToCart(mockProduct, 2);
    const key = 'cart_user_1';
    const stored = localStorage.getItem(key);
    expect(stored).toContain('Test Product');
  });

  it('should load cart from localStorage on init', () => {
    const key = 'cart_user_1';
    localStorage.setItem(key, JSON.stringify([
      { product: mockProduct, quantity: 4 }
    ]));
    service.refreshCartForUser();
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(4);
    });
  });

  it('should reset cart when user logs out', () => {
    service.addToCart(mockProduct, 1);
    loginService.setUser(null);
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should switch cart when user changes', (done) => {
    service.addToCart(mockProduct, 1);

    loginService.setUser({ id: 2, name: 'User2' });
    service.refreshCartForUser();

    service.getCartItems().subscribe(itemsUser2 => {
      expect(itemsUser2.length).toBe(0);

    
      service.addToCart({ ...mockProduct, id: '2' }, 3);

      service.getCartItems().subscribe(itemsUser2b => {
        expect(itemsUser2b.length).toBe(1);
        expect(itemsUser2b[0].product.id).toBe('2');

        loginService.setUser({ id: 1, name: 'User1' });
        service.refreshCartForUser();

        service.getCartItems().subscribe(itemsUser1b => {
          expect(itemsUser1b.length).toBe(1);
          expect(itemsUser1b[0].product.id).toBe('1');
          done();
        });
      });
    });
  });

  it('should return total items and price', () => {
    service.addToCart(mockProduct, 2);
    service.addToCart({ ...mockProduct, id: '2', price: 5 }, 1);
    expect(service.getTotalItems()).toBe(3);
    expect(service.getTotalPrice()).toBe(25);
  });
}); 