import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateSocialGroupPage } from './create-social-group.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSocialGroupPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateSocialGroupPage]
})
export class CreateSocialGroupPageModule {}
