import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SynchronizeDbPage } from './synchronize-db';

@NgModule({
  declarations: [
    SynchronizeDbPage,
  ],
  imports: [
    IonicPageModule.forChild(SynchronizeDbPage),
  ],
})
export class SynchronizeDbPageModule {}
