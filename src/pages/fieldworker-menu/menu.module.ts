import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FieldworkerMenuPage } from './menu';

@NgModule({
  declarations: [
    FieldworkerMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(FieldworkerMenuPage),
  ],
})
export class MenuPageModule {}
