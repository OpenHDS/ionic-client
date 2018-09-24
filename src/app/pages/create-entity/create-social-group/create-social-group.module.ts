import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateSocialGroupPage } from './create-social-group.page';
import {ComponentsModule} from "../../../components/components";

const routes: Routes = [
  {
    path: '',
    component: CreateSocialGroupPage
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
  declarations: [CreateSocialGroupPage]
})
export class CreateSocialGroupPageModule {}
