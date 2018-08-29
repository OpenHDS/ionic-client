import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DropdownSearchPage } from './dropdown-search';

@NgModule({
  declarations: [
    DropdownSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(DropdownSearchPage),
  ],
})
export class DropdownSearchPageModule {}
