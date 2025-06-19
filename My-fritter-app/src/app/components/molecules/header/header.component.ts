import { Component } from '@angular/core';

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
  isMenuOpen = false;

  navItems: NavItem[] = [
    { label: 'Inicio', route: '/home' },
    { label: 'Productos', route: '/products' },
    { label: 'Nosotros', route: '/about' },
    { label: 'Contacto', route: '/contact' }
  ];

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
} 