import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/user/user.service';
import { UserResponse } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: UserResponse[] = [];
  loading = true;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getRoleDisplayName(roleName: string): string {
    switch (roleName.toLowerCase()) {
      case 'buyer':
        return 'Cliente';
      case 'admin':
        return 'Administrador';
      case 'moderator':
        return 'Moderador';
      default:
        return roleName; 
    }
  }
} 