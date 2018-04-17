import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApproveEntriesPage } from './approve-entries';

@NgModule({
  declarations: [
    ApproveEntriesPage,
  ],
  imports: [
    IonicPageModule.forChild(ApproveEntriesPage),
  ],
})
export class ApproveEntriesPageModule {}
