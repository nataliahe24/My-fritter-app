import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleDisplay'
})
export class RoleDisplayPipe implements PipeTransform {
  transform(roleName: string): string {
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