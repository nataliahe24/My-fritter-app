import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainTemplateComponent } from './main-template/main-template.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { OrganismModule } from '../organism/organism.module';
import { BuyerTemplateComponent } from './buyer-main-template/buyer-template.component';


@NgModule({
  declarations: [
    MainTemplateComponent,
    BuyerTemplateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MoleculesModule,
    OrganismModule
  ],
  exports: [
    MainTemplateComponent,
    BuyerTemplateComponent
  ]
})
export class TemplatesModule { } 