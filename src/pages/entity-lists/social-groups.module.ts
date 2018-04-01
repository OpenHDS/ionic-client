import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SocialGroupsPage } from './social-groups';

@NgModule({
  declarations: [
    SocialGroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(SocialGroupsPage),
  ],
})
export class SocialGroupsPageModule {}
