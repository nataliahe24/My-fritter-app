import { Component } from '@angular/core';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent {
  isSidebarCollapsed = true;
  
  navItems = [
    { label: 'Productos', icon: 'inventory_2', route: '/admin' },
    { label: 'Crear producto', icon: 'add', route: '/create-product' },
    { label: 'Reportes', icon: 'analytics', route: '/admin/reports' },
    { label: 'Usuarios', icon: 'people', route: '/users' },
  ];

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
} 