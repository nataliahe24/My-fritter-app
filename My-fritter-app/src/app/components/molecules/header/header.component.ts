import { Component } from '@angular/core';
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
  constructor(private readonly loginService: LoginService) {}

  user = {
    name: this.loginService.getCurrentUser()?.name ?? '',
    avatar: '/assets/images/usuario.png'
  };
  menuItems = [
    { icon: 'category', label: 'Categorías', route: '/categories'},
    { icon: 'location_on', label: 'Ubicaciones', route: '/locations'},
    { icon: 'person', label: 'Usuarios', route: '/users'}
  ];
} 