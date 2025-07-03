import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-buyer-main-template',
  templateUrl: './buyer-template.component.html',
  styleUrls: ['./buyer-template.component.scss']
})
export class BuyerTemplateComponent {
  @Output() openCart = new EventEmitter<void>();

  isSidebarCollapsed = true;
   navItems = [
    { label: 'Productos', icon: 'inventory_2', route: '/products' }
  ];

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onCartClick(): void {
    this.openCart.emit();
  }
} 