import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateLocationPage } from './create-location';
import {CreateIndividualPage} from "./create-individual";

@NgModule({
  declarations: [
    CreateIndividualPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateIndividualPage),
  ],
})
export class CreateIndividualPageModule {}
