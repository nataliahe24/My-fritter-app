import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from './logo/logo.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';
import { InputComponent } from './input/input.component';

@NgModule({
  declarations: [
    LogoComponent,
    PasswordInputComponent,
    LogoutButtonComponent,
    InputComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LogoComponent,
    PasswordInputComponent,
    LogoutButtonComponent,
    InputComponent
  ]
})
export class AtomsModule { } 