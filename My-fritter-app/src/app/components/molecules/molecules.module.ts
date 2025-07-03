import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AtomsModule } from '../atoms/atoms.module';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductUpdateModalComponent } from './product-update-modal/product-update-modal.component';
import { DeleteProductModalComponent } from './delete-product-modal/delete-product-modal.component';
import { CartModalComponent } from './cart-modal/cart-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ProductCardComponent,
    ProductUpdateModalComponent,
    DeleteProductModalComponent,
    CartModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AtomsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    ProductCardComponent,
    ProductUpdateModalComponent,
    DeleteProductModalComponent,
    CartModalComponent
  ]
})
export class MoleculesModule { } 