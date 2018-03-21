import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationHierarchyPage } from './location-hierarchy';

@NgModule({
  declarations: [
    LocationHierarchyPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationHierarchyPage),
  ],
})
export class LocationHierarchyPageModule {}
