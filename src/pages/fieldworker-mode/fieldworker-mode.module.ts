import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FieldworkerModePage } from './fieldworker-mode';

@NgModule({
  declarations: [
    FieldworkerModePage,
  ],
  imports: [
    IonicPageModule.forChild(FieldworkerModePage),
  ],
})
export class FieldworkerModePageModule {}
