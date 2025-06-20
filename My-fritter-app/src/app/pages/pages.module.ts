import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrganismModule } from '../components/organism/organism.module';
import { MoleculesModule } from '../components/molecules/molecules.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AtomsModule } from '../components/atoms/atoms.module';
import { AdminComponent } from './admin/admin.component';
import { TemplatesModule } from '../components/templates/templates.module';


const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: '',
          component: LoginComponent
        },
        {
          path: 'admin',
          component: AdminComponent
        }
      ]
    }
  
];

@NgModule({
  declarations: [
    LoginComponent,
    AdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OrganismModule,
    MoleculesModule,
    AtomsModule,
    ReactiveFormsModule,
    TemplatesModule
  ],
  exports: []
})
export class PagesModule { } 