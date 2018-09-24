import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateIndividualPage } from './create-individual.page';
import {ComponentsModule} from "../../../components/components";

const routes: Routes = [
  {
    path: '',
    component: CreateIndividualPage
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
  declarations: [CreateIndividualPage]
})
export class CreateIndividualPageModule {}
