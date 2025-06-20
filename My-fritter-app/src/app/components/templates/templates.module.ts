import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MainTemplateComponent } from './main-template/main-template.component';
import { MoleculesModule } from '../molecules/molecules.module';
import { OrganismModule } from '../organism/organism.module';

@NgModule({
  declarations: [
    MainTemplateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MoleculesModule,
    OrganismModule
  ],
  exports: [
    MainTemplateComponent
  ]
})
export class TemplatesModule { } 