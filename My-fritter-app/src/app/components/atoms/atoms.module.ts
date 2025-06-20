import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo/logo.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';

@NgModule({
  declarations: [
    LogoComponent,
    PasswordInputComponent,
    LogoutButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LogoComponent,
    PasswordInputComponent,
    LogoutButtonComponent
  ]
})
export class AtomsModule { } 