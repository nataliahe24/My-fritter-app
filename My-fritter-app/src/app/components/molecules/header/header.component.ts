import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginService } from 'src/app/core/services/login/login.service';

interface NavItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() openCart = new EventEmitter<void>();
  @Input() showCart: boolean = true;
  
  constructor(private readonly loginService: LoginService) {
  }

  user = {
    name: this.loginService.getCurrentUser()?.name ?? '',
    role: this.loginService.getCurrentUser()?.role ?? null,
    avatar: '/assets/images/usuario.png'
  };

  get shouldShowCart(): boolean {
    return this.showCart && this.user.role?.name === 'BUYER';
  }

  onCartClick(): void {
    console.log('Header cart click!');
    this.openCart.emit();
  }
} 