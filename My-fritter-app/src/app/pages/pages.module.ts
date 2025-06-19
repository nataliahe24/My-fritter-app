import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrganismModule } from '../components/organism/organism.module';
import { MoleculesModule } from '../components/molecules/molecules.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../components/atoms/atoms.module';

const routes: Routes = [
  { path: 'login',
     component: LoginComponent },
  
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OrganismModule,
    MoleculesModule,
    AtomsModule,
    ReactiveFormsModule
  ],
  exports: []
})
export class PagesModule { } 