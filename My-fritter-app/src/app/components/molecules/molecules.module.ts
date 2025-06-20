import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AtomsModule } from '../atoms/atoms.module';
import { RouterModule } from '@angular/router';
import { ProductCardComponent } from './product-card/product-card.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent,
    ProductCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AtomsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent,
    ProductCardComponent
  ]
})
export class MoleculesModule { } 