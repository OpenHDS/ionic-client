import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {CreateSocialGroupPage} from "./create-sg";

@NgModule({
  declarations: [
    CreateSocialGroupPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateSocialGroupPage),
  ],
})
export class CreateSgModule {}
