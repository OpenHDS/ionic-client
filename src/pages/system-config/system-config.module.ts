import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SystemConfigPage } from './system-config';

@NgModule({
  declarations: [
    SystemConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(SystemConfigPage),
  ],
})
export class SystemConfigPageModule {}
