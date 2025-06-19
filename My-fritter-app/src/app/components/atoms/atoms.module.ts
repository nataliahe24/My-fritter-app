import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LogoComponent } from './logo/logo.component';
import { PasswordInputComponent } from './password-input/password-input.component';

@NgModule({
  declarations: [
    LogoComponent,
    PasswordInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    LogoComponent,
    PasswordInputComponent
  ]
})
export class AtomsModule { } 