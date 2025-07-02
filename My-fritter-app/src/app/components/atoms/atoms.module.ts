import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from './logo/logo.component';
import { PasswordInputComponent } from './password-input/password-input.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';
import { InputComponent } from './input/input.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { QuantityInputComponent } from './quantity-input/quantity-input.component';
import { CartButtonComponent } from './cart-button/cart-button.component';

@NgModule({
  declarations: [
    LogoComponent,
    PasswordInputComponent,
    LogoutButtonComponent,
    InputComponent,
    NotificationComponent,
    NotificationContainerComponent,
    QuantityInputComponent,
    CartButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    LogoComponent,
    PasswordInputComponent,
    LogoutButtonComponent,
    InputComponent,
    NotificationComponent,
    NotificationContainerComponent,
    QuantityInputComponent,
    CartButtonComponent
  ]
})
export class AtomsModule { } 