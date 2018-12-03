import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EntityCorrectionPage } from './entity-correction.page';
import {ComponentsModule} from "../../components/components";

const routes: Routes = [
  {
    path: '',
    component: EntityCorrectionPage,
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EntityCorrectionPage]
})
export class EntityCorrectionPageModule {}
