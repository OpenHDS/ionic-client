import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BaselineCensusPage } from './baseline-census.page';
import {ComponentsModule} from "../../components/components";
import {LocationListComponent} from "../../components/location-list/location-list.component";

const routes: Routes = [
  {
    path: '',
    component: BaselineCensusPage
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
  declarations: [BaselineCensusPage, LocationListComponent],
  providers: []
})
export class BaselineCensusPageModule {}
