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
import { RegisterComponent } from './register/register.component';
import { BuyerComponent } from './buyer/buyer.component';
import { ProductsPageComponent } from './products-page/products-page.component';


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
        },
        {
          path: 'buyer',
          component: BuyerComponent
        },
        {
          path: 'register',
          component: RegisterComponent
        },
        { 
          path: 'products',
          component: ProductsPageComponent
        }
      ]
    }
  
];

@NgModule({
  declarations: [
    LoginComponent,
    AdminComponent,
    RegisterComponent,
    BuyerComponent,
    ProductsPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    TemplatesModule,
    OrganismModule,
    MoleculesModule,
    AtomsModule
  ],
  exports: [
    LoginComponent,
    AdminComponent,
    BuyerComponent,
    RegisterComponent,
    ProductsPageComponent
  ]
})
export class PagesModule { } 