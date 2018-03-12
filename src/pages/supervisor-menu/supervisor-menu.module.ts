import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SupervisorMenuPage } from './supervisor-menu';

@NgModule({
  declarations: [
    SupervisorMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(SupervisorMenuPage),
  ],
})
export class MenuPageModule {}
