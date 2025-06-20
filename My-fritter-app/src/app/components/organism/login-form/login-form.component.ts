import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login/login.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const credentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.loginService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          
          if (response && response.id) {
            this.loginService.setCurrentUser(response);
            
            if (this.loginService.isAdmin(response)) {
              this.router.navigate(['/admin']);
            } else if (this.loginService.isBuyer(response)) {
              this.router.navigate(['/buyer']);
            } else {
              this.errorMessage = 'Rol de usuario no reconocido.';
            }
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.loginForm.reset();
          this.errorMessage = 'Credenciales inválidas. Por favor intente de nuevo.';
        }
      });
    } else {
      console.log('LoginForm: Form is invalid');
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'Por favor ingrese un email válido';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
} 