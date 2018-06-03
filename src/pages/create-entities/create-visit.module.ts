import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {CreateSocialGroupPage} from "./create-sg";
import {CreateVisitPage} from "./create-visit";

@NgModule({
  declarations: [
    CreateVisitPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateVisitPage),
  ],
})
export class CreateSgModule {}
