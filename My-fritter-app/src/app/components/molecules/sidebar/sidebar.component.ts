import { Component } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isExpanded = true;

  navItems: NavItem[] = [
    { label: 'Inicio', icon: 'home', route: '/home' },
    { label: 'Productos', icon: 'inventory_2', route: '/products' },
    { label: 'Pedidos', icon: 'shopping_cart', route: '/orders' },
    { label: 'Clientes', icon: 'people', route: '/customers' }
  ];

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }
} 