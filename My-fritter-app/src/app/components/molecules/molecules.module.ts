import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AtomsModule } from '../atoms/atoms.module';

@NgModule({
  declarations: [
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AtomsModule
  ],
  exports: [
    HeaderComponent,
    SidebarComponent
  ]
})
export class MoleculesModule { } 