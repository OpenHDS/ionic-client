import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DatabaseSyncPage } from './database-sync.page';
import {ComponentsModule} from "../../components/components";

const routes: Routes = [
  {
    path: '',
    component: DatabaseSyncPage,
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
  declarations: [DatabaseSyncPage, ],
  providers: []
})
export class DatabaseSyncPageModule {}
