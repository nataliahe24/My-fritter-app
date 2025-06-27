import { Component } from '@angular/core';

@Component({
  selector: 'app-buyer-main-template',
  templateUrl: './buyer-template.component.html',
  styleUrls: ['./buyer-template.component.scss']
})
export class BuyerTemplateComponent {
  isSidebarCollapsed = true;
   navItems = [
    { label: 'Productos', icon: 'inventory_2', route: '/products' },
    { label: 'Pedidos', icon: 'shopping_cart', route: '/orders' },
  ];

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
} 