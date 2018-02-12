import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateLocationModalPage } from './create-location-modal';

@NgModule({
  declarations: [
    CreateLocationModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateLocationModalPage),
  ],
})
export class CreateLocationModalPageModule {}
