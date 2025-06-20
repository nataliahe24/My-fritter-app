import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { AtomsModule } from '../atoms/atoms.module';
import { UserFormComponent } from './user-form/user-form.component';

@NgModule({
  declarations: [
    FooterComponent,
    LoginFormComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AtomsModule
  ],
  exports: [
    FooterComponent,
    LoginFormComponent,
    UserFormComponent
  ]
})
export class OrganismModule { }