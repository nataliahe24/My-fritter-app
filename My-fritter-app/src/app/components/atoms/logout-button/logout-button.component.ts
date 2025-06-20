import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/core/services/login/login.service';

@Component({
  selector: 'app-logout-button',
  templateUrl: './logout-button.component.html',
  styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent {
  @Output() logout = new EventEmitter<void>();

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  onLogout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
    this.logout.emit();
  }
} 