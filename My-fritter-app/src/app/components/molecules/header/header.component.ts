import { Component, EventEmitter, Output } from '@angular/core';
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
  constructor(private readonly loginService: LoginService) {}

  user = {
    name: this.loginService.getCurrentUser()?.name ?? '',
    avatar: '/assets/images/usuario.png'
  };

  onCartClick(): void {
    console.log('Header cart click!');
    this.openCart.emit();
  }
} 