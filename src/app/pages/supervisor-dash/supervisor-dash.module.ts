import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SupervisorDashPage } from './supervisor-dash.page';
import {ComponentsModule} from "../../components/components";

const routes: Routes = [
  {
    path: '',
    component: SupervisorDashPage
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
  declarations: [SupervisorDashPage]
})
export class SupervisorDashPageModule {}
