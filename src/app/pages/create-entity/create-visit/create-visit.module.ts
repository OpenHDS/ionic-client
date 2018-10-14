import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateVisitPage } from './create-visit.page';
import {ComponentsModule} from "../../../components/components";

const routes: Routes = [
  {
    path: '',
    component: CreateVisitPage
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
  declarations: [CreateVisitPage]
})
export class CreateVisitPageModule {}
