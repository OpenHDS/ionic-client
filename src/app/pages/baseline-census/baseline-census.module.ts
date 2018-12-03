import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BaselineCensusPage } from './baseline-census.page';
import {ComponentsModule} from "../../components/components";

const routes: Routes = [
  {
    path: '',
    component: BaselineCensusPage,
    runGuardsAndResolvers: 'always'
  }
];

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BaselineCensusPage],
  providers: []
})
export class BaselineCensusPageModule {}
