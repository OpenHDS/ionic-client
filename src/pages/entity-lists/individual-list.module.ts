import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndividualListPage } from './individual-list';

@NgModule({
  declarations: [
    IndividualListPage,
  ],
  imports: [
    IonicPageModule.forChild(IndividualListPage),
  ],
})
export class IndividualListPageModule {}
