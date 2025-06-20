import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AtomsModule } from '../atoms/atoms.module';
import { UserFormComponent } from './user-form/user-form.component';
import { ProductListComponent } from './product-list/product-list.component';
import { MoleculesModule } from '../molecules/molecules.module';

@NgModule({
  declarations: [
    FooterComponent,
    LoginFormComponent,
    UserFormComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AtomsModule,
    MoleculesModule
  ],
  exports: [
    FooterComponent,
    LoginFormComponent,
    UserFormComponent,
    ProductListComponent
  ]
})
export class OrganismModule { }