import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BaselineCensusPage } from './baseline-census';

@NgModule({
  declarations: [
    BaselineCensusPage,
  ],
  imports: [
    IonicPageModule.forChild(BaselineCensusPage),
  ],
})
export class BaselineCensusPageModule {}
