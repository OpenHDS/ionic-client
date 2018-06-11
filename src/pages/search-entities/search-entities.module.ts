import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchEntitiesPage } from './search-entities';

@NgModule({
  declarations: [
    SearchEntitiesPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchEntitiesPage),
  ],
})
export class SearchEntitiesPageModule {}
