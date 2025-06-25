import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from 'src/app/core/services/user/user.service';
import { createUserDto } from 'src/app/core/models/user.model';
import { minAgeValidator } from 'src/app/shared/validators/minAgeValidator';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() userType: 'admin' | 'buyer' = 'buyer';
  userForm!: FormGroup;
  minDate: Date;
  maxDate: Date;

  readonly PHONE_NUMBER_MIN_LENGTH = 10;
  readonly PHONE_NUMBER_MAX_LENGTH = 13;
  readonly IDENTITY_DOCUMENT_MIN_LENGTH = 7;
  readonly IDENTITY_DOCUMENT_MAX_LENGTH = 10;
  readonly PASSWORD_MIN_LENGTH = 6;
  readonly FIRST_NAME_MIN_LENGTH = 2;
  readonly LAST_NAME_MIN_LENGTH = 2;
  readonly MIN_AGE = 18;

  phoneNumberInfo = {
    currentLength: 0,
    maxLength: this.PHONE_NUMBER_MAX_LENGTH,
    minLength: this.PHONE_NUMBER_MIN_LENGTH,
    isValid: true,
    isDirty: false
  };

  identityDocumentInfo = {
    currentLength: 0,
    maxLength: this.IDENTITY_DOCUMENT_MAX_LENGTH,
    minLength: this.IDENTITY_DOCUMENT_MIN_LENGTH,
    isValid: true,
    isDirty: false
  };

  isLoading = false;
  icon = 'lock';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
  ) {
    this.minDate = new Date(1900, 0, 1);
    this.maxDate = new Date();
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
        firstName: ['', [
          Validators.required, 
          Validators.minLength(this.FIRST_NAME_MIN_LENGTH)]],
  
        lastName: ['', [
          Validators.required, 
          Validators.minLength(this.LAST_NAME_MIN_LENGTH)]],
  
        identityDocument: ['', [
          Validators.required, 
          Validators.pattern(/^(\d+)$/), 
          Validators.minLength(this.IDENTITY_DOCUMENT_MIN_LENGTH), 
          Validators.maxLength(this.IDENTITY_DOCUMENT_MAX_LENGTH)]],
  
        phoneNumber: ['', [
          Validators.required, 
          Validators.pattern('^\\+?[0-9]+$'),
          Validators.minLength(this.PHONE_NUMBER_MIN_LENGTH),
          Validators.maxLength(this.PHONE_NUMBER_MAX_LENGTH)
        ]],
  
        birthDate: ['', [Validators.required, minAgeValidator(this.MIN_AGE)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(this.PASSWORD_MIN_LENGTH)]]
      });
    }
  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.isLoading = true;

    const formValue = this.userForm.value;

    const userData: createUserDto = {
      ...formValue,
      identityDocument: parseInt(formValue.identityDocument, 10),
      role: this.userType,
    };

    console.log('Enviando datos de usuario:', userData);

    this.usersService.createUser(userData).subscribe({
      next: () => {
        this.isLoading = false;
        this.userForm.reset();
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    if (control?.hasError('pattern')) {
      return 'Este campo solo acepta números.';
    }
    if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres.`;
    }
    if (control?.hasError('email')) {
      return 'Por favor, ingrese un correo válido.';
    }
    return '';
  }
} 