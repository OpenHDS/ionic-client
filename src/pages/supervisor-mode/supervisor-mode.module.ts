import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupervisorModePage } from './supervisor-mode';

@NgModule({
  declarations: [
    SupervisorModePage,
  ],
  imports: [
    IonicPageModule.forChild(SupervisorModePage),
  ],
})
export class SuperviserModePageModule {}
